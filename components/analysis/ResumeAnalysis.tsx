import React, { useState } from 'react';
import { tailorResume } from '../../services/geminiService';
import { ResumeData } from '../../types';
import ReactMarkdown from 'react-markdown';

interface ResumeAnalysisProps {
  resumeData: ResumeData;
  onNavigateToBuilder: () => void;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ resumeData, onNavigateToBuilder }) => {
  const [jdText, setJdText] = useState('');
  const [manualResumeText, setManualResumeText] = useState('');
  const [tailoredContent, setTailoredContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if we have builder data, OR if user has manually input text
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
      // If we have manual text, we construct a temporary ResumeData object to pass to the service
      // purely for the context of this operation
      let dataToUse = resumeData;
      if (!hasBuilderData && manualResumeText) {
          dataToUse = {
              ...resumeData,
              fullName: "Candidate", 
              summary: manualResumeText, // We pass the whole blob as summary for context if parsing isn't available
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Resume Tailor</h2>
        <p className="text-surface-500 mt-2 text-lg">
          Paste a job description, and we'll rewrite your resume to match it.
        </p>
      </div>

      {!tailoredContent ? (
        <div className="space-y-8">
            {/* Context Section: Builder Data OR Manual Upload */}
            {!hasBuilderData ? (
                 <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-surface-900">Resume Source</h3>
                        <button onClick={onNavigateToBuilder} className="text-primary-600 text-sm font-semibold hover:underline">
                            Go to Builder instead
                        </button>
                    </div>
                    
                    <div className="bg-surface-50 p-4 rounded-lg border border-dashed border-surface-300">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                            Upload Resume (Text/Markdown) or Paste Below
                        </label>
                        <input 
                            type="file" 
                            accept=".txt,.md"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all mb-4"
                        />
                        <textarea 
                            className="input-field h-40 resize-none text-sm"
                            placeholder="Or paste your existing resume content here manually..."
                            value={manualResumeText}
                            onChange={(e) => setManualResumeText(e.target.value)}
                        />
                    </div>
                 </div>
            ) : (
                <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg flex items-center gap-3 text-primary-800">
                    <span className="text-xl">✅</span>
                    <span className="text-sm font-medium">Using your <strong>Master Resume</strong> from the Builder.</span>
                </div>
            )}

          <div className="space-y-3">
            <label className="label-text">Target Job Description</label>
            <textarea
              className="input-field h-64 resize-none text-sm leading-relaxed"
              placeholder="Paste the job description (JD) here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleTailor}
              disabled={loading || !jdText || !hasContext}
              className={`px-10 py-4 rounded-full font-bold text-lg text-white shadow-xl transition-all transform hover:-translate-y-1
                ${loading || !jdText || !hasContext
                    ? 'bg-surface-300 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-900/30 ring-4 ring-primary-50'}`}
            >
              {loading ? 'Tailoring Resume...' : 'Tailor My Resume'}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
           <button 
             onClick={() => setTailoredContent('')}
             className="mb-6 px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center gap-2 transition-colors shadow-sm"
           >
             <span>←</span> Tailor for Another Job
           </button>
           <div className="bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden">
             <div className="bg-surface-900 p-6 text-white flex justify-between items-center">
               <h3 className="font-bold text-xl">Tailored Content Suggestion</h3>
               <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Gemini 1.5 Pro</div>
             </div>
             <div className="p-10 prose prose-slate max-w-none prose-headings:text-surface-900 prose-p:text-surface-700 prose-li:text-surface-700">
                <ReactMarkdown>{tailoredContent}</ReactMarkdown>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;