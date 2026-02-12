import React, { useState } from 'react';
import { tailorResume } from '../../services/geminiService';
import { ResumeData } from '../../types';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  FileText,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Upload,
  RefreshCw,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeAnalysisProps {
  resumeData: ResumeData;
  onNavigateToBuilder: () => void;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ resumeData, onNavigateToBuilder }) => {
  const [jdText, setJdText] = useState('');
  const [manualResumeText, setManualResumeText] = useState('');
  const [tailoredContent, setTailoredContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if we have builder data, OR if user has manual input
  const hasBuilderData = resumeData.experience.length > 0 || resumeData.summary.length > 0;
  const hasContext = hasBuilderData || manualResumeText.length > 50;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setManualResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleTailor = async () => {
    if (!hasContext) return;
    if (!jdText.trim()) return;

    setLoading(true);
    try {
      let dataToUse = resumeData;
      if (!hasBuilderData && manualResumeText) {
        dataToUse = {
          ...resumeData,
          fullName: "Candidate",
          summary: manualResumeText,
          experience: [],
          skills: []
        };
      }

      const result = await tailorResume(dataToUse, jdText);
      setTailoredContent(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">

      {!tailoredContent && (
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Tailor</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Paste a job description to rewrite your resume for maximum impact.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!tailoredContent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >

            {/* Source Selection - Only if Builder Data is missing */}
            {!hasBuilderData ? (
              <Card className="bg-zinc-900/40 border-white/5 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" /> Resume Source
                    </CardTitle>
                    <Button variant="link" onClick={onNavigateToBuilder} className="text-purple-400 h-auto p-0 hover:text-purple-300">
                      Go to Builder →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors relative group">
                    <input
                      type="file"
                      accept=".txt,.md"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-foreground">Upload Text/Markdown</p>
                    <p className="text-xs text-muted-foreground mt-1">or paste below</p>
                  </div>
                  <Textarea
                    className="input-field h-32 resize-none text-sm bg-zinc-950/50 border-white/10"
                    placeholder="Paste your existing resume content here manually..."
                    value={manualResumeText}
                    onChange={(e) => setManualResumeText(e.target.value)}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Using your <strong>Master Resume</strong> from the Builder.</span>
              </div>
            )}

            <Card className="bg-zinc-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Target Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[250px] resize-y bg-zinc-950/50 border-white/10 text-sm leading-relaxed font-mono focus:ring-primary/50"
                  placeholder="Paste the full job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleTailor}
                disabled={loading || !jdText || !hasContext}
                size="lg"
                className={cn(
                  "px-10 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105",
                  "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-purple-900/20"
                )}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                    Tailoring Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" /> Tailor My Resume
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-in fade-in duration-500"
          >
            <Button
              variant="outline"
              onClick={() => setTailoredContent('')}
              className="mb-8 border-white/10 hover:bg-white/5 text-muted-foreground"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Tailor Another
            </Button>

            <Card className="bg-zinc-900 border-white/5 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Tailored Suggestions</h3>
                    <p className="text-xs text-purple-200">Optimized for ATS & Keywords</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0" onClick={() => navigator.clipboard.writeText(tailoredContent)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>

              <CardContent className="p-8 md:p-10">
                <div className="prose prose-invert prose-lg max-w-none prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-strong:text-purple-400 prose-li:text-zinc-300">
                  <ReactMarkdown>{tailoredContent}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalysis;
