import React, { useState, useEffect } from 'react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem, TemplateId, LanguageItem, SocialLink, WizardInitialData } from '../types';
import { generateResumeSummary } from '../services/geminiService';
import ResumePreview from './ResumeTemplates';
import AiResumeWizard from './AiResumeWizard';

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
    { id: 0, title: 'Design', icon: '🎨' },
    { id: 1, title: 'Header', icon: '👤' },
    { id: 2, title: 'Experience', icon: '💼' },
    { id: 3, title: 'Projects', icon: '🚀' },
    { id: 4, title: 'Education', icon: '🎓' },
    { id: 5, title: 'Skills', icon: '⚡' },
    { id: 6, title: 'Achievements', icon: '🏆' },
    { id: 7, title: 'Languages', icon: '🗣️' },
    { id: 8, title: 'Summary', icon: '📝' },
    { id: 9, title: 'Finalize', icon: '🎉' },
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
    { name: 'Modern Sans', id: 'sans', family: 'Roboto, sans-serif' },
    { name: 'Classic Serif', id: 'serif', family: 'Merriweather, serif' },
    { name: 'Tech Mono', id: 'mono', family: 'monospace' },
];

const SOCIAL_PLATFORMS = [
    "LinkedIn", "GitHub", "Portfolio", "Website", "Twitter", "Instagram", "Behance", "Dribbble", "Medium", "YouTube", "Other"
];

