import React, { useState } from 'react';
import { ResumeData } from '../types';
import { generateFullResume, generateClarificationQuestions } from '../services/geminiService';

interface AiResumeWizardProps {
  onComplete: (data: ResumeData, meta: { template: string, theme: string, font: string }) => void;
  onCancel: () => void;
}

type WizardStep = 'STRATEGY' | 'PERSONAL' | 'EXPERIENCE' | 'EDUCATION' | 'SKILLS' | 'CLARIFICATION' | 'GENERATING';

const PREDEFINED_ROLES = [
    "Software Engineer",
    "Product Manager", 
    "Data Scientist",
    "Marketing Manager",
    "Business Analyst",
    "Graphic Designer",
    "Sales Representative",
    "Student / Intern",
    "HR Specialist",
    "Customer Support"
];

const AiResumeWizard: React.FC<AiResumeWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<WizardStep>('STRATEGY');
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Form State
  const [strategy, setStrategy] = useState<'Default' | 'Tailored'>('Default');
  const [predefinedRole, setPredefinedRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: ''
  });

  const [experienceRaw, setExperienceRaw] = useState('');
  const [educationRaw, setEducationRaw] = useState('');
  const [skillsRaw, setSkillsRaw] = useState('');
  
  // Clarification State
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [clarificationAnswers, setClarificationAnswers] = useState<string[]>([]);

  const handleNext = async () => {
    if (step === 'STRATEGY') setStep('PERSONAL');
    else if (step === 'PERSONAL') setStep('EXPERIENCE');
    else if (step === 'EXPERIENCE') setStep('EDUCATION');
    else if (step === 'EDUCATION') setStep('SKILLS');
    else if (step === 'SKILLS') {
        // Intercept before final generation to ask questions
        await handleGenerateQuestions();
    }
    else if (step === 'CLARIFICATION') handleSubmit();
  };

  const handleBack = () => {
    if (step === 'PERSONAL') setStep('STRATEGY');
    else if (step === 'EXPERIENCE') setStep('PERSONAL');
    else if (step === 'EDUCATION') setStep('EXPERIENCE');
    else if (step === 'SKILLS') setStep('EDUCATION');
    else if (step === 'CLARIFICATION') setStep('SKILLS');
  };

  const handleGenerateQuestions = async () => {
      setLoadingQuestions(true);
      try {
          const inputs = {
            strategy,
            jobDescription,
            predefinedRole,
            personalInfo,
            experienceRaw,
            skillsRaw
          };
          const questions = await generateClarificationQuestions(inputs);
          setClarificationQuestions(questions);
          setClarificationAnswers(new Array(questions.length).fill(''));
          setStep('CLARIFICATION');
      } catch (e) {
          console.error(e);
          // If questions fail, just skip to submit
          handleSubmit();
      } finally {
          setLoadingQuestions(false);
      }
  };

  const handleSubmit = async () => {
    setStep('GENERATING');
    setLoading(true);
    try {
      const inputs = {
        strategy,
        jobDescription,
        predefinedRole,
        personalInfo,
        experienceRaw,
        educationRaw,
        skillsRaw
      };
      
      const answersObject = clarificationQuestions.reduce((acc, q, i) => {
          acc[q] = clarificationAnswers[i];
          return acc;
      }, {} as any);

      const result = await generateFullResume(inputs, answersObject);
      
      // Extract meta fields and clean data
      const { suggestedTemplate, suggestedThemeColor, suggestedFont, ...cleanData } = result;
      
      onComplete(cleanData, {
          template: suggestedTemplate,
          theme: suggestedThemeColor,
          font: suggestedFont
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating the resume. Please try again.");
      setLoading(false);
      setStep('CLARIFICATION');
    }
  };

  if (loadingQuestions) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in text-center p-8">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-surface-900">Reviewing your profile...</h2>
            <p className="text-surface-500">Checking for any missing details to make your resume perfect.</p>
        </div>
      );
  }

  if (step === 'GENERATING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in text-center p-8">
         <div className="w-20 h-20 mb-6 relative">
            <div className="absolute inset-0 border-4 border-surface-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
         </div>
         <h2 className="text-2xl font-bold text-surface-900 mb-2">Crafting Your Resume</h2>
         <p className="text-surface-500 max-w-md">
            Our AI is structuring your experience, selecting the best design, and polishing your content.
         </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden animate-fade-in my-8">
       {/* Header */}
       <div className="bg-surface-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🤖</span> AI Resume Wizard
            </h2>
            <p className="text-sm text-surface-400">Step-by-step professional resume creation.</p>
          </div>
          <button onClick={onCancel} className="text-surface-400 hover:text-white">✕</button>
       </div>

       {/* Progress Bar */}
       <div className="h-1 bg-surface-100 w-full">
           <div 
             className="h-full bg-primary-500 transition-all duration-300"
             style={{ width: step === 'STRATEGY' ? '10%' : step === 'PERSONAL' ? '25%' : step === 'EXPERIENCE' ? '40%' : step === 'EDUCATION' ? '55%' : step === 'SKILLS' ? '70%' : '90%' }}
           ></div>
       </div>

       <div className="p-8 min-h-[400px]">
           
           {/* STEP 1: STRATEGY */}
           {step === 'STRATEGY' && (
               <div className="space-y-6 animate-fade-in">
                   <h3 className="text-2xl font-bold text-surface-900">Choose your resume strategy.</h3>
                   
                   <div className="space-y-4">
                       <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-surface-50 transition-colors">
                           <input 
                                type="radio" 
                                name="strategy" 
                                checked={strategy === 'Default'} 
                                onChange={() => setStrategy('Default')}
                                className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                           />
                           <div>
                               <span className="block font-bold text-surface-900 mb-1">Standard Role-Based Resume</span>
                               <span className="text-sm text-surface-500 mb-3 block">Best for general applications or uploading to job boards.</span>
                               {strategy === 'Default' && (
                                   <div className="mt-3 animate-fade-in">
                                       <label className="text-xs font-bold uppercase text-surface-400 mb-1 block">Select Role Type</label>
                                       <select 
                                            className="input-field" 
                                            value={predefinedRole} 
                                            onChange={(e) => setPredefinedRole(e.target.value)}
                                       >
                                           <option value="">Select a role...</option>
                                           {PREDEFINED_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                           <option value="Other">Other</option>
                                       </select>
                                   </div>
                               )}
                           </div>
                       </label>

                       <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-surface-50 transition-colors">
                           <input 
                                type="radio" 
                                name="strategy" 
                                checked={strategy === 'Tailored'} 
                                onChange={() => setStrategy('Tailored')}
                                className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                           />
                           <div>
                               <span className="block font-bold text-surface-900 mb-1">Tailored for Specific Job(s)</span>
                               <span className="text-sm text-surface-500 mb-3 block">Optimize keywords for specific job descriptions.</span>
                               {strategy === 'Tailored' && (
                                   <div className="mt-3 animate-fade-in">
                                       <label className="text-xs font-bold uppercase text-surface-400 mb-1 block">Paste Job Description(s)</label>
                                       <textarea 
                                            className="input-field h-24 text-sm" 
                                            placeholder="Paste one or multiple JDs here..." 
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                       />
                                   </div>
                               )}
                           </div>
                       </label>
                   </div>
               </div>
           )}

           {/* STEP 2: PERSONAL */}
           {step === 'PERSONAL' && (
               <div className="space-y-6 animate-fade-in">
                   <h3 className="text-2xl font-bold text-surface-900">Contact Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                           <label className="label-text">Full Name</label>
                           <input type="text" className="input-field" value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} placeholder="e.g. Jane Doe" />
                       </div>
                       <div>
                           <label className="label-text">Email</label>
                           <input type="email" className="input-field" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} placeholder="jane@example.com" />
                       </div>
                       <div>
                           <label className="label-text">Phone</label>
                           <input type="tel" className="input-field" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} placeholder="+1 555 000 0000" />
                       </div>
                       <div>
                           <label className="label-text">Location</label>
                           <input type="text" className="input-field" value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} placeholder="City, Country" />
                       </div>
                       <div className="md:col-span-2">
                           <label className="label-text">LinkedIn / Portfolio URL</label>
                           <input type="text" className="input-field" value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} placeholder="linkedin.com/in/jane" />
                       </div>
                   </div>
               </div>
           )}

           {/* STEP 3: EXPERIENCE */}
           {step === 'EXPERIENCE' && (
               <div className="space-y-6 animate-fade-in">
                   <h3 className="text-2xl font-bold text-surface-900">Work History</h3>
                   <p className="text-surface-500">Paste your work history. Don't worry about formatting—our AI will structure it.</p>
                   
                   <textarea 
                     className="input-field h-64 font-mono text-sm leading-relaxed"
                     placeholder={`Senior Developer at Tech Co (2020-Present)
- Led team of 5
- Increased performance by 20%

Marketing Intern at StartUp (2019)
- Managed social media
- Wrote blog posts`}
                     value={experienceRaw}
                     onChange={(e) => setExperienceRaw(e.target.value)}
                   />
               </div>
           )}

           {/* STEP 4: EDUCATION */}
           {step === 'EDUCATION' && (
               <div className="space-y-6 animate-fade-in">
                   <h3 className="text-2xl font-bold text-surface-900">Education</h3>
                   <p className="text-surface-500">List your degrees, schools, and years.</p>
                   
                   <textarea 
                     className="input-field h-48 font-mono text-sm leading-relaxed"
                     placeholder={`BS Computer Science, Stanford University, 2018
High School Diploma, Lincoln High, 2014`}
                     value={educationRaw}
                     onChange={(e) => setEducationRaw(e.target.value)}
                   />
               </div>
           )}

            {/* STEP 5: SKILLS & PROJECTS */}
            {step === 'SKILLS' && (
               <div className="space-y-6 animate-fade-in">
                   <h3 className="text-2xl font-bold text-surface-900">Skills & Projects</h3>
                   <p className="text-surface-500">List technical skills and key projects. <span className="font-bold text-surface-700">Please include links (GitHub, Live Demos) for projects if available.</span></p>
                   
                   <textarea 
                     className="input-field h-64 font-mono text-sm leading-relaxed"
                     placeholder={`Skills: React, Node.js, Python, AWS, Figma

Project: E-commerce Dashboard
- Built with React & Firebase
- Link: github.com/myname/dashboard
- Result: Used by 500 small businesses`}
                     value={skillsRaw}
                     onChange={(e) => setSkillsRaw(e.target.value)}
                   />
               </div>
           )}

           {/* STEP 6: CLARIFICATION */}
           {step === 'CLARIFICATION' && (
               <div className="space-y-6 animate-fade-in">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl">💡</div>
                       <div>
                           <h3 className="text-xl font-bold text-surface-900">Just a few quick questions...</h3>
                           <p className="text-surface-500 text-sm">Helping us understand these details will significantly improve your resume.</p>
                       </div>
                   </div>

                   <div className="space-y-6">
                       {clarificationQuestions.map((q, idx) => (
                           <div key={idx} className="bg-surface-50 p-4 rounded-xl border border-surface-200">
                               <label className="font-bold text-surface-800 block mb-2">{q}</label>
                               <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Type your answer here..."
                                    value={clarificationAnswers[idx]}
                                    onChange={(e) => {
                                        const newAnswers = [...clarificationAnswers];
                                        newAnswers[idx] = e.target.value;
                                        setClarificationAnswers(newAnswers);
                                    }}
                               />
                           </div>
                       ))}
                   </div>
               </div>
           )}

       </div>

       {/* Footer Actions */}
       <div className="p-6 bg-surface-50 border-t border-surface-200 flex justify-between items-center">
           {step !== 'STRATEGY' && step !== 'GENERATING' ? (
               <button onClick={handleBack} className="px-6 py-2 rounded-lg font-bold text-surface-500 hover:bg-surface-200 transition-colors">
                   Back
               </button>
           ) : (
                <div /> // Spacer
           )}
           
           {step !== 'GENERATING' && (
                <button 
                    onClick={handleNext} 
                    disabled={(step === 'STRATEGY' && strategy === 'Tailored' && !jobDescription) || (step === 'STRATEGY' && strategy === 'Default' && !predefinedRole)}
                    className="px-8 py-3 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {step === 'CLARIFICATION' ? '✨ Generate Final Resume' : 'Next →'}
                </button>
           )}
       </div>
    </div>
  );
};

export default AiResumeWizard;