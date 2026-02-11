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
                <div className="space-y-8 animate-fade-in" id="roadmap-content">
                    
                    {/* Progress Header */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 sticky top-4 z-20 print:static print:border-none print:shadow-none">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h2 className="text-2xl font-bold text-surface-900">Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">{targetRole}</span></h2>
                                <p className="text-surface-500 text-sm font-medium flex items-center gap-2 mt-1">
                                    {completedSteps.size === totalSteps ? (
                                        <span className="text-green-600 flex items-center gap-1">🎉 Mission Accomplished!</span>
                                    ) : (
                                        <span>{completedSteps.size} of {totalSteps} tasks completed</span>
                                    )}
                                </p>
                            </div>
                             <button 
                                onClick={() => window.print()} 
                                className="text-surface-400 hover:text-primary-600 transition-colors p-2 print:hidden"
                                title="Download PDF"
                            >
                                <div className="flex items-center gap-2 text-sm font-bold bg-surface-50 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-100">
                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                     <span className="hidden sm:inline">Save PDF</span>
                                </div>
                            </button>
                        </div>
                        <div className="w-full bg-surface-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                                className={`h-full rounded-full transition-all duration-700 ease-out ${completedSteps.size === totalSteps ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-indigo-500'}`}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Gap Analysis Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 print:break-inside-avoid relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2 relative z-10">
                            <span className="bg-white p-1.5 rounded-lg shadow-sm text-lg">🔍</span>
                            Analysis & Strategy
                        </h3>
                        <p className="text-indigo-800 text-sm leading-relaxed relative z-10">{roadmap.gapAnalysis}</p>
                    </div>

                    {/* Phases */}
                    <div className="space-y-8 relative">
                        {/* Timeline Line (Desktop) */}
                        <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-0.5 bg-surface-200 z-0"></div>

                        {roadmap.phases.map((phase, idx) => (
                            <div key={idx} className="relative lg:pl-20">
                                {/* Timeline Node (Desktop) */}
                                <div className={`hidden lg:flex absolute left-4 top-8 w-8 h-8 rounded-full border-4 border-white shadow-md z-10 items-center justify-center text-sm font-bold
                                    ${idx === 0 ? 'bg-emerald-500 text-white' : idx === 1 ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                                    {idx + 1}
                                </div>

                                <div className="bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 print:break-inside-avoid">
                                    {/* Color Header Strip */}
                                    <div className={`h-1.5 w-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                    
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div>
                                                <div className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <span className="lg:hidden bg-surface-100 px-2 py-0.5 rounded text-surface-600">Phase {idx + 1}</span>
                                                    <span>{phase.duration}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-surface-900">{phase.title}</h3>
                                            </div>
                                        </div>

                                        <div className="bg-surface-50/50 rounded-xl p-4 mb-8 border border-surface-100 flex gap-4 items-start">
                                            <span className="text-2xl mt-0.5">🎯</span>
                                            <div>
                                                <span className="font-bold text-surface-900 text-sm block mb-1">Objective</span>
                                                <p className="text-sm text-surface-600 leading-relaxed">{phase.goal}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Action Plan Column */}
                                            <div className="flex flex-col h-full">
                                                <h4 className="flex items-center gap-2 font-bold text-surface-900 mb-4 pb-3 border-b border-surface-100 text-sm uppercase tracking-wide">
                                                    <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded flex items-center justify-center text-xs">✓</span>
                                                    Action Items
                                                </h4>
                                                <div className="space-y-3 flex-1">
                                                    {phase.steps.map((step) => {
                                                        const isChecked = completedSteps.has(step.id);
                                                        return (
                                                            <label 
                                                                key={step.id} 
                                                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                                                                    ${isChecked 
                                                                        ? 'bg-green-50/50 border-green-100' 
                                                                        : 'bg-white border-surface-100 hover:border-primary-300 hover:shadow-sm'}`}
                                                            >
                                                                <div className="relative mt-1">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="peer appearance-none w-5 h-5 border-2 border-surface-300 rounded bg-white checked:bg-green-500 checked:border-green-500 transition-colors cursor-pointer"
                                                                        checked={isChecked}
                                                                        onChange={() => toggleStep(step.id)}
                                                                    />
                                                                    <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className={`text-sm font-bold transition-colors ${isChecked ? 'text-green-800 line-through opacity-60' : 'text-surface-800 group-hover:text-primary-700'}`}>
                                                                        {step.task}
                                                                    </div>
                                                                    <div className={`text-xs mt-1 leading-snug transition-colors ${isChecked ? 'text-green-700 opacity-50' : 'text-surface-500'}`}>
                                                                        {step.description}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Resources Column */}
                                            <div className="flex flex-col h-full">
                                                <h4 className="flex items-center gap-2 font-bold text-surface-900 mb-4 pb-3 border-b border-surface-100 text-sm uppercase tracking-wide">
                                                    <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded flex items-center justify-center text-xs">📚</span>
                                                    Learning & Tools
                                                </h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {phase.resources.map((res, rIdx) => (
                                                        <a 
                                                            key={rIdx} 
                                                            href={res.url || `https://www.google.com/search?q=${encodeURIComponent(res.title + " " + res.type)}`}
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="group flex flex-col bg-surface-50 border border-surface-200 rounded-xl p-4 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden"
                                                        >
                                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border 
                                                                    ${res.type === 'Course' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                                      res.type === 'Tool' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                                      'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                                                    {res.type}
                                                                </span>
                                                                <svg className="w-3 h-3 text-surface-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            </div>
                                                            <div className="text-sm font-bold text-surface-800 group-hover:text-indigo-700 transition-colors line-clamp-2">
                                                                {res.title}
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-surface-200 text-center print:hidden pb-12">
                        <p className="text-surface-500 mb-4">Want to adjust your path?</p>
                        <button 
                            onClick={() => { setRoadmap(null); setTargetRole(''); }} 
                            className="px-6 py-2 bg-white border border-surface-300 rounded-lg text-surface-600 font-bold hover:bg-surface-50 hover:text-surface-900 transition-colors shadow-sm"
                        >
                            Start New Roadmap
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