// Rich dummy data for the preview step (Step 0)
const RICH_PREVIEW_DATA: Partial<ResumeData> = {
    fullName: 'Diya Agarwal',
    email: 'diya.agarwal@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    summary: 'Results-oriented Senior Software Engineer with 6+ years of experience designing scalable web applications. Proven track record of improving system performance by 40% and leading cross-functional teams to deliver projects ahead of schedule. Expert in React, Node.js, and Cloud Infrastructure.',
    experience: [
        {
            id: '1',
            role: 'Senior Software Engineer',
            company: 'TechFlow Solutions',
            duration: '01/2021 - Present',
            details: '• Led a team of 5 developers to rebuild the core legacy application, resulting in a 50% reduction in load times.\n• Architected microservices using Node.js and Docker, handling over 1M requests daily.\n• Mentored junior engineers and conducted code reviews to maintain code quality standards.'
        },
        {
            id: '2',
            role: 'Software Developer',
            company: 'Innovate Corp',
            duration: '06/2018 - 12/2020',
            details: '• Developed responsive UI components using React and Redux, increasing user engagement by 25%.\n• Integrated third-party APIs (Stripe, Google Maps) to enhance product functionality.\n• Collaborated with UX designers to implement pixel-perfect designs.'
        }
    ],
    projects: [
        {
            id: '1',
            title: 'E-Commerce Analytics Dashboard',
            link: 'github.com/diya/analytics',
            technologies: 'React, D3.js, Firebase',
            details: '• Built a real-time dashboard tracking sales metrics for small businesses.\n• Implemented complex data visualization using D3.js.'
        }
    ],
    achievements: [
        'Winner of Smart India Hackathon 2019',
        'Published research paper on AI Ethics in IEEE 2020'
    ],
    education: [
        { id: '1', degree: 'B.Tech in Computer Science', school: 'Indian Institute of Technology, Delhi', year: '2018' },
        { id: '2', degree: 'High School Diploma', school: 'Delhi Public School', year: '2014' }
    ],
    skills: ['React.js', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'System Design', 'Agile Leadership'],
    languages: [
        { id: '1', language: 'English', proficiency: 'Native' },
        { id: '2', language: 'Hindi', proficiency: 'Native' },
        { id: '3', language: 'Spanish', proficiency: 'Intermediate' }
    ],
    socialLinks: [
        { id: '1', platform: 'LinkedIn', url: 'linkedin.com/in/diya' },
        { id: '2', platform: 'GitHub', url: 'github.com/diya-code' },
        { id: '3', platform: 'Portfolio', url: 'diya.dev' }
    ]
};

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ data, setData, undo, redo, canUndo, canRedo, initialWizardData, onCheckScore }) => {
    // If we have initial data (from Improve flow), default to AI mode immediately
    const [builderMode, setBuilderMode] = useState<'SELECT' | 'MANUAL' | 'AI'>(initialWizardData ? 'AI' : 'SELECT');
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
    const [targetRole, setTargetRole] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Mobile View State
    const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');

    // Filter States
    const [filterHeadshot, setFilterHeadshot] = useState<string>('All');
    const [filterGraphics, setFilterGraphics] = useState<string>('All');
    const [filterColumns, setFilterColumns] = useState<string>('All');

    // Keyboard Shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    if (redo) {
                        e.preventDefault();
                        redo();
                    }
                } else {
                    if (undo) {
                        e.preventDefault();
                        undo();
                    }
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                if (redo) {
                    e.preventDefault();
                    redo();
                }
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

    // --- Experience Handlers ---
    const addExperience = () => {
        const newExp: ExperienceItem = { id: Date.now().toString(), role: '', company: '', duration: '', details: '' };
        setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
    };
    const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
        setData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    const removeExperience = (id: string) => {
        setData(prev => ({ ...prev, experience: prev.experience.filter(x => x.id !== id) }));
    };

    // --- Project Handlers ---
    const addProject = () => {
        const newProj: ProjectItem = { id: Date.now().toString(), title: '', details: '', link: '', technologies: '' };
        setData(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
    };
    const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
        setData(prev => ({ ...prev, projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    const removeProject = (id: string) => {
        setData(prev => ({ ...prev, projects: prev.projects.filter(x => x.id !== id) }));
    };

    // --- Education Handlers ---
    const addEducation = () => {
        const newEdu: EducationItem = { id: Date.now().toString(), degree: '', school: '', year: '' };
        setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };
    const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
        setData(prev => ({ ...prev, education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    const removeEducation = (id: string) => {
        setData(prev => ({ ...prev, education: prev.education.filter(x => x.id !== id) }));
    };

    // --- Language Handlers ---
    const addLanguage = () => {
        const newLang: LanguageItem = { id: Date.now().toString(), language: '', proficiency: 'Fluent' };
        setData(prev => ({ ...prev, languages: [...(prev.languages || []), newLang] }));
    };
    const updateLanguage = (id: string, field: keyof LanguageItem, value: string) => {
        setData(prev => ({ ...prev, languages: prev.languages.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    const removeLanguage = (id: string) => {
        setData(prev => ({ ...prev, languages: prev.languages.filter(x => x.id !== id) }));
    };

    // --- Social Link Handlers ---
    const addSocialLink = () => {
        const newLink: SocialLink = { id: Date.now().toString(), platform: 'LinkedIn', url: '' };
        setData(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || []), newLink] }));
    };
    const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
        setData(prev => ({ ...prev, socialLinks: prev.socialLinks.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    const removeSocialLink = (id: string) => {
        setData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(x => x.id !== id) }));
    };

    const handleAiSummary = async () => {
        if (!targetRole) return alert("Please enter a Target Role first.");
        setGenerating(true);
        try {
            const summary = await generateResumeSummary(data, targetRole);
            updateField('summary', summary);
        } catch (e) { console.error(e); } finally { setGenerating(false); }
    };

    // --- LaTeX Export Handler ---
    const handleLatexExport = async () => {
        setGeneratingPdf(true);
        try {
            const latexCode = generateLatexSource(data, selectedTemplate);

            // Use POST request to avoid URL length limitations
            const response = await fetch("https://latexonline.cc/compile?text=" + encodeURIComponent(latexCode), {
                method: "GET", // changed back to GET for compatibility, if fail, we catch error
            });

            // Better approach: Since latexonline doesn't support CORS for POST in all cases from browser,
            // we construct a form and submit it if fetch fails, OR use the URL method if short enough.
            // But for reliable download, let's try to fetch blob.

            // If GET fails (likely 414), we can't easily do POST from client without a proxy due to CORS on latexonline.cc
            // HOWEVER, we can open a new window with the URL if it's short enough.
            // Since we can't control the server, we will try the fetch. 

            if (!response.ok) {
                throw new Error(`LaTeX compilation failed: ${response.statusText}`);
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${(data.fullName || 'resume').replace(/\s+/g, '_')}_Latex.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            console.error(e);
            alert("Standard LaTeX generation failed (likely too much text). We recommend using the 'Standard PDF' button which prints the exact design you see.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    // --- Filter Logic ---
    const filteredTemplates = TEMPLATES_META.filter(t => {
        if (filterHeadshot !== 'All') {
            const hasHeadshot = t.tags.includes('headshot');
            if (filterHeadshot === 'With Photo' && !hasHeadshot) return false;
            if (filterHeadshot === 'Without Photo' && hasHeadshot) return false;
        }
        if (filterGraphics !== 'All') {
            const hasGraphics = t.tags.includes('graphics');
            if (filterGraphics === 'Yes' && !hasGraphics) return false;
            if (filterGraphics === 'No' && hasGraphics) return false;
        }
        if (filterColumns !== 'All') {
            const isTwoCol = t.tags.includes('2-column');
            if (filterColumns === '1' && isTwoCol) return false;
            if (filterColumns === '2' && !isTwoCol) return false;
        }
        return true;
    });

    // ... (Steps 0-8 same as previous) ...
    // Re-including only the changed rendering logic for MODE SELECTION and Step 0 for brevity in context, assuming full file update.
    // Actually, I must provide full file content for the <change> block.

    if (builderMode === 'SELECT') {
        return (
            <div className="max-w-4xl mx-auto py-12 animate-fade-in text-center px-4">
                <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight mb-4">How do you want to build?</h2>
                <p className="text-lg text-surface-500 mb-12">Start from scratch with our templates or let AI interview you to build a perfect resume.</p>

                <div className="grid md:grid-cols-2 gap-8">
                    <button
                        onClick={() => setBuilderMode('AI')}
                        className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-primary-100 hover:border-primary-500 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-32 h-32 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8z" /><path d="M12 6a1 1 0 00-1 1v4.586l-2.707-2.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l4.414-4.414a1 1 0 00-1.414-1.414L13 11.586V7a1 1 0 00-1-1z" /></svg>
                        </div>
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                            🤖
                        </div>
                        <h3 className="text-2xl font-bold text-surface-900 mb-2">Build with AI</h3>
                        <p className="text-surface-600 mb-6">Answer a few questions about your background and we'll draft the entire resume for you.</p>
                        <span className="inline-flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all">
                            Start AI Wizard <span className="ml-1">→</span>
                        </span>
                    </button>

                    <button
                        onClick={() => setBuilderMode('MANUAL')}
                        className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-surface-200 hover:border-surface-400 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
                    >
                        <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                            ✍️
                        </div>
                        <h3 className="text-2xl font-bold text-surface-900 mb-2">Work with Template</h3>
                        <p className="text-surface-600 mb-6">Choose a design and manually fill in your details step-by-step. Best for total control.</p>
                        <span className="inline-flex items-center text-surface-600 font-bold group-hover:text-surface-900 group-hover:gap-2 transition-all">
                            Manual Builder <span className="ml-1">→</span>
                        </span>
                    </button>
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
                    const newData = {
                        ...data,
                        ...generatedData,
                        themeColor: meta.theme || data.themeColor,
                        font: meta.font || data.font,
                        socialLinks: generatedData.socialLinks.map((l, i) => ({ ...l, id: l.id || i.toString() })),
                        experience: generatedData.experience.map((e, i) => ({ ...e, id: e.id || i.toString() })),
                        education: generatedData.education.map((e, i) => ({ ...e, id: e.id || i.toString() })),
                        projects: generatedData.projects?.map((p, i) => ({ ...p, id: p.id || i.toString() })) || [],
                        languages: generatedData.languages?.map((l, i) => ({ ...l, id: l.id || i.toString() })) || []
                    };
                    setData(newData);
                    setSelectedTemplate(meta.template as TemplateId || 'modern');
                    setBuilderMode('MANUAL');
                    setCurrentStep(9);
                }}
            />
        )
    }

    if (currentStep === 0) {
        return (
            <div className="max-w-7xl mx-auto py-8 animate-fade-in">
                <div className="flex justify-between items-center mb-10 px-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight">Design your Resume</h2>
                        <p className="text-surface-500 mt-2 text-lg">Choose a template, color scheme, and font that fits your professional brand.</p>
                    </div>
                    <button onClick={() => setBuilderMode('SELECT')} className="text-sm font-bold text-surface-500 hover:text-primary-600">
                        ← Switch Mode
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 mb-10 sticky top-0 z-30">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                            <div>
                                <label className="block text-xs font-bold text-surface-500 uppercase mb-2">Font Style</label>
                                <div className="flex bg-surface-100 p-1 rounded-lg">
                                    {FONTS.map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => updateField('font', f.id)}
                                            className={`px-3 py-1.5 text-sm rounded-md transition-all ${data.font === f.id ? 'bg-white shadow text-surface-900 font-bold' : 'text-surface-500 hover:text-surface-700'}`}
                                            title={f.name}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-surface-500 uppercase mb-2">Accent Color</label>
                                <div className="flex gap-2">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c.hex}
                                            onClick={() => updateField('themeColor', c.hex)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${data.themeColor === c.hex ? 'border-surface-900 scale-110 ring-2 ring-offset-2 ring-surface-300' : 'border-white hover:scale-110'}`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-auto">
                            <label className="block text-xs font-bold text-surface-500 uppercase mb-2">Filter Templates</label>
                            <div className="flex gap-3">
                                <select className="input-field !py-1.5 !text-sm" value={filterHeadshot} onChange={e => setFilterHeadshot(e.target.value)}>
                                    <option value="All">Headshot: All</option>
                                    <option value="With Photo">With Photo</option>
                                    <option value="Without Photo">No Photo</option>
                                </select>
                                <select className="input-field !py-1.5 !text-sm" value={filterColumns} onChange={e => setFilterColumns(e.target.value)}>
                                    <option value="All">Cols: All</option>
                                    <option value="1">1 Column</option>
                                    <option value="2">2 Columns</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-12">
                    {filteredTemplates.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => { setSelectedTemplate(t.id as TemplateId); handleNext(); }}
                            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-surface-200 hover:border-primary-500 hover:shadow-2xl hover:-translate-y-2 ${selectedTemplate === t.id ? 'ring-4 ring-primary-500 ring-offset-4' : ''}`}
                        >
                            <div className="h-96 bg-surface-100 relative overflow-hidden">
                                <div className="absolute inset-0 overflow-hidden pointer-events-none transform scale-[0.4] origin-top-left w-[250%] h-[250%] bg-white transition-transform duration-700 ease-out group-hover:scale-[0.45]">
                                    <ResumePreview data={{
                                        ...data,
                                        ...RICH_PREVIEW_DATA,
                                        themeColor: data.themeColor || '#3b82f6',
                                        font: data.font || 'sans'
                                    } as ResumeData} template={t.id as TemplateId} />
                                </div>
                                <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                                    <button className="bg-white text-surface-900 px-8 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                        <span>Select Template</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t border-surface-100">
                                <h3 className="font-bold text-surface-900">{t.name}</h3>
                                <p className="text-xs text-surface-500">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-0 lg:gap-8 overflow-hidden relative">

            <div className="lg:hidden flex border-b border-surface-200 bg-white">
                <button
                    onClick={() => setActiveMobileTab('edit')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeMobileTab === 'edit' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500'}`}
                >
                    📝 Edit
                </button>
                <button
                    onClick={() => setActiveMobileTab('preview')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeMobileTab === 'preview' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500'}`}
                >
                    👁️ Preview
                </button>
            </div>

            <div className={`${activeMobileTab === 'edit' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-white lg:rounded-2xl shadow-soft border-r lg:border border-surface-200 overflow-hidden z-20`}>

                <div className="px-6 py-4 md:px-8 md:py-6 border-b border-surface-100 bg-surface-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-surface-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">{STEPS[currentStep].icon}</span>
                            {STEPS[currentStep].title}
                        </h2>
                        <div className="flex items-center gap-4">
                            {undo && redo && (
                                <div className="hidden md:flex items-center gap-2 mr-4 bg-white rounded-lg p-1 border border-surface-200 shadow-sm">
                                    <button
                                        onClick={undo}
                                        disabled={!canUndo}
                                        className="p-1.5 text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                        title="Undo (Ctrl+Z)"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    </button>
                                    <div className="w-px h-4 bg-surface-200"></div>
                                    <button
                                        onClick={redo}
                                        disabled={!canRedo}
                                        className="p-1.5 text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                        title="Redo (Ctrl+Y)"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                                    </button>
                                </div>
                            )}
                            <div className="text-sm font-medium text-surface-500">Step {currentStep}/{STEPS.length - 1}</div>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar pb-20 md:pb-8">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-surface-600">Personal details and social links.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="label-text">Full Name</label><input type="text" className="input-field" placeholder="e.g. Diya Agarwal" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} /></div>
                                <div><label className="label-text">Email</label><input type="email" className="input-field" placeholder="e.g. diya@example.com" value={data.email} onChange={e => updateField('email', e.target.value)} /></div>
                                <div><label className="label-text">Phone</label><input type="tel" className="input-field" placeholder="e.g. +91 11 5555 3345" value={data.phone} onChange={e => updateField('phone', e.target.value)} /></div>
                                <div><label className="label-text">Location</label><input type="text" className="input-field" placeholder="e.g. New Delhi, India" value={data.location || ''} onChange={e => updateField('location', e.target.value)} /></div>
                            </div>
                            <div className="border-t border-surface-100 pt-6">
                                <div className="flex justify-between items-center mb-4"><label className="label-text mb-0">Social Links</label><button onClick={addSocialLink} className="text-sm font-bold text-primary-600">+ Add Link</button></div>
                                <div className="space-y-3">
                                    {data.socialLinks?.map((link) => (
                                        <div key={link.id} className="flex gap-3 items-center">
                                            <div className="w-1/3"><select className="input-field !py-3" value={link.platform} onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}>{SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                            <div className="flex-1 relative"><input type="text" className="input-field w-full pl-3" placeholder="URL" value={link.url} onChange={e => updateSocialLink(link.id, 'url', e.target.value)} /></div>
                                            <button onClick={() => removeSocialLink(link.id)} className="text-surface-400 hover:text-red-500 p-2">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center"><p className="text-surface-600">Work experience.</p><button onClick={addExperience} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">+ Add Job</button></div>
                            {data.experience.map((exp, index) => (
                                <div key={exp.id} className="p-6 border border-surface-200 rounded-xl bg-surface-50 relative group">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-surface-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">{index + 1}</div>
                                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-surface-400 hover:text-red-500">✕</button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div><label className="label-text">Job Title</label><input type="text" className="input-field" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} /></div>
                                        <div><label className="label-text">Employer</label><input type="text" className="input-field" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                                        <div className="md:col-span-2"><label className="label-text">Dates</label><input type="text" className="input-field" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} /></div>
                                    </div>
                                    <div><label className="label-text">Description</label><textarea className="input-field h-32 resize-none" value={exp.details} onChange={e => updateExperience(exp.id, 'details', e.target.value)} /></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center"><p className="text-surface-600">Projects.</p><button onClick={addProject} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">+ Add Project</button></div>
                            {data.projects?.map((proj, index) => (
                                <div key={proj.id} className="p-6 border border-surface-200 rounded-xl bg-surface-50 relative group">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-surface-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">{index + 1}</div>
                                    <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-surface-400 hover:text-red-500">✕</button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div><label className="label-text">Title</label><input type="text" className="input-field" value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} /></div>
                                        <div><label className="label-text">Tech Stack</label><input type="text" className="input-field" value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} /></div>
                                        <div className="md:col-span-2"><label className="label-text">Link</label><input type="text" className="input-field" value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} /></div>
                                    </div>
                                    <div><label className="label-text">Description</label><textarea className="input-field h-32 resize-none" value={proj.details} onChange={e => updateProject(proj.id, 'details', e.target.value)} /></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center"><p className="text-surface-600">Education.</p><button onClick={addEducation} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">+ Add School</button></div>
                            {data.education.map((edu, index) => (
                                <div key={edu.id} className="p-6 border border-surface-200 rounded-xl bg-surface-50 relative group">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-surface-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">{index + 1}</div>
                                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-surface-400 hover:text-red-500">✕</button>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div><label className="label-text">School</label><input type="text" className="input-field" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} /></div>
                                        <div><label className="label-text">Degree</label><input type="text" className="input-field" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                                        <div><label className="label-text">Year</label><input type="text" className="input-field" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-surface-600">Skills.</p>
                            <div>
                                <label className="label-text">Skills (Comma Separated)</label>
                                <textarea className="input-field h-48 resize-none text-lg" value={data.skills.join(", ")} onChange={e => updateField('skills', e.target.value.split(",").map(s => s.trim()))} />
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-surface-600">Achievements.</p>
                            <div>
                                <label className="label-text">One per line</label>
                                <textarea className="input-field h-48 resize-none text-lg" value={data.achievements?.join("\n")} onChange={e => updateField('achievements', e.target.value.split("\n"))} />
                            </div>
                        </div>
                    )}

                    {currentStep === 7 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center"><p className="text-surface-600">Languages.</p><button onClick={addLanguage} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">+ Add Language</button></div>
                            {data.languages?.map((lang) => (
                                <div key={lang.id} className="flex gap-4 items-center p-4 border border-surface-200 rounded-lg bg-white">
                                    <div className="flex-1"><label className="text-xs font-bold text-surface-400 uppercase">Language</label><input type="text" className="input-field" value={lang.language} onChange={e => updateLanguage(lang.id, 'language', e.target.value)} /></div>
                                    <div className="w-1/3"><label className="text-xs font-bold text-surface-400 uppercase">Proficiency</label><select className="input-field" value={lang.proficiency} onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}><option value="Native">Native</option><option value="Fluent">Fluent</option><option value="Advanced">Advanced</option><option value="Intermediate">Intermediate</option><option value="Basic">Basic</option></select></div>
                                    <button onClick={() => removeLanguage(lang.id)} className="mt-5 text-surface-400 hover:text-red-500">✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 8 && (
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-surface-600">Professional Summary.</p>
                            <div className="bg-gradient-to-r from-indigo-50 to-primary-50 p-6 rounded-xl border border-primary-100 mb-6">
                                <div className="flex gap-3">
                                    <input type="text" className="input-field flex-1" placeholder="Target Job Title (e.g. Retail Manager)" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                                    <button onClick={handleAiSummary} disabled={generating || !targetRole} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50">{generating ? 'Writing...' : 'AI Generate'}</button>
                                </div>
                            </div>
                            <textarea className="input-field h-48 resize-none leading-relaxed" placeholder="Professional summary..." value={data.summary} onChange={e => updateField('summary', e.target.value)} />
                        </div>
                    )}

                    {currentStep === 9 && (
                        <div className="h-full flex flex-col">
                            <div className="px-8 py-6 border-b border-surface-100 bg-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold text-surface-900">Finalize & Export</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => window.print()} className="px-4 py-2 bg-surface-100 text-surface-700 rounded-lg font-bold hover:bg-surface-200 flex items-center gap-2 border border-surface-200 shadow-sm transition-all hover:shadow-md">
                                            <span className="text-xl">🖨️</span> Standard PDF
                                        </button>
                                        <button onClick={handleLatexExport} disabled={generatingPdf} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 flex items-center gap-2 shadow-md disabled:opacity-50 transition-all hover:shadow-lg">
                                            {generatingPdf ? <span className="animate-spin">⌛</span> : <span className="text-xl">📄</span>} LaTeX PDF
                                        </button>
                                    </div>
                                </div>
                                <p className="text-surface-500 text-sm">Customize the final look before downloading.</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-center justify-between">
                                    <div><h3 className="font-bold text-indigo-900">How strong is this resume?</h3><p className="text-sm text-indigo-700">Check your new ATS score before exporting.</p></div>
                                    <button onClick={() => onCheckScore && onCheckScore(data)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">View Score</button>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-surface-400 uppercase mb-3 block">Color Theme</label>
                                        <div className="flex flex-wrap gap-3">{COLORS.map((c) => (<button key={c.hex} onClick={() => updateField('themeColor', c.hex)} className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${data.themeColor === c.hex ? 'border-surface-900 scale-110 ring-2 ring-offset-2 ring-surface-300' : 'border-white hover:scale-110'}`} style={{ backgroundColor: c.hex }} title={c.name} />))}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-surface-400 uppercase mb-3 block">Typography</label>
                                        <div className="grid grid-cols-3 gap-3">{FONTS.map(f => (<button key={f.id} onClick={() => updateField('font', f.id)} className={`px-4 py-3 rounded-xl border transition-all text-sm ${data.font === f.id ? 'bg-surface-900 text-white border-surface-900 shadow-md' : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300 hover:bg-surface-50'}`}><span style={{ fontFamily: f.family }}>{f.name}</span></button>))}</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-surface-400 uppercase mb-4 block">Switch Template</label>
                                    <div className="grid grid-cols-2 gap-4">{TEMPLATES_META.map((t) => (<button key={t.id} onClick={() => setSelectedTemplate(t.id as TemplateId)} className={`text-left p-4 rounded-xl border-2 transition-all ${selectedTemplate === t.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-200' : 'border-surface-100 hover:border-surface-300 bg-white hover:shadow-md'}`}><div className="font-bold text-surface-900 text-sm mb-1">{t.name}</div><div className="text-xs text-surface-500 line-clamp-2">{t.desc}</div></button>))}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {currentStep !== 9 && (
                    <div className="p-6 border-t border-surface-200 bg-white flex justify-between items-center z-30">
                        <button onClick={handleBack} disabled={currentStep === 0} className="px-6 py-3 rounded-lg font-bold text-surface-500 hover:bg-surface-100 disabled:opacity-0 transition-all">Back</button>
                        <button onClick={handleNext} className="px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 bg-primary-600 hover:bg-primary-700">Continue</button>
                    </div>
                )}
            </div>

            <div className={`${activeMobileTab === 'preview' ? 'block' : 'hidden'} lg:block w-full lg:w-[45%] bg-surface-100 relative shadow-inner overflow-hidden`}>
                <div className="absolute inset-0 overflow-y-auto flex justify-center py-10 custom-scrollbar print:py-0 print:overflow-visible">
                    <div id="resume-preview-container" className="bg-white shadow-2xl w-[210mm] min-h-[297mm] h-fit p-[10mm] origin-top transform transition-all duration-300 scale-[0.5] md:scale-[0.65] lg:scale-[0.7] xl:scale-[0.85] overflow-visible mb-20 print:transform-none print:shadow-none print:mb-0">
                        <ResumePreview data={data} template={selectedTemplate} />
                    </div>
                </div>
            </div>

        </div>
    );
};

const generateLatexSource = (data: ResumeData, templateId: string): string => {
    // Robust LaTeX escaping
    const esc = (s: string = "") => {
        if (!s) return "";
        return s
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/([&%$#_{}~^])/g, "\\$1")
            .replace(/\n/g, "\\\\") // Handle newlines
            .replace(/"/g, "''");
    };

    const isSerif = data.font === 'serif' || ['classic', 'elegant'].includes(templateId);
    const isMono = data.font === 'mono';

    let fontPackage = "\\usepackage[scaled]{helvet}\\renewcommand\\familydefault{\\sfdefault}";
    if (isSerif) fontPackage = "\\usepackage{times}";
    if (isMono) fontPackage = "\\usepackage{courier}\\renewcommand\\familydefault{\\ttdefault}";

    const colorHex = data.themeColor?.replace('#', '') || '000000';

    let headerLatex = "";
    if (templateId === 'compact' || templateId === 'modern') {
        headerLatex = `
\\begin{minipage}[t]{0.70\\textwidth}
    {\\Huge \\textbf{${esc(data.fullName)}}}\\\\
    \\vspace{5pt}
    {\\color{gray} ${esc(data.summary?.substring(0, 150))}...}
\\end{minipage}
\\begin{minipage}[t]{0.28\\textwidth}
    \\raggedleft
    {\\small
    ${data.email ? `\\href{mailto:${esc(data.email)}}{${esc(data.email)}} \\\\` : ""}
    ${data.phone ? `${esc(data.phone)} \\\\` : ""}
    ${data.location ? `${esc(data.location)} \\\\` : ""}
    }
\\end{minipage}
\\vspace{20pt}
`;
    } else {
        headerLatex = `
\\begin{center}
    {\\Huge \\textbf{${esc(data.fullName)}}}\\\\
    \\vspace{5pt}
    {\\color{gray} 
    ${data.location ? esc(data.location) + " $\\cdot$ " : ""}
    ${data.phone ? esc(data.phone) + " $\\cdot$ " : ""}
    ${data.email ? esc(data.email) : ""}
    }
    ${data.socialLinks && data.socialLinks.filter(l => l.url).length > 0 ? `\\\\ \\vspace{3pt} {\\small ${data.socialLinks.filter(l => l.url).map(l => `${esc(l.platform)}: \\href{${l.url}}{${esc(l.url)}}`).join(" $\\cdot$ ")}}` : ""}
\\end{center}
\\vspace{10pt}
`;
    }

    return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\definecolor{primary}{HTML}{${colorHex}}
${fontPackage}

% Section styling based on theme color
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{8pt}

\\pagestyle{empty}

\\begin{document}

${headerLatex}

${data.summary && !['compact', 'modern'].includes(templateId) ? `
\\section*{Summary}
${esc(data.summary)}
` : ''}

${data.experience.length > 0 ? `
\\section*{Experience}
${data.experience.map(exp => `
\\noindent \\textbf{${esc(exp.role)}} \\hfill {\\color{gray} ${esc(exp.duration)}} \\\\
{\\color{primary} \\textit{${esc(exp.company)}}}
\\vspace{3pt}
\\begin{itemize}[leftmargin=*, noitemsep, topsep=0pt]
    ${exp.details.split('\n').filter(l => l.trim()).map(l => `\\item ${esc(l.replace(/^[•-]\s*/, ''))}`).join('\n')}
\\end{itemize}
\\vspace{6pt}
`).join('\n')}
` : ''}

${data.projects && data.projects.length > 0 ? `
\\section*{Projects}
${data.projects.map(proj => `
\\noindent \\textbf{${esc(proj.title)}} ${proj.technologies ? `\\hfill {\\small \\textit{${esc(proj.technologies)}}}` : ''} \\\\
${proj.link ? `{\\small \\url{${esc(proj.link)}}} \\\\` : ''}
\\begin{itemize}[leftmargin=*, noitemsep, topsep=0pt]
    ${proj.details.split('\n').filter(l => l.trim()).map(l => `\\item ${esc(l.replace(/^[•-]\s*/, ''))}`).join('\n')}
\\end{itemize}
\\vspace{6pt}
`).join('\n')}
` : ''}

${data.education.length > 0 ? `
\\section*{Education}
${data.education.map(edu => `
\\noindent \\textbf{${esc(edu.school)}} \\hfill {\\color{gray} ${esc(edu.year)}} \\\\
\\textit{${esc(edu.degree)}}
\\vspace{6pt}
`).join('\n')}
` : ''}

${data.skills.length > 0 ? `
\\section*{Skills}
\\begin{itemize}[label=\\color{primary}$\\bullet$, leftmargin=*]
    \\item ${data.skills.map(s => esc(s)).join(', ')}
\\end{itemize}
` : ''}

${data.achievements && data.achievements.length > 0 ? `
\\section*{Achievements}
\\begin{itemize}[label=\\color{primary}$\\bullet$, leftmargin=*]
    ${data.achievements.filter(a => a.trim()).map(a => `\\item ${esc(a)}`).join('\n')}
\\end{itemize}
` : ''}

${data.languages && data.languages.length > 0 ? `
\\section*{Languages}
\\noindent ${data.languages.map(l => `\\textbf{${esc(l.language)}} (${esc(l.proficiency)})`).join(', ')}
` : ''}

\\end{document}
    `;
};

export default ResumeBuilder;