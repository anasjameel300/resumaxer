"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Briefcase, GraduationCap, Check, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

    const currentProgress = ((step + 1) / 3) * 100;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        <span>Step {step + 1} of 3</span>
                        <span>{Math.round(currentProgress)}% Completed</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentProgress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

                    <CardContent className="p-8 md:p-12 min-h-[400px] flex flex-col">
                        <AnimatePresence mode='wait' custom={step}>
                            {step === 0 && (
                                <motion.div
                                    key="step0"
                                    custom={1}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Describe Yourself</h2>
                                    <p className="text-muted-foreground text-center mb-8">This helps us customize the AI tone and templates.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SelectionCard
                                            selected={role === 'Student'}
                                            onClick={() => setRole('Student')}
                                            icon={<GraduationCap className="w-8 h-8 mb-4 text-indigo-400" />}
                                            title="Student / Grad"
                                            desc="Internships, entry-level roles, and academic projects."
                                        />
                                        <SelectionCard
                                            selected={role === 'Professional'}
                                            onClick={() => setRole('Professional')}
                                            icon={<Briefcase className="w-8 h-8 mb-4 text-purple-400" />}
                                            title="Professional"
                                            desc="Experienced hires, management, and career switchers."
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={1}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Experience Level</h2>
                                    <p className="text-muted-foreground text-center mb-8">How many years have you been in the workforce?</p>

                                    <div className="space-y-3">
                                        {['0-1 Years', '2-5 Years', '5-10 Years', '10+ Years'].map((exp) => (
                                            <button
                                                key={exp}
                                                onClick={() => setExperience(exp)}
                                                className={cn(
                                                    "w-full p-4 rounded-xl border transition-all flex justify-between items-center group",
                                                    experience === exp
                                                        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]"
                                                        : "border-white/5 bg-zinc-900/50 text-muted-foreground hover:bg-white/5 hover:border-white/10 hover:text-foreground"
                                                )}
                                            >
                                                <span className="font-medium text-lg">{exp}</span>
                                                {experience === exp && <Check className="w-5 h-5 text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={1}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Target Role</h2>
                                    <p className="text-muted-foreground text-center mb-8">What is the exact job title you are aiming for?</p>

                                    <div className="max-w-md mx-auto relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Rocket className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <Input
                                            type="text"
                                            className="pl-12 py-7 text-lg bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                            placeholder="e.g. Senior Product Designer"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-12 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={(step === 0 && !role) || (step === 1 && !experience) || (step === 2 && !targetRole)}
                                variant="glow"
                                size="lg"
                                className="px-8 min-w-[140px]"
                            >
                                {step === 2 ? 'Launch 🚀' : 'Continue'}
                                {step !== 2 && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const SelectionCard = ({ selected, onClick, icon, title, desc }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "p-6 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group h-full",
            selected
                ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]"
                : "border-white/5 bg-zinc-900/50 hover:bg-white/5 hover:border-white/10"
        )}
    >
        {selected && <div className="absolute top-3 right-3 text-primary"><Check size={20} /></div>}
        <div className="relative z-10">
            {icon}
            <h3 className={cn("font-bold text-lg mb-1", selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    </button>
);

export default OnboardingQuiz;