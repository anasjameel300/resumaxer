'use client';

import React, { useState } from 'react';
import { AppView, ResumeData, WizardInitialData, UserContext } from '@/types';
import ResumeBuilder from '@/components/builder/ResumeBuilder';
import AtsScorer from '@/components/analysis/AtsScorer';
import ResumeAnalysis from '@/components/analysis/ResumeAnalysis';
import RoastResume from '@/components/analysis/RoastResume';
import Profile from '@/components/profile/Profile';
import CareerRoadmap from '@/components/roadmap/CareerRoadmap';
import CoverLetterGenerator from '@/components/cover-letter/CoverLetterGenerator';
import OnboardingQuiz from '@/components/onboarding/OnboardingQuiz';
import JobTracker from '@/components/tracker/JobTracker';
import { useHistory } from '@/hooks/useHistory';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FileText, ClipboardList, BarChart, Wand2, Key, LayoutTemplate, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
    // Start at ONBOARDING for new users, or DASHBOARD if we had persistence
    const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
    const [wizardInitialData, setWizardInitialData] = useState<WizardInitialData | null>(null);
    const [scoreCheckText, setScoreCheckText] = useState<string>('');

    // Lifted state to share between Builder and Tailor - Now using useHistory
    const [resumeData, setResumeData, undo, redo, canUndo, canRedo] = useHistory<ResumeData>({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        socialLinks: [
            { id: '1', platform: 'LinkedIn', url: '' },
            { id: '2', platform: 'GitHub', url: '' },
            { id: '3', platform: 'Portfolio', url: '' },
            { id: '4', platform: 'Website', url: '' }
        ],
        summary: '',
        experience: [],
        projects: [],
        education: [],
        skills: [],
        achievements: [],
        languages: [],
        themeColor: '#4f46e5',
        font: 'sans'
    });

    const handleImproveResume = async (text: string, improvements: string[]) => {
        try {
            // Mock implementation until API is ready
            // const parsed = await parseRawResumeData(text);
            const parsed: WizardInitialData = {
                personalInfo: {
                    fullName: "User",
                    email: "",
                    phone: "",
                    location: "",
                    linkedin: ""
                },
                experienceRaw: "",
                educationRaw: "",
                skillsRaw: ""
            };

            parsed.analysisImprovements = improvements;
            setWizardInitialData(parsed);
            setCurrentView(AppView.BUILDER);
        } catch (e) {
            console.error("Failed to parse resume for improvement", e);
            alert("Could not parse resume for improvement. Starting fresh.");
            setWizardInitialData(null);
            setCurrentView(AppView.BUILDER);
        }
    };

    const handleCheckScore = (data: ResumeData) => {
        const text = `
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}

Summary:
${data.summary}

Experience:
${data.experience.map(e => `${e.role} at ${e.company} (${e.duration})\n${e.details}`).join('\n\n')}

Projects:
${data.projects.map(p => `${p.title} (${p.technologies})\n${p.link}\n${p.details}`).join('\n\n')}

Education:
${data.education.map(e => `${e.degree}, ${e.school}, ${e.year}`).join('\n')}

Skills:
${data.skills.join(', ')}

Achievements:
${data.achievements.join('\n')}
      `;

        setScoreCheckText(text);
        setCurrentView(AppView.ATS_SCORER);
    };

    const [userContext, setUserContext] = useState<UserContext | null>(null);

    const handleOnboardingComplete = (context: UserContext) => {
        setUserContext(context);

        // Auto-fill summary based on context
        setResumeData(prev => ({
            ...prev,
            summary: prev.summary || `Aspiring ${context.targetRole} with ${context.experience.replace(' Years', '')} years of experience. Goal: ${context.goal}. Focus: ${context.blocker}.`,
            skills: context.skills?.length ? context.skills : prev.skills,
        }));

        // Pass context to wizard data for the builder
        setWizardInitialData(prev => ({
            personalInfo: prev?.personalInfo || { fullName: resumeData.fullName, email: "", phone: "", location: "", linkedin: "" },
            experienceRaw: prev?.experienceRaw || "",
            educationRaw: prev?.educationRaw || "",
            skillsRaw: prev?.skillsRaw || "",
            userContext: context
        }));


        setCurrentView(AppView.DASHBOARD);
    };

    // Logic for rendering views
    if (currentView === AppView.ONBOARDING) {
        return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
    }

    const renderContent = () => {
        switch (currentView) {
            case AppView.BUILDER:
                return (
                    <ResumeBuilder
                        data={resumeData}
                        setData={setResumeData}
                        undo={undo}
                        redo={redo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        initialWizardData={wizardInitialData}
                        onCheckScore={handleCheckScore}
                    />
                );
            case AppView.ATS_SCORER:
                return <AtsScorer onImprove={handleImproveResume} initialText={scoreCheckText} />;
            case AppView.OPTIMIZER:
                return <ResumeAnalysis resumeData={resumeData} onNavigateToBuilder={() => setCurrentView(AppView.BUILDER)} />;
            case AppView.ROADMAP:
                return <CareerRoadmap data={resumeData} />;
            case AppView.COVER_LETTER:
                return <CoverLetterGenerator data={resumeData} onNavigateToBuilder={() => setCurrentView(AppView.BUILDER)} />;
            case AppView.ROASTER:
                return <RoastResume />;
            case AppView.PROFILE:
                return <Profile data={resumeData} setData={setResumeData} />;
            case AppView.TRACKER:
                return <JobTracker />;
            case AppView.DASHBOARD:
            default:
                return <DashboardHome onViewChange={setCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen flex bg-background font-sans text-foreground selection:bg-primary/20 selection:text-white">
            <Sidebar
                currentView={currentView}
                onViewChange={setCurrentView}
                userData={{ fullName: resumeData.fullName }}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header title={currentView === AppView.OPTIMIZER ? 'Resume Tailor' : currentView === AppView.ATS_SCORER ? 'Resume Analysis' : currentView} />

                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none z-[-1]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                    <ScrollReveal width="100%">
                        {renderContent()}
                    </ScrollReveal>
                </div>
            </main>
        </div>
    );
};

// Refactored Dashboard Home Sub-component
const DashboardHome = ({ onViewChange }: { onViewChange: (view: AppView) => void }) => (
    <div className="max-w-6xl mx-auto space-y-12">
        <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight mb-2">
                Hello, Professional.
            </h2>
            <p className="text-muted-foreground text-lg">Your career acceleration toolkit is ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardActionCard
                title="Resume Builder"
                desc="Draft a perfectly formatted resume with smart AI suggestions."
                icon={<FileText className="w-8 h-8 text-white" />}
                gradient="from-blue-500 to-indigo-600"
                onClick={() => onViewChange(AppView.BUILDER)}
            />
            <DashboardActionCard
                title="Job Tracker"
                desc="Organize your job search with a Kanban board."
                icon={<ClipboardList className="w-8 h-8 text-white" />}
                gradient="from-emerald-500 to-teal-600"
                onClick={() => onViewChange(AppView.TRACKER)}
            />
            <DashboardActionCard
                title="Resume Analysis"
                desc="Detailed analysis on content, ATS, and job optimization."
                icon={<BarChart className="w-8 h-8 text-white" />}
                gradient="from-violet-500 to-purple-600"
                onClick={() => onViewChange(AppView.ATS_SCORER)}
            />
            <DashboardActionCard
                title="Resume Tailor"
                desc="Match your existing resume to a specific JD."
                icon={<Wand2 className="w-8 h-8 text-white" />}
                gradient="from-pink-500 to-rose-600"
                onClick={() => onViewChange(AppView.OPTIMIZER)}
            />
        </div>

        <div>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Quick Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <TipCard
                    title="Keywords are King"
                    body="75% of resumes are rejected by ATS before a human sees them. Always tailor your keywords."
                    icon={<Key size={24} className="text-amber-400" />}
                />
                <TipCard
                    title="Clean Formatting"
                    body="Avoid columns, graphics, and tables. Simple layouts parse 30% better on average."
                    icon={<LayoutTemplate size={24} className="text-cyan-400" />}
                />
                <TipCard
                    title="Measurable Impact"
                    body="Don't just list duties. List achievements. 'Increased sales by 20%' wins interviews."
                    icon={<TrendingUp size={24} className="text-emerald-400" />}
                />
            </div>
        </div>
    </div>
);

const DashboardActionCard = ({ title, desc, icon, gradient, onClick }: any) => (
    <Card
        onClick={onClick}
        className="group relative overflow-hidden border-white/5 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 blur-xl`} />

        <CardContent className="p-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>

            <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
            </p>

            <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors">
                Launch Tool <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </CardContent>
    </Card>
);

const TipCard = ({ title, body, icon }: any) => (
    <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-xl flex gap-4 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
        </div>
    </div>
);

export default DashboardPage;
