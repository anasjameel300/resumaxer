import React, { useState, useRef } from 'react';
import { generateCoverLetter } from '../../services/geminiService';
import { ResumeData } from '../../types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PenTool,
  Printer,
  RefreshCw,
  Sparkles,
  FileText,
  AlertTriangle,
  Download,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoverLetterGeneratorProps {
  data: ResumeData;
  onNavigateToBuilder: () => void;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ data, onNavigateToBuilder }) => {
  const [jdText, setJdText] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const hasData = data.experience.length > 0 || data.projects.length > 0 || data.summary.length > 0;

  const handleGenerate = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    try {
      const letter = await generateCoverLetter(data, jdText);
      setGeneratedLetter(letter);
    } catch (e) {
      console.error(e);
      alert("Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    // Create a temporary iframe to print only the content
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);

    const content = printRef.current.innerHTML;
    const doc = iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(`
            <html>
                <head>
                    <title>Cover Letter</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; padding: 40px; color: black; }
                        p { margin-bottom: 1em; }
                    </style>
                </head>
                <body>
                    ${content.replace(/\n/g, '<br/>')}
                </body>
            </html>
        `);
      doc.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {!generatedLetter && (
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Cover Letter <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">Generator</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Turn your resume and a job description into a persuasive cover letter in seconds.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!generatedLetter ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            {/* Data Check */}
            {!hasData && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4 text-amber-500">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Resume Data Missing</h4>
                  <p className="text-xs mt-1 text-amber-400/80 leading-relaxed">
                    We don't see much info in your profile. The cover letter might be generic.
                    <Button variant="link" onClick={onNavigateToBuilder} className="text-amber-400 p-0 h-auto font-bold ml-1 hover:text-amber-300">
                      Add details in Builder first.
                    </Button>
                  </p>
                </div>
              </div>
            )}

            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <FileText className="w-4 h-4 text-primary" /> Target Job Description
                </div>
                <Textarea
                  className="min-h-[300px] resize-y bg-zinc-950/50 border-white/10 text-sm leading-relaxed font-mono focus:ring-primary/50"
                  placeholder="Paste the full job description here (Responsibilities, Requirements, etc.)..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={loading || !jdText}
                size="lg"
                className={cn(
                  "px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105",
                  "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 shadow-emerald-900/20"
                )}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                    Drafting Letter...
                  </>
                ) : (
                  <>
                    <PenTool className="w-5 h-5 mr-3" /> Generate Letter
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Controls - Left Side */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-zinc-900 border-white/5 overflow-hidden">
                <div className="p-6 bg-white/5 border-b border-white/5">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Actions
                  </h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={handlePrint}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download / Print PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedLetter('')}
                    className="w-full border-white/10 hover:bg-white/5 text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/5 border-blue-500/10">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Pro Tips
                  </h3>
                  <ul className="text-xs text-blue-300 space-y-2 list-disc ml-4 leading-relaxed">
                    <li>Review the letter for factual accuracy.</li>
                    <li>Add specific anecdotes the AI might have missed.</li>
                    <li>Ensure the tone matches the company culture perfectly.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Editor - Right Side */}
            <div className="lg:col-span-8">
              <Card className="bg-white text-zinc-900 rounded-sm shadow-2xl overflow-hidden relative">
                {/* Paper Texture/Header */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500" />

                <div className="bg-zinc-50 px-8 py-4 border-b border-zinc-200 flex justify-between items-center print:hidden">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                  </div>
                  <span className="font-bold text-zinc-400 text-xs uppercase tracking-wide">Document Preview</span>
                </div>

                {/* Print Container */}
                <div className="p-12 md:p-16 min-h-[800px] bg-white relative">
                  <div ref={printRef} className="hidden print:block whitespace-pre-wrap font-serif text-black leading-relaxed text-sm">
                    {generatedLetter}
                  </div>
                  <textarea
                    className="w-full h-full min-h-[700px] resize-none outline-none border-none p-0 text-base leading-loose font-serif text-justify bg-transparent text-zinc-800 placeholder:text-zinc-300 focus:ring-0 selection:bg-emerald-100 selection:text-emerald-900"
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                  />
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoverLetterGenerator;
