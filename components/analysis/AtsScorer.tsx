import React, { useState, useEffect } from 'react';
import { analyzeAtsScore, generateClarificationQuestionsForAts, improveAndParseResume } from '../../services/geminiService';
import { AtsAnalysis, WizardInitialData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FileSearch,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Sparkles,
  BrainCircuit,
  ChevronRight,
  Upload,
  FileText,
  BarChart,
  XCircle,
  RefreshCw,
  ArrowRight,
  Target,
  FileCheck,
  Search,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AtsScorerProps {
  onImprove?: (resumeText: string, improvements: string[]) => void;
  initialText?: string;
  cachedText?: string;
  cachedAnalysis?: AtsAnalysis | null;
  onStateChange?: (text: string, analysis: AtsAnalysis | null) => void;
  onImproveComplete?: (wizardData: any, oldScore: number, newScore: number) => void;
  cachedQuestions?: string[] | null;
  cachedResumeForQuestions?: string | null;
  onCacheQuestions?: (text: string, questions: string[]) => void;
}

const AtsScorer: React.FC<AtsScorerProps> = ({
  onImprove,
  initialText,
  cachedText,
  cachedAnalysis,
  onStateChange,
  onImproveComplete,
  cachedQuestions,
  cachedResumeForQuestions,
  onCacheQuestions
}) => {
  const [resumeText, setResumeText] = useState(cachedText ?? '');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(cachedAnalysis ?? null);

  // Q&A Modal State
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [improvingStep, setImprovingStep] = useState<'idle' | 'generating_questions' | 'waiting_answers' | 'rewriting'>('idle');

  // Auto-analyze if initial text is provided (only when no cached state)
  useEffect(() => {
    if (initialText && !cachedAnalysis) {
      setResumeText(initialText);
      handleAnalyze(initialText);
    }
  }, [initialText]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    setAnalysis(null);

    try {
      if (file.type === 'application/pdf') {
        const pdfJS = await import('pdfjs-dist');
        pdfJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfJS.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setResumeText(fullText);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setResumeText(text);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error reading file", error);
      alert("Could not read file. Please try copying and pasting the text instead.");
    } finally {
      setParsingFile(false);
    }
  };

  const setResumeTextAndNotify = (text: string) => {
    setResumeText(text);
    onStateChange?.(text, analysis);
  };

  const setAnalysisAndNotify = (result: AtsAnalysis | null) => {
    setAnalysis(result);
    onStateChange?.(resumeText, result);
  };

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || resumeText;
    if (!text.trim()) return;

    setLoading(true);
    setImprovingStep('idle'); // Reset state if analyzing a new resume
    try {
      const result = await analyzeAtsScore(text);
      setAnalysisAndNotify(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveClick = async () => {
    if (!analysis) return;

    // Check Cache
    if (cachedQuestions !== null && cachedResumeForQuestions === resumeText) {
      if (cachedQuestions.length > 0) {
        setQuestions(cachedQuestions);
        setAnswers({});
        setShowModal(true);
        setImprovingStep('waiting_answers');
      } else {
        await processRewrite({});
      }
      return;
    }

    setImproving(true);
    setImprovingStep('generating_questions');

    try {
      // 1. Ask AI for 2-3 specific questions based on the weak points
      const qs = await generateClarificationQuestionsForAts(resumeText, analysis.improvements);

      // Save to Global Dashboard Cache
      onCacheQuestions?.(resumeText, qs);

      if (qs && qs.length > 0) {
        setQuestions(qs);
        setAnswers({});
        setShowModal(true);
        setImprovingStep('waiting_answers');
      } else {
        // If AI miraculously has no questions, skip straight to rewriting (rare)
        await processRewrite({});
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
      alert("Something went wrong. Let's try skipping straight to the improvement.");
      await processRewrite({});
    } finally {
      if (improvingStep !== 'waiting_answers') {
        setImproving(false);
      }
    }
  };

  const processRewrite = async (userAnswers: Record<string, string>) => {
    if (!analysis || !onImproveComplete) return;

    setImprovingStep('rewriting');
    setImproving(true);

    try {
      // 2. Rewrite and parse into builder format
      const wizardData: any = await improveAndParseResume(resumeText, analysis.improvements, userAnswers);

      // 3. Compute the old overall score for comparison
      const oldScore = Math.round(
        (analysis.contentQuality + analysis.atsStructure + analysis.jobOptimization + analysis.writingQuality + analysis.applicationReady) / 5
      );

      // 4. Re-scan the new data to get the accurate new score
      const newTextString = `
Name: ${wizardData.fullName || ''}
Summary: ${wizardData.summary || ''}
Experience: ${Array.isArray(wizardData.experience) ? wizardData.experience.map((e: any) => (e.role || '') + ' ' + (e.company || '') + '\n' + (e.details || '')).join('\n') : ''}
Education: ${Array.isArray(wizardData.education) ? wizardData.education.map((e: any) => (e.degree || '') + ' ' + (e.school || '')).join('\n') : ''}
Skills: ${Array.isArray(wizardData.skills) ? wizardData.skills.join(', ') : (typeof wizardData.skills === 'string' ? wizardData.skills : '')}
`;
      const newAnalysis = await analyzeAtsScore(newTextString);
      const newScore = Math.round((newAnalysis.contentQuality + newAnalysis.atsStructure + newAnalysis.jobOptimization + newAnalysis.writingQuality + newAnalysis.applicationReady) / 5);

      setShowModal(false);
      onImproveComplete(wizardData, oldScore, newScore); // View transition happens here
    } catch (error) {
      console.error("Failed to rewrite resume:", error);
      alert("Failed to improve resume. Please try again.");
    } finally {
      setImprovingStep('idle');
      setImproving(false);
      setShowModal(false);
    }
  };

  const handleModalSubmit = () => {
    processRewrite(answers);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
        {!analysis && (
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Resume Analysis
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get a detailed AI evaluation of your resume content, structure, and ATS compatibility.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >

              {/* Upload Section */}
              <Card className="bg-zinc-900/40 border-white/5 overflow-hidden backdrop-blur-md group hover:bg-zinc-900/60 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  disabled={parsingFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                    {parsingFile ? <RefreshCw className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-2">Upload Resume</h3>
                  <p className="text-muted-foreground text-sm">PDF, TXT, or MD files supported</p>

                  <div className="mt-6 inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                    {parsingFile ? 'Reading File...' : 'Select File'}
                  </div>
                </CardContent>
              </Card>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative bg-background px-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">Or Paste Text</span>
              </div>

              <Card className="bg-zinc-900/40 border-white/5">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Resume Content
                    </h3>
                    {resumeText && (
                      <Button variant="ghost" size="sm" onClick={() => { setResumeTextAndNotify(''); setAnalysisAndNotify(null); }} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8">Clear Text</Button>
                    )}
                  </div>
                  <Textarea
                    className="min-h-[300px] resize-y bg-zinc-950/50 border-white/10 font-mono text-sm leading-relaxed focus:ring-primary/50"
                    placeholder="Copy and paste the full content of your resume here..."
                    value={resumeText}
                    onChange={(e) => setResumeTextAndNotify(e.target.value)}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !resumeText || parsingFile}
                  size="lg"
                  className={cn(
                    "px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105",
                    "bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white border-0"
                  )}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" /> Analyze My Resume
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <Button
                  variant="outline"
                  onClick={() => setAnalysisAndNotify(null)}
                  className="border-white/10 hover:bg-white/5 text-muted-foreground"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Analyze Another
                </Button>

                <Button
                  onClick={handleImproveClick}
                  disabled={improving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                >
                  {improvingStep === 'generating_questions' && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing Weak Points...
                    </>
                  )}
                  {improvingStep === 'waiting_answers' && (
                    <>
                      <Loader2 className="w-4 h-4 mr-2" />
                      Waiting for input...
                    </>
                  )}
                  {improvingStep === 'rewriting' && (
                    <>
                      <BrainCircuit className="w-4 h-4 animate-pulse mr-2" />
                      Rewriting Resume...
                    </>
                  )}
                  {improvingStep === 'idle' && (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Improve with AI
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Overall Score & Summary */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-zinc-900 border-white/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-20" />
                    <CardContent className="p-8 text-center relative z-10">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Overall Score</h3>
                      <div className="relative inline-flex items-center justify-center">
                        {/* Compute score as average of 5 sub-scores for consistency */}
                        {(() => {
                          const score = Math.round(
                            (analysis.contentQuality + analysis.atsStructure + analysis.jobOptimization + analysis.writingQuality + analysis.applicationReady) / 5
                          );
                          const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';
                          return (
                            <>
                              <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                  strokeDasharray={2 * Math.PI * 88}
                                  strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                                  className={cn("transition-all duration-1000 ease-out", color)}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn("text-6xl font-black font-heading", color)}>{score}</span>
                                <span className="text-xs text-muted-foreground font-bold uppercase mt-1">/ 100</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {analysis.summary}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Details & Improvements */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-primary" /> Performance Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ScoreBar
                        label="Content Quality"
                        score={analysis.contentQuality}
                        icon={<FileCheck className="w-4 h-4" />}
                        description="Depth of experience and achievements."
                      />
                      <ScoreBar
                        label="ATS Structure"
                        score={analysis.atsStructure}
                        icon={<Target className="w-4 h-4" />}
                        description="Parsability by tracking systems."
                      />
                      <ScoreBar
                        label="Job Optimization"
                        score={analysis.jobOptimization}
                        icon={<Search className="w-4 h-4" />}
                        description="Keyword alignment with roles."
                      />
                      <ScoreBar
                        label="Writing Quality"
                        score={analysis.writingQuality}
                        icon={<PenTool className="w-4 h-4" />}
                        description="Clarity, grammar, and tone."
                      />
                      <div className="pt-4 border-t border-white/5">
                        <ScoreBar
                          label="Application Readiness"
                          score={analysis.applicationReady}
                          icon={<CheckCircle2 className="w-4 h-4" />}
                          description="Likelihood of interview."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-white/5 overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5">
                      <CardTitle className="flex items-center gap-2 text-amber-500">
                        <Sparkles className="w-5 h-5" /> Recommended Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                        {analysis.improvements.map((item, idx) => (
                          <div key={idx} className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-amber-500 font-bold text-xs">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Q&A Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        setShowModal(open);
        if (!open) setImprovingStep('idle');
      }}>
        <DialogContent className="sm:max-w-[600px] bg-zinc-950 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-primary" />
              Let's make this perfect
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base mt-2">
              Your resume forms a great baseline, but the AI needs a few specific details to maximize its impact and ATS score.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-3 p-4 bg-zinc-900/50 border border-white/5 rounded-xl shadow-sm">
                <Label className="text-sm font-medium text-white leading-relaxed block">
                  {q}
                </Label>
                <Textarea
                  placeholder="Keep it brief, just give the facts..."
                  value={answers[idx] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                  className="bg-black/40 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 min-h-[80px] transition-all resize-y"
                />
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-between border-t border-white/10 pt-4 mt-2">
            <Button
              variant="ghost"
              onClick={() => processRewrite({})}
              className="text-zinc-500 hover:text-zinc-300"
              disabled={improvingStep === 'rewriting'}
            >
              Skip & Improve As Is
            </Button>
            <Button
              onClick={handleModalSubmit}
              disabled={improvingStep === 'rewriting'}
              className="bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg mx-auto sm:mx-0 w-full sm:w-auto"
            >
              {improvingStep === 'rewriting' ? (
                <>
                  <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" /> Just a sec...
                </>
              ) : (
                <>
                  Rewrite My Resume <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ScoreBar = ({ label, score, description, icon }: { label: string, score: number, description?: string, icon?: React.ReactNode }) => {
  let colorClass = 'bg-red-500';
  let textClass = 'text-red-500';
  if (score >= 80) { colorClass = 'bg-emerald-500'; textClass = 'text-emerald-500'; }
  else if (score >= 60) { colorClass = 'bg-amber-500'; textClass = 'text-amber-500'; }

  return (
    <div className="group">
      <div className="flex justify-between mb-2 items-center">
        <span className="text-sm font-bold text-foreground flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label}
        </span>
        <span className={cn("text-sm font-bold font-mono", textClass)}>{score}/100</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default AtsScorer;
