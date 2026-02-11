import React, { useState } from 'react';
import { ResumeData } from '../../types';

interface OnboardingQuizProps {
  onComplete: (role: string, experienceLevel: string, targetRole: string) => void;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const handleNext = () => {
      if (step === 2) {
          onComplete(role, experience, targetRole);
      } else {
          setStep(step + 1);
      }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in border border-surface-200">
        <div className="bg-surface-900 p-8 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Let's set up your workspace</h1>
            <p className="text-surface-400 text-sm">Help us tailor the AI to your career stage.</p>
            
            <div className="flex justify-center gap-2 mt-6">
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 0 ? 'bg-primary-500' : 'bg-surface-700'}`}></div>
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary-500' : 'bg-surface-700'}`}></div>
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-surface-700'}`}></div>
            </div>
        </div>

        <div className="p-8 md:p-12 min-h-[300px] flex flex-col">
            {step === 0 && (
                <div className="flex-1 animate-fade-in">
                    <h2 className="text-xl font-bold text-surface-900 mb-6 text-center">Which best describes you?</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setRole('Student')}
                            className={`p-6 rounded-2xl border-2 text-center transition-all ${role === 'Student' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-200' : 'border-surface-200 hover:border-primary-400 hover:shadow-md'}`}
                        >
                            <div className="text-4xl mb-3">🎓</div>
                            <div className="font-bold text-surface-900">Student</div>
                            <div className="text-xs text-surface-500 mt-1">Internships & First Job</div>
                        </button>
                        <button 
                            onClick={() => setRole('Professional')}
                            className={`p-6 rounded-2xl border-2 text-center transition-all ${role === 'Professional' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-200' : 'border-surface-200 hover:border-primary-400 hover:shadow-md'}`}
                        >
                            <div className="text-4xl mb-3">💼</div>
                            <div className="font-bold text-surface-900">Professional</div>
                            <div className="text-xs text-surface-500 mt-1">Experienced Hire</div>
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="flex-1 animate-fade-in">
                    <h2 className="text-xl font-bold text-surface-900 mb-6 text-center">Years of Experience</h2>
                    <div className="space-y-3">
                        {['0-1 Years', '2-5 Years', '5-10 Years', '10+ Years'].map((exp) => (
                            <button 
                                key={exp}
                                onClick={() => setExperience(exp)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${experience === exp ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}
                            >
                                <span>{exp}</span>
                                {experience === exp && <span className="text-primary-600">✔</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex-1 animate-fade-in">
                    <h2 className="text-xl font-bold text-surface-900 mb-2 text-center">What is your target role?</h2>
                    <p className="text-surface-500 text-center text-sm mb-8">We'll use this to tailor your resume keywords.</p>
                    <input 
                        type="text" 
                        className="input-field text-lg text-center p-4 border-2 focus:border-primary-500"
                        placeholder="e.g. Product Manager"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        autoFocus
                    />
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-surface-100 flex justify-between">
                <button 
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-6 py-2 text-surface-500 font-bold hover:text-surface-900 disabled:opacity-0"
                >
                    Back
                </button>
                <button 
                    onClick={handleNext}
                    disabled={(step === 0 && !role) || (step === 1 && !experience) || (step === 2 && !targetRole)}
                    className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-transform active:scale-95"
                >
                    {step === 2 ? 'Launch Dashboard 🚀' : 'Continue'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;