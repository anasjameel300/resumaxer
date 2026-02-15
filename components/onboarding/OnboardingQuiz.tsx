"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Briefcase, GraduationCap, Zap, DollarSign, Globe, Repeat, AlertCircle, Map, Palette, Rocket, Check, Building2, UserCircle, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UserContext } from '@/types';

// --- Skill Data by Domain ---
const SKILL_DOMAINS: Record<string, string[]> = {
    'Frontend': ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Svelte', 'Redux', 'jQuery', 'Sass/SCSS', 'Webpack', 'Vite', 'Storybook'],
    'Backend': ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', '.NET', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'REST APIs', 'GraphQL'],
    'Data Science': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'Tableau', 'Power BI', 'Spark', 'Machine Learning', 'Deep Learning', 'NLP'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Jenkins', 'CI/CD', 'Linux', 'Nginx', 'Ansible', 'Prometheus', 'Grafana', 'GitHub Actions', 'Helm'],
    'Design': ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'InVision', 'Framer', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility', 'Motion Design'],
    'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Expo', 'Dart', 'Objective-C', 'Xamarin', 'Ionic', 'SwiftUI', 'Jetpack Compose', 'App Store', 'Firebase'],
    'Marketing': ['SEO', 'Google Ads', 'Meta Ads', 'Content Strategy', 'Copywriting', 'Email Marketing', 'Analytics', 'A/B Testing', 'Social Media', 'HubSpot', 'Mailchimp', 'Branding', 'Growth Hacking', 'CRO', 'PPC'],
    'Management': ['Agile', 'Scrum', 'Jira', 'Confluence', 'Roadmapping', 'Stakeholder Management', 'OKRs', 'Budgeting', 'Hiring', 'Mentoring', 'Cross-functional Leadership', 'Strategic Planning', 'Risk Management', 'Product Management', 'Team Building'],
};

interface OnboardingQuizProps {
    onComplete: (context: UserContext) => void;
}

const TOTAL_STEPS = 6;

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [context, setContext] = useState<Partial<UserContext>>({
        targetRole: '',
        skills: [],
    });

    // Skills step state
    const [activeDomain, setActiveDomain] = useState<string>(Object.keys(SKILL_DOMAINS)[0]);
    const [customSkillInput, setCustomSkillInput] = useState('');

    const handleNext = () => {
        if (step === TOTAL_STEPS - 1) {
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

    const currentProgress = ((step + 1) / TOTAL_STEPS) * 100;

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
        // Auto-advance for selection-based steps (not for input or skills steps)
        if (step < 4) {
            setTimeout(() => setStep(s => s + 1), 250);
        }
    };

    const toggleSkill = (skill: string) => {
        setContext(prev => {
            const currentSkills = prev.skills || [];
            if (currentSkills.includes(skill)) {
                return { ...prev, skills: currentSkills.filter(s => s !== skill) };
            }
            return { ...prev, skills: [...currentSkills, skill] };
        });
    };

    const addCustomSkill = () => {
        const trimmed = customSkillInput.trim();
        if (trimmed && !(context.skills || []).includes(trimmed)) {
            setContext(prev => ({
                ...prev,
                skills: [...(prev.skills || []), trimmed]
            }));
            setCustomSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setContext(prev => ({
            ...prev,
            skills: (prev.skills || []).filter(s => s !== skill)
        }));
    };

    const getDomainSkills = () => SKILL_DOMAINS[activeDomain] || [];

    // Show Continue/Launch button on steps 4 (Target Role input) and 5 (Skills)
    const showContinueButton = step >= 4;

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
                        <span>Step {step + 1} of {TOTAL_STEPS}</span>
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
                                                icon={null}
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
                                <motion.div key="step4" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
                                    <h2 className="text-3xl font-heading font-bold text-foreground mb-1 text-center">Your Skills</h2>
                                    <p className="text-muted-foreground text-center mb-5 text-sm">Select from domains or add your own. These power your AI resume.</p>

                                    {/* Domain Tabs */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {Object.keys(SKILL_DOMAINS).map(domain => (
                                            <button
                                                key={domain}
                                                onClick={() => setActiveDomain(domain)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
                                                    activeDomain === domain
                                                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_-3px_rgba(99,102,241,0.3)]"
                                                        : "border-white/5 text-muted-foreground hover:text-foreground hover:border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                {domain}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Skill Grid */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {getDomainSkills().map(skill => {
                                            const isSelected = (context.skills || []).includes(skill);
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                                                        isSelected
                                                            ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 ring-1 ring-indigo-500/20"
                                                            : "border-white/5 bg-zinc-800/60 text-muted-foreground hover:text-foreground hover:border-white/15 hover:bg-zinc-700/60"
                                                    )}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                                                    {skill}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Custom Skill Input */}
                                    <div className="flex gap-2 mb-4">
                                        <div className="flex-1 relative">
                                            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Add a custom skill..."
                                                value={customSkillInput}
                                                onChange={(e) => setCustomSkillInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') addCustomSkill(); }}
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/40 transition-colors"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addCustomSkill}
                                            disabled={!customSkillInput.trim()}
                                            className="border-white/10 text-xs hover:bg-white/5"
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    {/* Selected Skills */}
                                    {(context.skills || []).length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Selected ({(context.skills || []).length})</span>
                                                <button
                                                    onClick={() => setContext(prev => ({ ...prev, skills: [] }))}
                                                    className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors font-medium"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(context.skills || []).map(skill => (
                                                    <span
                                                        key={skill}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium"
                                                    >
                                                        {skill}
                                                        <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors ml-0.5">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div key="step5" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex-1">
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

                            <Button
                                onClick={handleNext}
                                disabled={
                                    (step === 5 && !context.targetRole)
                                }
                                variant="glow"
                                size="lg"
                                className={cn("px-8 min-w-[140px]", !showContinueButton && "opacity-0 pointer-events-none")}
                            >
                                {step === TOTAL_STEPS - 1 ? 'Launch 🚀' : 'Continue'}
                                {step !== TOTAL_STEPS - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
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