"use client";

import React, { useState, useEffect } from 'react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem, TemplateId, LanguageItem, SocialLink, WizardInitialData } from '../../types';
import { generateResumeSummary } from '../../services/geminiService';
import ResumePreview from './ResumeTemplates';
import AiResumeWizard from './AiResumeWizard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Palette, User, Briefcase, Rocket, GraduationCap, Zap, Trophy, Languages, FileText, CheckCircle2,
    ChevronLeft, ChevronRight, Plus, Trash2, Wand2, Download, Printer, Eye, Edit3, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeBuilderProps {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
    undo?: () => void;
    redo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    initialWizardData?: WizardInitialData | null;
    onCheckScore?: (data: ResumeData) => void;
}

const STEPS = [
    { id: 0, title: 'Design', icon: <Palette size={18} /> },
    { id: 1, title: 'Header', icon: <User size={18} /> },
    { id: 2, title: 'Experience', icon: <Briefcase size={18} /> },
    { id: 3, title: 'Projects', icon: <Rocket size={18} /> },
    { id: 4, title: 'Education', icon: <GraduationCap size={18} /> },
    { id: 5, title: 'Skills', icon: <Zap size={18} /> },
    { id: 6, title: 'Achievements', icon: <Trophy size={18} /> },
    { id: 7, title: 'Languages', icon: <Languages size={18} /> },
    { id: 8, title: 'Summary', icon: <FileText size={18} /> },
    { id: 9, title: 'Finalize', icon: <CheckCircle2 size={18} /> },
];

const TEMPLATES_META = [
    { id: 'compact', name: 'Compact', desc: 'Space-efficient with a professional sidebar look.', tags: ['2-column'] },
    { id: 'elegant', name: 'Elegant', desc: 'Centered, serif typography for a refined aesthetic.', tags: ['1-column'] },
    { id: 'timeline', name: 'Timeline', desc: 'Clear chronological layout with left-aligned dates.', tags: ['graphics', '1-column'] },
    { id: 'modern', name: 'Modern Indigo', desc: 'Clean, colorful, and professional.', tags: ['graphics', '2-column'] },
    { id: 'classic', name: 'Classic Serif', desc: 'Timeless, formal, and authoritative.', tags: ['text-only', '1-column'] },
    { id: 'creative', name: 'Creative Split', desc: 'Bold sidebar with clear hierarchy.', tags: ['headshot', 'graphics', '2-column'] },
    { id: 'minimalist', name: 'Minimalist', desc: 'Centered, typewriter style for focus.', tags: ['text-only', '1-column'] },
    { id: 'standard', name: 'Standard Clean', desc: 'Left-aligned, highly readable sans-serif.', tags: ['text-only', '1-column'] },
    { id: 'executive', name: 'Executive', desc: 'Top bar accent with professional photo layout.', tags: ['headshot', '2-column'] }
];

const COLORS = [
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Taupe', hex: '#a8a29e' },
    { name: 'Dark', hex: '#1f2937' },
];

const FONTS = [
    { name: 'Modern Sans', id: 'sans', family: 'var(--font-inter)' },
    { name: 'Classic Serif', id: 'serif', family: 'Merriweather, serif' },
    { name: 'Tech Mono', id: 'mono', family: 'monospace' },
];

const SOCIAL_PLATFORMS = [
    "LinkedIn", "GitHub", "Portfolio", "Website", "Twitter", "Instagram", "Behance", "Dribbble", "Medium", "YouTube", "Other"
];

