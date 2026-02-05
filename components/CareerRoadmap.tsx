import React, { useState } from 'react';
import { generateCareerRoadmap } from '../services/geminiService';
import { ResumeData, CareerRoadmapResponse } from '../types';

interface CareerRoadmapProps {
  data: ResumeData;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ data }) => {
  const [targetRole, setTargetRole] = useState('');
  const [currentRole, setCurrentRole] = useState(data.experience[0]?.role || '');
  const [currentSkills, setCurrentSkills] = useState(data.skills.join(', ') || '');
  const [roadmap, setRoadmap] = useState<CareerRoadmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Track checked steps: Set of Step IDs
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    setRoadmap(null);
    setCompletedSteps(new Set());
    
    try {
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

  const toggleStep = (stepId: string) => {
      setCompletedSteps(prev => {
          const next = new Set(prev);
          if (next.has(stepId)) {
              next.delete(stepId);
          } else {
              next.add(stepId);
          }
          return next;
      });
  };

  // Calculate Progress
  const totalSteps = roadmap?.phases.reduce((acc, phase) => acc + phase.steps.length, 0) || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.size / totalSteps) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Career Roadmap Generator</h2>
        <p className="text-surface-500 mt-2 text-lg">
          A personalized, step-by-step learning path to your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Side (4 cols) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
            
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
                                Creating Plan...
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
            {!roadmap ? (
                 <div className={`bg-white rounded-2xl border border-surface-200 shadow-lg min-h-[500px] flex items-center justify-center p-8 md:p-10 ${loading ? 'opacity-50' : 'bg-surface-50/50'}`}>
                    <div className="text-center text-surface-400 max-w-sm">
                        <div className="text-7xl mb-6 opacity-20">🗺️</div>
                        <h3 className="text-xl font-bold text-surface-500 mb-2">Ready to Map Your Future?</h3>
                        <p className="leading-relaxed">Enter your current details and your dream job on the left, and our AI will build a personalized, modular learning path.</p>
                    </div>
                 </div>
            ) : (
                <div className="space-y-6 animate-fade-in" id="roadmap-content">
                    
                    {/* Progress Header */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 sticky top-4 z-10 print:static print:border-none print:shadow-none">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h2 className="text-2xl font-bold text-surface-900">Your Journey to <span className="text-primary-600">{targetRole}</span></h2>
                                <p className="text-surface-500 text-sm">{completedSteps.size} of {totalSteps} tasks completed</p>
                            </div>
                             <button 
                                onClick={() => window.print()} 
                                className="text-surface-400 hover:text-primary-600 transition-colors p-2 print:hidden"
                                title="Download PDF"
                            >
                                <div className="flex items-center gap-2 text-sm font-bold bg-surface-50 px-3 py-1.5 rounded-lg border border-surface-200">
                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                     <span>Save PDF</span>
                                </div>
                            </button>
                        </div>
                        <div className="w-full bg-surface-100 rounded-full h-3 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Gap Analysis Card */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 print:break-inside-avoid">
                        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <span>🔍</span> Analysis & Strategy
                        </h3>
                        <p className="text-indigo-800 text-sm leading-relaxed">{roadmap.gapAnalysis}</p>
                    </div>

                    {/* Phases */}
                    <div className="space-y-6">
                        {roadmap.phases.map((phase, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden print:break-inside-avoid">
                                <div className="p-6 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1">Phase {idx + 1}</div>
                                        <h3 className="text-xl font-bold text-surface-900">{phase.title}</h3>
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-surface-200 rounded-lg text-sm font-semibold text-surface-600 shadow-sm">
                                        {phase.duration}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <p className="text-surface-600 text-sm mb-6 italic border-l-4 border-primary-200 pl-3">
                                        Goal: {phase.goal}
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <h4 className="text-xs font-bold text-surface-400 uppercase">Action Plan</h4>
                                        {phase.steps.map((step) => {
                                            const isChecked = completedSteps.has(step.id);
                                            return (
                                                <div 
                                                    key={step.id} 
                                                    onClick={() => toggleStep(step.id)}
                                                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${isChecked ? 'bg-primary-50 border-primary-200' : 'bg-white border-surface-200 hover:border-primary-300'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isChecked ? 'bg-primary-600 border-primary-600' : 'border-surface-300 bg-white'}`}>
                                                        {isChecked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <div>
                                                        <h5 className={`font-bold text-sm ${isChecked ? 'text-primary-900 line-through opacity-70' : 'text-surface-900'}`}>{step.task}</h5>
                                                        <p className={`text-xs mt-1 ${isChecked ? 'text-primary-700 opacity-70' : 'text-surface-500'}`}>{step.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-surface-400 uppercase mb-3">Recommended Resources</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {phase.resources.map((res, rIdx) => (
                                                <a 
                                                    key={rIdx} 
                                                    href={res.url || `https://www.google.com/search?q=${encodeURIComponent(res.title + " " + res.type)}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 rounded-lg border border-surface-100 bg-surface-50 hover:bg-surface-100 hover:border-surface-300 transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-lg border border-surface-100 shadow-sm group-hover:scale-110 transition-transform">
                                                        {res.type === 'Course' ? '🎓' : res.type === 'Book' ? '📚' : res.type === 'Tool' ? '🛠️' : '📄'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-surface-700 truncate group-hover:text-primary-600 transition-colors">{res.title}</div>
                                                        <div className="text-xs text-surface-400">{res.type}</div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-surface-300 group-hover:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-surface-100 text-center print:hidden">
                        <button 
                            onClick={() => { setRoadmap(null); setTargetRole(''); }} 
                            className="text-sm font-medium text-surface-400 hover:text-surface-600 transition-colors"
                        >
                            Create New Roadmap
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;