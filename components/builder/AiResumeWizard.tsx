"use client";

import React, { useState, useEffect } from 'react';
import { ResumeData, WizardInitialData } from '../../types';
import { generateFullResume, generateClarificationQuestions } from '../../services/geminiService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, ChevronLeft, ChevronRight, CheckCircle2, User, Briefcase, GraduationCap, Zap,
    Lightbulb, Sparkles, AlertTriangle, ArrowRight, X
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface AiResumeWizardProps {
    onComplete: (data: ResumeData, meta: { template: string, theme: string, font: string }) => void;
    onCancel: () => void;
    initialData?: WizardInitialData | null;
}

type WizardStep = 'STRATEGY' | 'PERSONAL' | 'EXPERIENCE' | 'EDUCATION' | 'SKILLS' | 'CLARIFICATION' | 'GENERATING';

const PREDEFINED_ROLES = [
    "Software Engineer", "Product Manager", "Data Scientist", "Marketing Manager",
    "Business Analyst", "Graphic Designer", "Sales Representative", "Student / Intern",
    "HR Specialist", "Customer Support"
];

const AiResumeWizard: React.FC<AiResumeWizardProps> = ({ onComplete, onCancel, initialData }) => {
    const [step, setStep] = useState<WizardStep>('STRATEGY');
    const [loading, setLoading] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [strategy, setStrategy] = useState<'Default' | 'Tailored'>('Default');
    const [predefinedRole, setPredefinedRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const [personalInfo, setPersonalInfo] = useState({
        fullName: '', email: '', phone: '', location: '', linkedin: ''
    });

    const [experienceRaw, setExperienceRaw] = useState('');
    const [educationRaw, setEducationRaw] = useState('');
    const [skillsRaw, setSkillsRaw] = useState('');
    const [analysisImprovements, setAnalysisImprovements] = useState<string[]>([]);

    // Pre-fill data
    useEffect(() => {
        if (initialData) {
            setPersonalInfo({
                fullName: initialData.personalInfo.fullName || '',
                email: initialData.personalInfo.email || '',
                phone: initialData.personalInfo.phone || '',
                location: initialData.personalInfo.location || '',
                linkedin: initialData.personalInfo.linkedin || ''
            });
            setExperienceRaw(initialData.experienceRaw || '');
            setEducationRaw(initialData.educationRaw || '');
            setSkillsRaw(initialData.skillsRaw || '');
            if (initialData.analysisImprovements) setAnalysisImprovements(initialData.analysisImprovements);
        }
    }, [initialData]);

    const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
    const [clarificationAnswers, setClarificationAnswers] = useState<string[]>([]);

    const handleNext = async () => {
        if (step === 'STRATEGY') setStep('PERSONAL');
        else if (step === 'PERSONAL') setStep('EXPERIENCE');
        else if (step === 'EXPERIENCE') setStep('EDUCATION');
        else if (step === 'EDUCATION') setStep('SKILLS');
        else if (step === 'SKILLS') await handleGenerateQuestions();
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
        setError(null);
        try {
            const inputs = { strategy, jobDescription, predefinedRole, personalInfo, experienceRaw, skillsRaw, analysisImprovements };
            const questions = await generateClarificationQuestions(inputs);
            setClarificationQuestions(questions);
            setClarificationAnswers(new Array(questions.length).fill(''));
            setStep('CLARIFICATION');
        } catch (e) {
            console.error(e);
            handleSubmit();
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleSubmit = async () => {
        setStep('GENERATING');
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 50000));

        try {
            const inputs = {
                strategy, jobDescription, predefinedRole, personalInfo, experienceRaw, educationRaw, skillsRaw, analysisImprovements
            };

            const answersObject = clarificationQuestions.reduce((acc, q, i) => {
                acc[q] = clarificationAnswers[i];
                return acc;
            }, {} as any);

            const result: any = await Promise.race([
                generateFullResume(inputs, answersObject),
                timeoutPromise
            ]);

            const { suggestedTemplate, suggestedThemeColor, suggestedFont, ...cleanData } = result;

            onComplete(cleanData, {
                template: suggestedTemplate,
                theme: suggestedThemeColor,
                font: suggestedFont
            });
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            if (error.message === "Timeout") {
                setError("The AI is taking longer than expected. Please try again.");
            } else {
                setError("Something went wrong generating the resume. Please try again.");
            }
            setStep('CLARIFICATION');
        }
    };

    const currentStepIdx = ['STRATEGY', 'PERSONAL', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'CLARIFICATION', 'GENERATING'].indexOf(step);
    const totalSteps = 6;
    const progress = ((currentStepIdx) / totalSteps) * 100;

    if (loading || loadingQuestions) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in text-center p-8 space-y-8">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                        {loadingQuestions ? "Analyzing Your Profile..." : "Crafting Your Resume..."}
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        {loadingQuestions
                            ? "Checking for missing details to make your resume perfect."
                            : "Our AI is structuring your experience, selecting the best design, and polishing your content."}
                    </p>
                    {analysisImprovements.length > 0 && (
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full mt-4">
                            <CheckCircle2 className="w-3 h-3" /> Applying analysis improvements
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Progress Header */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-heading font-bold flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Wand2 className="w-5 h-5 text-white" />
                            </span>
                            AI Resume Wizard
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <CardContent className="p-8 min-h-[500px] flex flex-col relative z-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="flex-1">
                        <AnimatePresence mode='wait'>
                            {/* STRATEGY */}
                            {step === 'STRATEGY' && (
                                <motion.div key="strategy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Choose your resume strategy</h3>
                                        <p className="text-muted-foreground">Do you want a general purpose resume or one tailored for a specific job?</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div
                                            onClick={() => setStrategy('Default')}
                                            className={cn("p-6 rounded-2xl border-2 cursor-pointer transition-all hover:bg-white/5", strategy === 'Default' ? "border-primary bg-primary/5" : "border-white/10 bg-zinc-900/50")}
                                        >
                                            <Briefcase className={cn("w-8 h-8 mb-4", strategy === 'Default' ? "text-primary" : "text-muted-foreground")} />
                                            <h4 className="font-bold text-lg mb-2">Role-Based Resume</h4>
                                            <p className="text-sm text-muted-foreground mb-4">Best for general applications, LinkedIn, or job boards.</p>

                                            {strategy === 'Default' && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <Label className="mb-2 block">Target Role</Label>
                                                    <select
                                                        className="w-full bg-zinc-950 border border-white/10 rounded-md p-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
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

                                        <div
                                            onClick={() => setStrategy('Tailored')}
                                            className={cn("p-6 rounded-2xl border-2 cursor-pointer transition-all hover:bg-white/5", strategy === 'Tailored' ? "border-primary bg-primary/5" : "border-white/10 bg-zinc-900/50")}
                                        >
                                            <Zap className={cn("w-8 h-8 mb-4", strategy === 'Tailored' ? "text-primary" : "text-muted-foreground")} />
                                            <h4 className="font-bold text-lg mb-2">Job-Tailored Resume</h4>
                                            <p className="text-sm text-muted-foreground mb-4">Optimized keywords for a specific job description.</p>

                                            {strategy === 'Tailored' && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <Label className="mb-2 block">Paste Job Description</Label>
                                                    <Textarea
                                                        className="h-24 bg-zinc-950 border-white/10 resize-none"
                                                        placeholder="Paste JD here..."
                                                        value={jobDescription}
                                                        onChange={(e) => setJobDescription(e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* PERSONAL */}
                            {step === 'PERSONAL' && (
                                <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Contact Information</h3>
                                        <p className="text-muted-foreground">How can recruiters reach you?</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input value={personalInfo.fullName} onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} placeholder="e.g. Jane Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="jane@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="+1 555 000 0000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input value={personalInfo.location} onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })} placeholder="City, Country" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>LinkedIn / Portfolio URL</Label>
                                            <Input value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} placeholder="linkedin.com/in/jane" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* EXPERIENCE */}
                            {step === 'EXPERIENCE' && (
                                <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Work History</h3>
                                        <p className="text-muted-foreground">Paste your raw work history. Don't worry about formatting, our AI will structure and polish it.</p>
                                    </div>
                                    <Textarea
                                        className="h-80 font-mono text-sm leading-relaxed bg-zinc-950 border-white/10 p-4"
                                        placeholder={`Senior Developer at Tech Co (2020-Present)
- Led team of 5
- Increased performance by 20%

Marketing Intern at StartUp (2019)
- Managed social media
- Wrote blog posts`}
                                        value={experienceRaw}
                                        onChange={(e) => setExperienceRaw(e.target.value)}
                                    />
                                </motion.div>
                            )}

                            {/* EDUCATION */}
                            {step === 'EDUCATION' && (
                                <motion.div key="education" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Education</h3>
                                        <p className="text-muted-foreground">List your degrees, schools, and graduation years.</p>
                                    </div>
                                    <Textarea
                                        className="h-64 font-mono text-sm leading-relaxed bg-zinc-950 border-white/10 p-4"
                                        placeholder={`BS Computer Science, Stanford University, 2018
High School Diploma, Lincoln High, 2014`}
                                        value={educationRaw}
                                        onChange={(e) => setEducationRaw(e.target.value)}
                                    />
                                </motion.div>
                            )}

                            {/* SKILLS */}
                            {step === 'SKILLS' && (
                                <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Skills & Projects</h3>
                                        <p className="text-muted-foreground">List technical skills and key projects. Include links if available.</p>
                                    </div>
                                    <Textarea
                                        className="h-80 font-mono text-sm leading-relaxed bg-zinc-950 border-white/10 p-4"
                                        placeholder={`Skills: React, Node.js, Python, AWS, Figma

Project: E-commerce Dashboard
- Built with React & Firebase
- Link: github.com/myname/dashboard
- Result: Used by 500 small businesses`}
                                        value={skillsRaw}
                                        onChange={(e) => setSkillsRaw(e.target.value)}
                                    />
                                </motion.div>
                            )}

                            {/* CLARIFICATION */}
                            {step === 'CLARIFICATION' && (
                                <motion.div key="clarification" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                                            <Lightbulb className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">Just a few quick questions...</h3>
                                            <p className="text-muted-foreground text-sm">Our AI identified some gaps. Answering these will significantly boost your ATS score.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {clarificationQuestions.map((q, idx) => (
                                            <div key={idx} className={cn("bg-zinc-900/50 p-6 rounded-xl border transition-all", idx === 0 ? "border-primary/50 shadow-[0_0_15px_-5px_var(--primary)]" : "border-white/5")}>
                                                <Label className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs">{idx + 1}</span>
                                                    {q}
                                                    {idx === 0 && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold tracking-wider">REQUIRED</span>}
                                                </Label>
                                                <Input
                                                    className="bg-black/20 border-white/10 focus:border-primary/50 text-lg py-6"
                                                    placeholder={idx === 0 ? "This answer is mandatory..." : "Type your answer here..."}
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center bg-zinc-900/20 backdrop-blur-sm -mx-8 -mb-8 p-8 rounded-b-xl">
                        {step !== 'STRATEGY' ? (
                            <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 'STRATEGY' && strategy === 'Tailored' && !jobDescription) ||
                                (step === 'STRATEGY' && strategy === 'Default' && !predefinedRole) ||
                                (step === 'CLARIFICATION' && !clarificationAnswers[0]?.trim())
                            }
                            variant="glow"
                            size="lg"
                            className="px-8 shadow-xl"
                        >
                            {step === 'CLARIFICATION' ? (
                                <>
                                    Generate Resume <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                                </>
                            ) : (
                                <>
                                    Next Step <ChevronRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AiResumeWizard;