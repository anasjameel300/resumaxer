import React, { useState, useRef, useEffect } from 'react';
import { roastMyResume } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const PERSONAS = [
    {
        id: 'hr',
        name: 'The Grumpy HR Manager',
        emoji: '👵',
        desc: 'Obsessed with gaps, formatting, and rules. Hates creativity.',
        color: 'from-gray-700 to-gray-900'
    },
    {
        id: 'ceo',
        name: 'The Savage Startup CEO',
        emoji: '🚀',
        desc: 'Brutally honest. Wants ROI, not buzzwords. Speaks in speed.',
        color: 'from-emerald-600 to-teal-800'
    },
    {
        id: 'friend',
        name: 'Successful College Friend',
        emoji: '🥂',
        desc: 'Condescendingly supportive. Remembers when you were average.',
        color: 'from-purple-600 to-pink-600'
    },
    {
        id: 'mirror',
        name: 'The Mirror You',
        emoji: '🪞',
        desc: 'Reflects your flaws. If you have typos, it has typos. Be warned.',
        color: 'from-orange-500 to-red-600'
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
        // Small timeout to ensure DOM render
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
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
            alert('PDF Parsing library not loaded. Please refresh.');
            setParsingFile(false);
            return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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

  const handlePersonaSelect = (id: string) => {
      setSelectedPersona(id);
      // Removed auto-generation logic. The user must explicitly click "Roast Me".
  };

  const activePersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight pb-2">
          Roast My Resume 🔥
        </h2>
        <p className="text-surface-500 mt-4 text-lg max-w-2xl mx-auto">
          Choose your tormentor and see what recruiters are actually thinking.
        </p>
      </div>

      {/* Persona Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePersonaSelect(p.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${selectedPersona === p.id ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 ring-offset-2' : 'border-surface-200 bg-white hover:border-primary-300'}`}
              >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-md mb-3`}>
                      {p.emoji}
                  </div>
                  <h3 className="font-bold text-surface-900 text-sm mb-1">{p.name}</h3>
                  <p className="text-xs text-surface-500 leading-relaxed">{p.desc}</p>
              </button>
          ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-surface-200">
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-surface-700">Upload or Paste Resume</h3>
              {resumeText && <button onClick={() => setResumeText('')} className="text-xs text-red-500 font-bold hover:underline">Clear</button>}
          </div>
          
          {/* File Upload Area */}
          {!resumeText && (
             <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center bg-surface-50 hover:bg-surface-100 transition-colors relative mb-4">
                 <input 
                    type="file" 
                    accept=".pdf,.txt,.md"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={parsingFile}
                 />
                 <div className="text-4xl mb-2">📂</div>
                 <p className="font-bold text-surface-700">{parsingFile ? "Reading..." : "Drop PDF or Text File Here"}</p>
                 <p className="text-xs text-surface-400 mt-1">or click to browse</p>
             </div>
          )}

          <div className="relative group">
            <textarea
            className={`w-full h-64 p-4 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm font-mono text-surface-800 placeholder-surface-400 transition-all ${!resumeText ? 'hidden' : 'block'}`}
            placeholder="Or paste your text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
                onClick={handleRoast}
                disabled={loading || !resumeText}
                className={`px-10 py-4 bg-gradient-to-r ${activePersona.color} hover:brightness-110 text-white font-bold text-xl rounded-2xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3`}
            >
                {loading ? (
                    <>
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         {selectedPersona === 'mirror' ? 'Reflecting...' : 'Roasting...'}
                    </>
                ) : (
                    <>
                        <span>{activePersona.emoji}</span> Roast Me
                    </>
                )}
            </button>
          </div>
      </div>

      {roast && (
        <div ref={roastRef} className="mt-8 animate-fade-in max-w-4xl mx-auto scroll-mt-6">
             <div className={`relative bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-4 ${selectedPersona === 'hr' ? 'border-gray-200' : selectedPersona === 'ceo' ? 'border-emerald-100' : selectedPersona === 'friend' ? 'border-purple-100' : 'border-orange-100'}`}>
                <div className={`absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br ${activePersona.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg transform -rotate-6`}>
                    {activePersona.emoji}
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-6 pl-8">{activePersona.name} says:</h3>
                <div className="prose prose-lg text-surface-700 whitespace-pre-line leading-relaxed">
                    <ReactMarkdown>{roast}</ReactMarkdown>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default RoastResume;