const DUMMY_DATA: ResumeData = {
    fullName: "ALEX MERCER",
    email: "alex.mercer@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Innovative and results-driven Senior Software Engineer with 7+ years of experience in full-stack development. Proven track record of leading high-performance teams, architecting scalable cloud solutions, and optimization of system performance by 40%. Passionate about clean code, mentorship, and building products that users love.",
    themeColor: "#4f46e5",
    font: "sans",
    socialLinks: [
        { id: '1', platform: "LinkedIn", url: "linkedin.com/in/alex" },
        { id: '2', platform: "GitHub", url: "github.com/alex" },
        { id: '3', platform: "Personal Site", url: "alexmercer.dev" }
    ],
    experience: [
        {
            id: '1',
            role: "Senior Full Stack Engineer",
            company: "TechFlow Solutions",
            duration: "2021 - Present",
            details: "• Spearheaded the migration of legacy monolith to microservices architecture, reducing deployment time by 60%.\n• Mentored a team of 5 junior developers, conducting code reviews and technical workshops.\n• Implemented CI/CD pipelines using GitHub Actions, achieving 99.9% uptime for core services."
        },
        {
            id: '2',
            role: "Software Developer",
            company: "Innovate Inc.",
            duration: "2018 - 2021",
            details: "• Developed and maintained a high-traffic e-commerce platform serving 1M+ monthly users.\n• Optimized database queries, reducing page load times by 35%.\n• Collaborated with UX/UI designers to implement responsive and accessible frontend components using React."
        },
        {
            id: '3',
            role: "Junior Web Developer",
            company: "Creative Studio",
            duration: "2016 - 2018",
            details: "• Built custom WordPress themes and plugins for diverse clients.\n• Assisted in the development of internal tools to streamline project management workflows."
        }
    ],
    education: [
        { id: '1', school: "University of California, Berkeley", degree: "B.S. Computer Science", year: "2016" }
    ],
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "GraphQL", "PostgreSQL", "System Design", "Agile Leadership"],
    languages: [
        { id: '1', language: "English", proficiency: "Native" },
        { id: '2', language: "Spanish", proficiency: "Intermediate" }
    ],
    projects: [
        {
            id: '1',
            title: "TaskMaster Pro",
            technologies: "React, Firebase, Tailwind",
            details: "• Designed and built a collaborative task management app with real-time updates using WebSockets.\n• Integrated Stripe for subscription payments and achieved 10k+ active users within 6 months.",
            link: "taskmaster.app"
        },
        {
            id: '2',
            title: "AI Resume Scanner",
            technologies: "Python, NLP, Flask",
            details: "• Developed an ATS-friendly resume parser that extracts key skills and experience with 95% accuracy.\n• Open-sourced the core algorithm, garnering 500+ stars on GitHub.",
            link: "github.com/alex/resume-scanner"
        }
    ],
    achievements: [
        "🏆 Hackathon Winner 2022 - Best Cloud Architecture",
        "📚 Published Author - 'Modern React Patterns' (Medium)",
        "⭐ Top 1% Contributor on Stack Overflow"
    ]
};

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ data, setData, undo, redo, canUndo, canRedo, initialWizardData, onCheckScore }) => {
    const [builderMode, setBuilderMode] = useState<'SELECT' | 'MANUAL' | 'AI'>(initialWizardData ? 'AI' : 'SELECT');
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
    const [targetRole, setTargetRole] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');

    // Filter States
    const [filterHeadshot, setFilterHeadshot] = useState<string>('All');
    const [filterColumns, setFilterColumns] = useState<string>('All');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo?.();
                } else {
                    undo?.();
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                redo?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);


    const updateField = (field: keyof ResumeData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    // --- Handlers (Simplified for brevity, logic maintained) ---
    const addExperience = () => setData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), role: '', company: '', duration: '', details: '' }] }));
    const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => setData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    const removeExperience = (id: string) => setData(prev => ({ ...prev, experience: prev.experience.filter(x => x.id !== id) }));

    const addProject = () => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { id: Date.now().toString(), title: '', details: '', link: '', technologies: '' }] }));
    const updateProject = (id: string, field: keyof ProjectItem, value: string) => setData(prev => ({ ...prev, projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    const removeProject = (id: string) => setData(prev => ({ ...prev, projects: prev.projects.filter(x => x.id !== id) }));

    const addEducation = () => setData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', year: '' }] }));
    const updateEducation = (id: string, field: keyof EducationItem, value: string) => setData(prev => ({ ...prev, education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    const removeEducation = (id: string) => setData(prev => ({ ...prev, education: prev.education.filter(x => x.id !== id) }));

    const addLanguage = () => setData(prev => ({ ...prev, languages: [...(prev.languages || []), { id: Date.now().toString(), language: '', proficiency: 'Fluent' }] }));
    const updateLanguage = (id: string, field: keyof LanguageItem, value: string) => setData(prev => ({ ...prev, languages: prev.languages.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    const removeLanguage = (id: string) => setData(prev => ({ ...prev, languages: prev.languages.filter(x => x.id !== id) }));

    const addSocialLink = () => setData(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || []), { id: Date.now().toString(), platform: 'LinkedIn', url: '' }] }));
    const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => setData(prev => ({ ...prev, socialLinks: prev.socialLinks.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    const removeSocialLink = (id: string) => setData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(x => x.id !== id) }));


    const handleAiSummary = async () => {
        if (!targetRole) return alert("Please enter a Target Role first.");
        setGenerating(true);
        try {
            const summary = await generateResumeSummary(data, targetRole);
            updateField('summary', summary);
        } catch (e) { console.error(e); } finally { setGenerating(false); }
    };

    // --- Filter Logic ---
    const filteredTemplates = TEMPLATES_META.filter(t => {
        if (filterHeadshot !== 'All') {
            const hasHeadshot = t.tags.includes('headshot');
            if (filterHeadshot === 'With Photo' && !hasHeadshot) return false;
            if (filterHeadshot === 'Without Photo' && hasHeadshot) return false;
        }
        if (filterColumns !== 'All') {
            const isTwoCol = t.tags.includes('2-column');
            if (filterColumns === '1' && isTwoCol) return false;
            if (filterColumns === '2' && !isTwoCol) return false;
        }
        return true;
    });


    // --- Mode Selection & AI Wizard ---
    if (builderMode === 'SELECT') {
        return (
            <div className="flex items-center justify-center min-h-[80vh] bg-background animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-4xl w-full px-6 text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">How do you want to build?</h2>
                        <p className="text-lg text-muted-foreground">Start from scratch or let our AI assist you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card
                            onClick={() => setBuilderMode('AI')}
                            className="group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <Wand2 className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Build with AI</h3>
                                    <p className="text-muted-foreground text-sm">Answer a few questions and get a complete resume drafted in seconds.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => setBuilderMode('MANUAL')}
                            className="group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Edit3 className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Manual Builder</h3>
                                    <p className="text-muted-foreground text-sm">Choose a template and fill in your details step-by-step with total control.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (builderMode === 'AI') {
        return (
            <AiResumeWizard
                initialData={initialWizardData}
                onCancel={() => setBuilderMode('SELECT')}
                onComplete={(generatedData, meta) => {
                    const newData = { ...data, ...generatedData, themeColor: meta.theme || data.themeColor, font: meta.font || data.font };
                    setData(newData);
                    setSelectedTemplate(meta.template as TemplateId || 'modern');
                    setBuilderMode('MANUAL');
                    setCurrentStep(9);
                }}
            />
        )
    }

    // --- Main Editor Split Layout ---
    return (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-background overflow-hidden">

            {/* Mobile Tabs */}
            <div className="lg:hidden flex border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <button
                    onClick={() => setActiveMobileTab('edit')}
                    className={cn("flex-1 py-3 text-sm font-bold border-b-2 transition-colors", activeMobileTab === 'edit' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                    Editor
                </button>
                <button
                    onClick={() => setActiveMobileTab('preview')}
                    className={cn("flex-1 py-3 text-sm font-bold border-b-2 transition-colors", activeMobileTab === 'preview' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                    Preview
                </button>
            </div>

            {/* LEFT PANE: Editor Form */}
            <div className={cn(
                "flex-1 flex flex-col bg-zinc-900/30 border-r border-white/5 overflow-hidden transition-all duration-300",
                activeMobileTab === 'edit' ? 'flex' : 'hidden lg:flex'
            )}>
                {/* Progress Header */}
                <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_-5px_var(--primary)]">
                                {STEPS[currentStep].icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-none">{STEPS[currentStep].title}</h2>
                                <span className="text-xs text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar scroll-smooth">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6 max-w-2xl mx-auto"
                        >
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label>Select Template</Label>
                                        <div className="flex gap-4 mb-4">
                                            <select className="bg-zinc-900 border border-white/10 rounded-md p-2 text-sm text-foreground" value={filterHeadshot} onChange={e => setFilterHeadshot(e.target.value)}>
                                                <option value="All">All Styles</option>
                                                <option value="With Photo">With Photo</option>
                                                <option value="Without Photo">No Photo</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {filteredTemplates.map(t => (
                                                <div
                                                    key={t.id}
                                                    onClick={() => { setSelectedTemplate(t.id as TemplateId); }}
                                                    className={cn(
                                                        "cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] overflow-hidden group relative aspect-[210/297] box-content",
                                                        selectedTemplate === t.id
                                                            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-zinc-950"
                                                            : "border-zinc-800 hover:border-zinc-500"
                                                    )}
                                                >
                                                    <div className="absolute inset-0 bg-white pointer-events-none overflow-hidden">
                                                        {/* Fixed Scale Rendering - Force 210mm width fit into container */}
                                                        <div className="origin-top-left transform scale-[0.18] sm:scale-[0.25] w-[210mm] h-[297mm]">
                                                            <ResumePreview data={{ ...DUMMY_DATA, themeColor: data.themeColor, font: data.font }} template={t.id as TemplateId} />
                                                        </div>
                                                    </div>

                                                    {/* Hover Overlay */}
                                                    <div className={cn(
                                                        "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10",
                                                        selectedTemplate === t.id && "bg-primary/20 opacity-100"
                                                    )}>
                                                        {selectedTemplate === t.id && (
                                                            <div className="bg-primary text-white rounded-full p-2 shadow-lg scale-110">
                                                                <CheckCircle2 className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer Label */}
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-zinc-950/90 border-t border-white/10 backdrop-blur-md z-20">
                                                        <div className="font-bold text-xs text-center text-white truncate">{t.name}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Accent Color</Label>
                                        <div className="flex gap-3 flex-wrap">
                                            {COLORS.map(c => (
                                                <button
                                                    key={c.hex}
                                                    onClick={() => updateField('themeColor', c.hex)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full transition-all",
                                                        data.themeColor === c.hex ? "ring-2 ring-primary ring-offset-2 ring-offset-zinc-950 scale-110" : "hover:scale-110"
                                                    )}
                                                    style={{ backgroundColor: c.hex }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Typography</Label>
                                        <div className="flex gap-2">
                                            {FONTS.map(f => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => updateField('font', f.id)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-sm border transition-all",
                                                        data.font === f.id ? "bg-primary text-primary-foreground border-primary" : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:bg-zinc-800"
                                                    )}
                                                    style={{ fontFamily: f.family }}
                                                >
                                                    {f.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={data.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="e.g. Alex Mercer" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={data.email} onChange={e => updateField('email', e.target.value)} placeholder="alex@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={data.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+1 555 000 0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input value={data.location || ''} onChange={e => updateField('location', e.target.value)} placeholder="New York, NY" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <Label>Social Links</Label>
                                            <Button size="sm" variant="ghost" onClick={addSocialLink}><Plus className="w-4 h-4 mr-1" /> Add</Button>
                                        </div>
                                        {data.socialLinks?.map((link) => (
                                            <div key={link.id} className="flex gap-3">
                                                <div className="w-1/3">
                                                    <select
                                                        className="w-full bg-zinc-900 border border-input rounded-md px-3 py-2 text-sm"
                                                        value={link.platform}
                                                        onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                                                    >
                                                        {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </div>
                                                <Input className="flex-1" placeholder="URL" value={link.url} onChange={e => updateSocialLink(link.id, 'url', e.target.value)} />
                                                <Button size="icon" variant="ghost" onClick={() => removeSocialLink(link.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Add your relevant work history.</p>
                                        <Button size="sm" onClick={addExperience}><Plus className="w-4 h-4 mr-2" /> Add Job</Button>
                                    </div>
                                    {data.experience.map((exp, index) => (
                                        <Card key={exp.id} className="relative group bg-zinc-900/40 border-white/5">
                                            <CardContent className="p-4 space-y-4">
                                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Job Title</Label>
                                                        <Input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Company</Label>
                                                        <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <Label>Duration</Label>
                                                        <Input value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} placeholder="Jan 2020 - Present" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea className="h-32" value={exp.details} onChange={e => updateExperience(exp.id, 'details', e.target.value)} placeholder="• Achieved X..." />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Highlight key projects.</p>
                                        <Button size="sm" onClick={addProject}><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
                                    </div>
                                    {data.projects?.map((proj) => (
                                        <Card key={proj.id} className="relative group bg-zinc-900/40 border-white/5">
                                            <CardContent className="p-4 space-y-4">
                                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeProject(proj.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Project Title</Label>
                                                        <Input value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Technologies</Label>
                                                        <Input value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <Label>Link (Optional)</Label>
                                                        <Input value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea className="h-24" value={proj.details} onChange={e => updateProject(proj.id, 'details', e.target.value)} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Academic background.</p>
                                        <Button size="sm" onClick={addEducation}><Plus className="w-4 h-4 mr-2" /> Add School</Button>
                                    </div>
                                    {data.education.map((edu) => (
                                        <Card key={edu.id} className="relative group bg-zinc-900/40 border-white/5">
                                            <CardContent className="p-4 grid grid-cols-1 gap-4">
                                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEducation(edu.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                <div className="space-y-2">
                                                    <Label>School / University</Label>
                                                    <Input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Degree / Major</Label>
                                                    <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Graduation Year</Label>
                                                    <Input value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-2">
                                    <Label>Skills (Comma Separated)</Label>
                                    <Textarea
                                        className="h-48 text-lg"
                                        value={data.skills.join(", ")}
                                        onChange={e => updateField('skills', e.target.value.split(",").map(s => s.trim()))}
                                        placeholder="React, Node.js, Team Leadership..."
                                    />
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="space-y-2">
                                    <Label>Key Achievements (One per line)</Label>
                                    <Textarea
                                        className="h-48 text-lg"
                                        value={data.achievements?.join("\n")}
                                        onChange={e => updateField('achievements', e.target.value.split("\n"))}
                                        placeholder="Published research paper..."
                                    />
                                </div>
                            )}

                            {currentStep === 7 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Languages.</p>
                                        <Button size="sm" onClick={addLanguage}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                    </div>
                                    {data.languages?.map((lang) => (
                                        <div key={lang.id} className="flex gap-4 items-center p-3 border border-white/5 rounded-lg bg-zinc-900/40">
                                            <div className="flex-1 space-y-1">
                                                <Label>Language</Label>
                                                <Input value={lang.language} onChange={e => updateLanguage(lang.id, 'language', e.target.value)} />
                                            </div>
                                            <div className="w-1/3 space-y-1">
                                                <Label>Proficiency</Label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={lang.proficiency} onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}>
                                                    <option value="Native">Native</option>
                                                    <option value="Fluent">Fluent</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Basic">Basic</option>
                                                </select>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => removeLanguage(lang.id)} className="mt-6 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentStep === 8 && (
                                <div className="space-y-6">
                                    <Card className="bg-primary/5 border-primary/20">
                                        <CardContent className="p-4 space-y-4">
                                            <Label className="text-primary">AI Generator</Label>
                                            <div className="flex gap-3">
                                                <Input
                                                    placeholder="Target Job Title (e.g. Retail Manager)"
                                                    value={targetRole}
                                                    onChange={e => setTargetRole(e.target.value)}
                                                    className="bg-background"
                                                />
                                                <Button onClick={handleAiSummary} disabled={generating || !targetRole} variant="glow">
                                                    {generating ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                                    Generate
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="space-y-2">
                                        <Label>Professional Summary</Label>
                                        <Textarea className="h-64 leading-relaxed p-4" value={data.summary} onChange={e => updateField('summary', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {currentStep === 9 && (
                                <div className="space-y-8 text-center py-8">
                                    <div>
                                        <h2 className="text-3xl font-bold font-heading mb-2">You're Ready!</h2>
                                        <p className="text-muted-foreground">Download your resume or switch back to Design to tweak styles.</p>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <Button size="lg" variant="outline" onClick={() => window.print()}>
                                            <Printer className="w-5 h-5 mr-2" /> Print / PDF
                                        </Button>
                                        <Button size="lg" variant="glow">
                                            <Download className="w-5 h-5 mr-2" /> Download Source
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {currentStep !== 9 && (
                    <div className="p-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-sm flex justify-between items-center z-40">
                        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
                            Back
                        </Button>
                        <Button onClick={handleNext} variant="glow" className="px-8">
                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* RIGHT PANE: Live Preview */}
            <div className={cn(
                "w-full lg:w-[50%] xl:w-[55%] bg-zinc-950 relative overflow-hidden shadow-inner transition-all duration-300",
                activeMobileTab === 'preview' ? 'block h-[calc(100vh-140px)]' : 'hidden lg:block'
            )}>
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]" />

                <div className="absolute inset-0 overflow-y-auto flex justify-center py-10 custom-scrollbar print:py-0 print:overflow-visible touch-pan-y">
                    <div id="resume-preview-container" className="bg-white shadow-2xl w-[210mm] min-h-[297mm] h-fit p-0 origin-top transform transition-all duration-500 scale-[0.5] sm:scale-[0.6] md:scale-[0.7] xl:scale-[0.8] 2xl:scale-[0.85] overflow-visible mb-20 print:transform-none print:shadow-none print:mb-0">
                        <ResumePreview
                            data={
                                // If we are in Design Mode (Step 0) AND the user hasn't entered a name yet, 
                                // show the rich DUMMY_DATA so they can visualize the template.
                                (currentStep === 0 && !data.fullName)
                                    ? { ...DUMMY_DATA, themeColor: data.themeColor, font: data.font }
                                    : data
                            }
                            template={selectedTemplate}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ResumeBuilder;