import React, { useState, useRef, useEffect } from 'react';
import { roastMyResume } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Upload, FileText, Sparkles, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONAS = [
  {
    id: 'hr',
    name: 'The Grumpy HR Manager',
    emoji: '👵',
    desc: 'Obsessed with gaps, formatting, and rules. Hates creativity.',
    gradient: 'from-gray-700 to-zinc-900',
    border: 'border-zinc-700'
  },
  {
    id: 'ceo',
    name: 'The Savage Startup CEO',
    emoji: '🚀',
    desc: 'Brutally honest. Wants ROI, not buzzwords. Speaks in speed.',
    gradient: 'from-emerald-600 to-teal-900',
    border: 'border-emerald-700'
  },
  {
    id: 'friend',
    name: 'Successful College Friend',
    emoji: '🥂',
    desc: 'Condescendingly supportive. Remembers when you were average.',
    gradient: 'from-purple-600 to-pink-900',
    border: 'border-purple-700'
  },
  {
    id: 'mirror',
    name: 'The Mirror You',
    emoji: '🪞',
    desc: 'Reflects your flaws. If you have typos, it has typos. Be warned.',
    gradient: 'from-orange-500 to-red-900',
    border: 'border-red-700'
  }
];

const RoastResume: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('hr');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const roastRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to roast result when it appears
  useEffect(() => {
    if (roast && roastRef.current) {
      setTimeout(() => {
        roastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [roast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    setRoast('');

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
      alert("Could not read file.");
    } finally {
      setParsingFile(false);
    }
  };

  const handleRoast = async () => {
    if (!resumeText.trim()) return;

    setLoading(true);
    setRoast('');

    try {
      const result = await roastMyResume(resumeText, selectedPersona);
      setRoast(result);
    } catch (error) {
      console.error(error);
      setRoast("The AI was too stunned by your resume to speak. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const activePersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight pb-2 inline-block relative">
          Roast My Resume
          <span className="absolute -top-2 -right-6 text-4xl animate-pulse">🔥</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose your tormentor. Find out what recruiters are <em>actually</em> thinking but legally can't say.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PERSONAS.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => setSelectedPersona(p.id)}
              className={cn(
                "cursor-pointer transition-all duration-300 relative overflow-hidden h-full border-2",
                selectedPersona === p.id
                  ? `bg-zinc-900/80 ${p.border} shadow-lg shadow-${p.border.split('-')[1]}-500/20`
                  : "bg-zinc-900/30 border-white/5 hover:border-white/20 hover:bg-zinc-900/50"
              )}
            >
              {/* Gradient Overlay for active state */}
              {selectedPersona === p.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-10 pointer-events-none`} />
              )}

              <CardContent className="p-6 text-center space-y-4 relative z-10">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-300",
                  "bg-gradient-to-br", p.gradient,
                  selectedPersona === p.id ? "scale-110 rotate-3" : "opacity-80 grayscale-[0.5]"
                )}>
                  {p.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-2">{p.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <Card className="bg-zinc-900/40 border-white/5 overflow-hidden backdrop-blur-md">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Resume Content
            </h3>
            {resumeText && (
              <Button variant="ghost" size="sm" onClick={() => setResumeText('')} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                <X className="w-4 h-4 mr-2" /> Clear
              </Button>
            )}
          </div>

          {!resumeText ? (
            <div className="border-2 border-dashed border-zinc-700 hover:border-primary/50 hover:bg-zinc-900/60 rounded-xl p-10 text-center transition-all duration-300 group cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                disabled={parsingFile}
              />
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {parsingFile ? <RefreshCw className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <p className="font-bold text-lg text-foreground mb-1">{parsingFile ? "Parsing Resume..." : "Drop your resume here"}</p>
              <p className="text-sm text-muted-foreground">Support for PDF, TXT, MD</p>
            </div>
          ) : (
            <div className="relative group">
              <Textarea
                className="min-h-[300px] p-6 text-sm font-mono leading-relaxed bg-zinc-950/50 border-zinc-800 focus:ring-primary/50 resize-y"
                placeholder="Or paste your text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-zinc-900/80 px-2 py-1 rounded">
                {resumeText.length} chars
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleRoast}
              disabled={loading || !resumeText}
              size="lg"
              className={cn(
                "text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-orange-900/20 transition-all hover:scale-105",
                "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0"
              )}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                  {selectedPersona === 'mirror' ? 'Reflecting on your poor choices...' : 'Preparing insults...'}
                </>
              ) : (
                <>
                  <span className="text-2xl mr-3">{activePersona.emoji}</span>
                  ROAST ME
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Display */}
      <AnimatePresence>
        {roast && (
          <motion.div
            ref={roastRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="mt-12 scroll-mt-24"
          >
            <div className={cn(
              "relative bg-zinc-950 border-2 p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden",
              activePersona.border
            )}>
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${activePersona.gradient} opacity-[0.07] blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32`} />

              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl shadow-xl transform -rotate-3 border-2 border-white/10",
                    "bg-gradient-to-br", activePersona.gradient
                  )}>
                    {activePersona.emoji}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-1">{activePersona.name}</h3>
                    <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      Brutally Honest Feedback
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-loose">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-4 text-justify" {...props} />,
                      strong: ({ node, ...props }) => <span className="text-primary font-bold bg-primary/10 px-1 rounded" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    }}
                  >
                    {roast}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoastResume;
