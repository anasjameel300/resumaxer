"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Briefcase, GraduationCap, Zap, DollarSign, Globe, Repeat, AlertCircle, Map, Palette, Rocket, Check, Building2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UserContext } from '@/types';

interface OnboardingQuizProps {
    onComplete: (context: UserContext) => void;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [context, setContext] = useState<Partial<UserContext>>({
        targetRole: ''
    });

    const handleNext = () => {
        if (step === 4) {
            if (isContextComplete(context)) {
                onComplete(context as UserContext);
            }
        } else {
            setStep(step + 1);
        }
    };

    const isContextComplete = (c: Partial<UserContext>): c is UserContext => {
        return !!(c.identity && c.experience && c.goal && c.blocker && c.targetRole);
    };

    // Calculate progress based on 5 steps (0-4)
    const currentProgress = ((step + 1) / 5) * 100;

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

    const updateContext = (key: keyof UserContext, value: any) => {
        setContext(prev => ({ ...prev, [key]: value }));
        // Auto-advance for selection-based steps (except Role input)
        if (step < 4) {
            setTimeout(() => setStep(s => s + 1), 250);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="w-full max-w-2xl relative z-10 transition-all duration-500 ease-in-out">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        <span>Step {step + 1} of 5</span>
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

                    <CardContent className="p-8 md:p-12 min-h-[450px] flex flex-col">
                        <AnimatePresence mode='wait' custom={step}>
                            {step === 0 && (
                                <motion.div key="step0" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Who are you?</h2>
                                    <p className="text-muted-foreground text-center mb-8">Select your current career stage.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SelectionCard
                                            selected={context.identity === 'Student'}
                                            onClick={() => updateContext('identity', 'Student')}
                                            icon={<GraduationCap className="w-6 h-6 text-indigo-400" />}
                                            title="Student"
                                            desc="Breaking In"
                                        />
                                        <SelectionCard
                                            selected={context.identity === 'Professional'}
                                            onClick={() => updateContext('identity', 'Professional')}
                                            icon={<Briefcase className="w-6 h-6 text-purple-400" />}
                                            title="Professional"
                                            desc="Climbing Up"
                                        />
                                        <SelectionCard
                                            selected={context.identity === 'Manager'}
                                            onClick={() => updateContext('identity', 'Manager')}
                                            icon={<UserCircle className="w-6 h-6 text-emerald-400" />}
                                            title="Manager"
                                            desc="Leading Teams"
                                        />
                                        <SelectionCard
                                            selected={context.identity === 'Executive'}
                                            onClick={() => updateContext('identity', 'Executive')}
                                            icon={<Building2 className="w-6 h-6 text-amber-400" />}
                                            title="Executive"
                                            desc="Visionary"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div key="step1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Experience Level</h2>
                                    <p className="text-muted-foreground text-center mb-8">How long have you been in the workforce?</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['0-1 Years', '2-5 Years', '5-10 Years', '10+ Years'].map((exp) => (
                                            <SelectionCard
                                                key={exp}
                                                selected={context.experience === exp}
                                                onClick={() => updateContext('experience', exp)}
                                                icon={null} // No icon for simple list
                                                title={exp}
                                                desc=""
                                                layout="horizontal"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Primary Goal</h2>
                                    <p className="text-muted-foreground text-center mb-8">What is your main objective right now?</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SelectionCard
                                            selected={context.goal === 'Job'}
                                            onClick={() => updateContext('goal', 'Job')}
                                            icon={<Zap className="w-5 h-5 text-yellow-400" />}
                                            title="Get Hired ASAP"
                                            desc="Optimize for keywords & speed"
                                            layout="horizontal"
                                        />
                                        <SelectionCard
                                            selected={context.goal === 'Salary'}
                                            onClick={() => updateContext('goal', 'Salary')}
                                            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                                            title="Higher Salary"
                                            desc="Highlight ROI & Achievements"
                                            layout="horizontal"
                                        />
                                        <SelectionCard
                                            selected={context.goal === 'Remote'}
                                            onClick={() => updateContext('goal', 'Remote')}
                                            icon={<Globe className="w-5 h-5 text-blue-400" />}
                                            title="Remote Work"
                                            desc="Emphasize autonomy & communication"
                                            layout="horizontal"
                                        />
                                        <SelectionCard
                                            selected={context.goal === 'CareerChange'}
                                            onClick={() => updateContext('goal', 'CareerChange')}
                                            icon={<Repeat className="w-5 h-5 text-purple-400" />}
                                            title="Career Pivot"
                                            desc="Transferable skills focus"
                                            layout="horizontal"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Biggest Blocker</h2>
                                    <p className="text-muted-foreground text-center mb-8">What is stopping you from succeeding?</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SelectionCard
                                            selected={context.blocker === 'ATS'}
                                            onClick={() => updateContext('blocker', 'ATS')}
                                            icon={<AlertCircle className="w-5 h-5 text-red-400" />}
                                            title="Resume gets rejected"
                                            desc="Fix ATS formatting & Keywords"
                                            layout="horizontal"
                                        />
                                        <SelectionCard
                                            selected={context.blocker === 'Roadmap'}
                                            onClick={() => updateContext('blocker', 'Roadmap')}
                                            icon={<Map className="w-5 h-5 text-indigo-400" />}
                                            title="Unsure of path"
                                            desc="Generate a Career Roadmap"
                                            layout="horizontal"
                                        />
                                        <SelectionCard
                                            selected={context.blocker === 'Design'}
                                            onClick={() => updateContext('blocker', 'Design')}
                                            icon={<Palette className="w-5 h-5 text-pink-400" />}
                                            title="Resume looks bad"
                                            desc="Modernize design & layout"
                                            layout="horizontal"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="step4" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-2 text-center">Target Role</h2>
                                    <p className="text-muted-foreground text-center mb-8">What is the exact job title you are aiming for?</p>
                                    <div className="max-w-md mx-auto relative mt-8">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Rocket className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <Input
                                            type="text"
                                            className="pl-12 py-7 text-lg bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                            placeholder="e.g. Senior Product Designer"
                                            value={context.targetRole}
                                            onChange={(e) => setContext(prev => ({ ...prev, targetRole: e.target.value }))}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && context.targetRole) handleNext();
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            {/* Only show Continue button on Step 4 (Input) or if they haven't auto-advanced yet */}
                            <Button
                                onClick={handleNext}
                                disabled={
                                    (step === 4 && !context.targetRole)
                                }
                                variant="glow"
                                size="lg"
                                className={cn("px-8 min-w-[140px]", step < 4 && "opacity-0 pointer-events-none")} // Hide on selection steps for cleaner UI
                            >
                                {step === 4 ? 'Launch 🚀' : 'Continue'}
                                {step !== 4 && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface SelectionCardProps {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    desc: string;
    layout?: 'vertical' | 'horizontal';
}

const SelectionCard: React.FC<SelectionCardProps> = ({ selected, onClick, icon, title, desc, layout = 'vertical' }) => (
    <button
        onClick={onClick}
        className={cn(
            "rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group w-full",
            layout === 'vertical' ? "p-6 h-full flex flex-col justify-between" : "p-4 flex items-center gap-4",
            selected
                ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]"
                : "border-white/5 bg-zinc-900/50 hover:bg-white/5 hover:border-white/10"
        )}
    >
        {selected && <div className="absolute top-3 right-3 text-primary"><Check size={20} /></div>}
        <div className={cn("relative z-10", layout === 'horizontal' && "flex items-center gap-4")}>
            {icon && icon}
            <div>
                <h3 className={cn("font-bold text-lg", selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground", layout === 'horizontal' && "mb-0")}>{title}</h3>
                {desc && <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>}
            </div>
        </div>
    </button>
);

export default OnboardingQuiz;