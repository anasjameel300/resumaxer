import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateCareerRoadmap } from '../services/geminiService';
import { ResumeData } from '../types';

interface CareerRoadmapProps {
  data: ResumeData;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ data }) => {
  const [targetRole, setTargetRole] = useState('');
  const [currentRole, setCurrentRole] = useState(data.experience[0]?.role || '');
  const [currentSkills, setCurrentSkills] = useState(data.skills.join(', ') || '');
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    try {
      // Create a temporary data object with the edited fields to send to the AI
      const contextData: ResumeData = {
          ...data,
          experience: [{ ...data.experience[0], role: currentRole, id: 'temp', company: '', duration: '', details: '' }],
          skills: currentSkills.split(',').map(s => s.trim()).filter(s => s)
      };

      const result = await generateCareerRoadmap(contextData, targetRole);
      setRoadmap(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Career Roadmap Generator</h2>
        <p className="text-surface-500 mt-2 text-lg">
          Visualize your personalized path from where you are to where you want to be.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Side (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Start Point Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center text-sm">📍</span>
                    Starting Point
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-surface-400 uppercase mb-1 block">Current Role</label>
                        <input 
                            type="text"
                            className="input-field text-sm"
                            placeholder="e.g. Junior Developer"
                            value={currentRole}
                            onChange={(e) => setCurrentRole(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-surface-400 uppercase mb-1 block">Key Skills</label>
                        <textarea 
                            className="input-field text-sm resize-none h-24"
                            placeholder="e.g. JavaScript, React, Communication..."
                            value={currentSkills}
                            onChange={(e) => setCurrentSkills(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Destination Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">🏁</span>
                     Dream Destination
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-surface-400 uppercase mb-1 block">Target Job Title</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                className="input-field text-lg py-3 pl-10 shadow-sm border-primary-200 focus:border-primary-500 focus:ring-primary-500/20"
                                placeholder="e.g. Senior ML Engineer"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300 text-lg">🚀</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !targetRole}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Planning Route...
                            </span>
                        ) : (
                            "Generate Roadmap"
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Output Side (8 cols) */}
        <div className="lg:col-span-8">
            <div className={`bg-white rounded-2xl border border-surface-200 shadow-lg min-h-[600px] p-8 md:p-10 ${!roadmap ? 'flex items-center justify-center bg-surface-50/50' : ''}`}>
                {!roadmap ? (
                    <div className="text-center text-surface-400 max-w-sm">
                        <div className="text-7xl mb-6 opacity-20">🗺️</div>
                        <h3 className="text-xl font-bold text-surface-500 mb-2">Ready to Map Your Future?</h3>
                        <p className="leading-relaxed">Enter your current details and your dream job on the left, and our AI will build a step-by-step learning path for you.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-surface-100">
                            <div>
                                <h3 className="text-2xl font-bold text-surface-900">Your Personal Roadmap</h3>
                                <p className="text-surface-500 text-sm mt-1">To become a <span className="font-bold text-primary-600">{targetRole}</span></p>
                            </div>
                            <button 
                                onClick={() => window.print()} 
                                className="text-surface-400 hover:text-primary-600 transition-colors p-2"
                                title="Print Roadmap"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            </button>
                        </div>
                        
                        {/* Markdown Content with Typography Plugin Classes */}
                        <div className="prose prose-slate max-w-none 
                            prose-headings:text-surface-900 prose-headings:font-bold
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-p:text-surface-600 prose-p:leading-relaxed
                            prose-li:text-surface-600
                            prose-strong:text-primary-700
                            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-primary-500 prose-blockquote:bg-surface-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                        ">
                            <ReactMarkdown>{roadmap}</ReactMarkdown>
                        </div>

                        <div className="mt-10 pt-6 border-t border-surface-100 text-center">
                            <button 
                                onClick={() => setRoadmap('')} 
                                className="text-sm font-medium text-surface-400 hover:text-surface-600 transition-colors"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;