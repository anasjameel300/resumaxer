import React, { useState } from 'react';
import { analyzeAtsScore } from '../services/geminiService';
import { AtsAnalysis } from '../types';

const AtsScorer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingFile(true);
    setAnalysis(null); // Clear previous analysis

    try {
      if (file.type === 'application/pdf') {
        // PDF Parsing Logic using the library added in index.html
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
            alert('PDF Parsing library not loaded. Please refresh or use text upload.');
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
        // Text/Markdown Parsing
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

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeAtsScore(resumeText);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {!analysis && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Resume Analysis</h2>
            <p className="text-surface-500 mt-3 text-lg">Detailed AI evaluation of your resume content and structure.</p>
          </div>
      )}

      {!analysis ? (
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-2xl border border-dashed border-primary-200 shadow-sm hover:border-primary-400 transition-colors">
              <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      📂
                  </div>
                  <h3 className="font-bold text-surface-900 text-lg mb-1">Upload Resume</h3>
                  <p className="text-surface-500 text-sm mb-4">Support for PDF, TXT, or MD files</p>
                  
                  <div className="relative inline-block">
                      <input 
                          type="file" 
                          accept=".pdf,.txt,.md"
                          onChange={handleFileUpload}
                          disabled={parsingFile}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="bg-white text-surface-700 font-bold py-2 px-6 rounded-lg border border-surface-300 hover:bg-surface-50 shadow-sm transition-all pointer-events-none">
                          {parsingFile ? 'Reading File...' : 'Select File'}
                      </button>
                  </div>
              </div>
          </div>

          <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200"></div></div>
              <span className="relative bg-surface-50 px-4 text-sm text-surface-400 font-medium uppercase tracking-wider">Or Paste Text</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="label-text mb-0">Resume Content</label>
                {resumeText && (
                    <button onClick={() => setResumeText('')} className="text-xs text-red-500 hover:underline font-medium">Clear Text</button>
                )}
            </div>
            <textarea
              className="input-field h-64 resize-none text-sm font-mono leading-relaxed"
              placeholder="Copy and paste the full content of your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <div className="flex justify-center py-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText || parsingFile}
              className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3
                ${loading || !resumeText 
                    ? 'bg-surface-300 text-surface-500 cursor-not-allowed' 
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-900/30 ring-4 ring-primary-50'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing...
                </>
              ) : (
                <>Analyze My Resume</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
             <button 
             onClick={() => setAnalysis(null)}
             className="mb-4 px-4 py-2 text-sm font-medium text-surface-600 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 flex items-center gap-2 transition-colors shadow-sm"
           >
             <span>←</span> Analyze Another
           </button>
           
           <div className="bg-white rounded-2xl shadow-lg border border-surface-200 overflow-hidden">
               <div className="p-8 border-b border-surface-100 bg-surface-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-2">Analysis Report</h2>
                        <p className="text-surface-500 max-w-2xl">{analysis.summary}</p>
                    </div>
                    <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`text-5xl font-extrabold ${analysis.overallScore >= 80 ? 'text-emerald-600' : analysis.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{analysis.overallScore}</div>
                        <div className="text-xs font-bold text-surface-400 uppercase tracking-widest mt-1">Total Score</div>
                    </div>
               </div>

               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <ScoreBar 
                            label="Content Quality" 
                            score={analysis.contentQuality} 
                            description="Measures the substance of your experience. High scores require quantifiable achievements (e.g., 'Increased revenue by 20%') rather than generic duties."
                        />
                        <ScoreBar 
                            label="ATS & Structure" 
                            score={analysis.atsStructure} 
                            description="Indicates how easily Applicant Tracking Systems can parse your data. Complex columns, graphics, or tables can lower this score."
                        />
                        <ScoreBar 
                            label="Job Optimization" 
                            score={analysis.jobOptimization} 
                            description="Assesses keyword alignment with the target role. Missing industry-specific terms significantly reduces your chances of being seen."
                        />
                        <ScoreBar 
                            label="Writing Quality" 
                            score={analysis.writingQuality} 
                            description="Evaluates clarity, grammar, and tone. Active voice and strong action verbs convey confidence; typos signal a lack of detail."
                        />
                        <ScoreBar 
                            label="Application Ready" 
                            score={analysis.applicationReady} 
                            description="A holistic prediction of interview success. Scores below 70 suggest significant revisions are needed before applying."
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-surface-900 mb-4 flex items-center gap-2">
                            <span>🚀</span> Recommended Improvements
                        </h3>
                        <div className="bg-surface-50 rounded-xl p-1 border border-surface-100">
                            <ul className="divide-y divide-surface-100">
                                {analysis.improvements.map((item, idx) => (
                                    <li key={idx} className="p-4 flex gap-3 text-surface-700 hover:bg-white transition-colors rounded-lg">
                                        <span className="text-primary-500 font-bold mt-0.5">•</span>
                                        <span className="text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ScoreBar = ({ label, score, description }: { label: string, score: number, description?: string }) => {
    let colorClass = 'bg-red-500';
    let textClass = 'text-red-600';
    if (score >= 80) { colorClass = 'bg-emerald-500'; textClass = 'text-emerald-600'; }
    else if (score >= 60) { colorClass = 'bg-amber-500'; textClass = 'text-amber-600'; }
    
    return (
        <div className="group">
            <div className="flex justify-between mb-2 items-end">
                <span className="text-sm font-bold text-surface-800">{label}</span>
                <span className={`text-sm font-bold ${textClass}`}>{score}/100</span>
            </div>
            <div className="w-full bg-surface-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                <div className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${score}%` }}></div>
            </div>
            {description && (
                <p className="text-xs text-surface-500 leading-relaxed max-w-md">{description}</p>
            )}
        </div>
    );
};

export default AtsScorer;