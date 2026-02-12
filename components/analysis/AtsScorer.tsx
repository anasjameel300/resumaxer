import React, { useState, useEffect } from 'react';
import { analyzeAtsScore } from '../../services/geminiService';
import { AtsAnalysis } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  BarChart,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Target,
  FileCheck,
  Search,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AtsScorerProps {
  onImprove?: (resumeText: string, improvements: string[]) => void;
  initialText?: string;
}

const AtsScorer: React.FC<AtsScorerProps> = ({ onImprove, initialText }) => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);

  // Auto-analyze if initial text is provided
  useEffect(() => {
    if (initialText) {
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

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || resumeText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeAtsScore(text);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveClick = async () => {
    if (!onImprove || !analysis) return;
    setImproving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    await onImprove(resumeText, analysis.improvements);
    setImproving(false);
  };

  return (
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
                    <Button variant="ghost" size="sm" onClick={() => setResumeText('')} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8">Cleat Text</Button>
                  )}
                </div>
                <Textarea
                  className="min-h-[300px] resize-y bg-zinc-950/50 border-white/10 font-mono text-sm leading-relaxed focus:ring-primary/50"
                  placeholder="Copy and paste the full content of your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
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
                onClick={() => setAnalysis(null)}
                className="border-white/10 hover:bg-white/5 text-muted-foreground"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Analyze Another
              </Button>

              <Button
                onClick={handleImproveClick}
                disabled={improving}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
              >
                {improving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Preparing Wizard...
                  </>
                ) : (
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
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                          strokeDasharray={2 * Math.PI * 88}
                          strokeDashoffset={2 * Math.PI * 88 * (1 - analysis.overallScore / 100)}
                          className={cn(
                            "transition-all duration-1000 ease-out",
                            analysis.overallScore >= 80 ? 'text-emerald-500' : analysis.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                          )}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn(
                          "text-6xl font-black font-heading",
                          analysis.overallScore >= 80 ? 'text-emerald-500' : analysis.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                        )}>{analysis.overallScore}</span>
                        <span className="text-xs text-muted-foreground font-bold uppercase mt-1">/ 100</span>
                      </div>
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
