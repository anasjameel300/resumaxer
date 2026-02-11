import React, { useState } from 'react';
import { generateCoverLetter } from '../../services/geminiService';
import { ResumeData } from '../../types';

interface CoverLetterGeneratorProps {
  data: ResumeData;
  onNavigateToBuilder: () => void;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ data, onNavigateToBuilder }) => {
  const [jdText, setJdText] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);

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
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Cover Letter Generator</h2>
        <p className="text-surface-500 mt-2 text-lg">
          Turn your resume and a job description into a persuasive cover letter in seconds.
        </p>
      </div>

      {!generatedLetter ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Data Check */}
          {!hasData && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-amber-900">Resume Data Missing</h4>
                <p className="text-sm text-amber-700 mt-1">
                  We don't see much info in your profile. The cover letter might be generic. 
                  <button onClick={onNavigateToBuilder} className="underline font-bold ml-1 hover:text-amber-900">
                    Add details in Builder first.
                  </button>
                </p>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200">
            <label className="label-text text-lg mb-3">Paste the Job Description</label>
            <textarea
              className="input-field h-64 resize-none text-sm leading-relaxed"
              placeholder="Paste the full job description here (Responsibilities, Requirements, etc.)..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !jdText}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-2
                  ${loading || !jdText 
                      ? 'bg-surface-300 cursor-not-allowed' 
                      : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-900/20'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Drafting...
                  </>
                ) : (
                  <>
                    <span>✨</span> Generate Letter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls - Left Side */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <h3 className="font-bold text-surface-900 mb-4">Actions</h3>
                <div className="space-y-3">
                    <button 
                      onClick={handlePrint}
                      className="w-full py-3 px-4 bg-surface-900 text-white rounded-lg font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Download PDF
                    </button>
                    <button 
                      onClick={() => setGeneratedLetter('')}
                      className="w-full py-3 px-4 bg-white border border-surface-300 text-surface-600 rounded-lg font-bold hover:bg-surface-50 transition-colors"
                    >
                      Start Over
                    </button>
                </div>
             </div>

             <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">Tips</h3>
                <ul className="text-sm text-primary-700 space-y-2 list-disc ml-4">
                   <li>Review the letter for accuracy.</li>
                   <li>Add specific anecdotes AI might have missed.</li>
                   <li>Ensure the tone matches the company culture.</li>
                </ul>
             </div>
          </div>

          {/* Editor - Right Side */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden">
                <div className="bg-surface-50 px-6 py-4 border-b border-surface-200 flex justify-between items-center">
                   <span className="font-bold text-surface-500 text-sm uppercase tracking-wide">Document Preview</span>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                </div>
                
                {/* Print Container */}
                <div id="cover-letter-container" className="p-10 md:p-16 min-h-[800px] bg-white text-surface-800">
                   <textarea 
                      className="w-full h-full min-h-[700px] resize-none outline-none border-none p-0 text-base leading-relaxed font-serif text-justify bg-transparent"
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                   />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;
