import React, { useState } from 'react';
import { AppView, ResumeData, WizardInitialData } from './types';
import ResumeBuilder from './components/ResumeBuilder';
import AtsScorer from './components/AtsScorer';
import ResumeAnalysis from './components/ResumeAnalysis';
import RoastResume from './components/RoastResume';
import Profile from './components/Profile';
import CareerRoadmap from './components/CareerRoadmap';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import LandingPage from './components/LandingPage';
import { useHistory } from './hooks/useHistory';
import { parseRawResumeData } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
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
      // 1. Parse text into wizard data
      try {
          const parsed = await parseRawResumeData(text);
          // Attach improvements to be used by the Wizard AI
          parsed.analysisImprovements = improvements;
          setWizardInitialData(parsed);
          // 2. Switch to Builder
          setCurrentView(AppView.BUILDER);
      } catch (e) {
          console.error("Failed to parse resume for improvement", e);
          alert("Could not parse resume for improvement. Starting fresh.");
          setWizardInitialData(null);
          setCurrentView(AppView.BUILDER);
      }
  };

  const handleCheckScore = (data: ResumeData) => {
      // Convert ResumeData object to a string representation for the scorer
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

  // If on landing page, show full screen landing component
  if (currentView === AppView.LANDING) {
      return <LandingPage onStart={() => setCurrentView(AppView.DASHBOARD)} />;
  }

  // Otherwise, show the app layout
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
      case AppView.DASHBOARD:
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-72 bg-surface-900 text-white flex flex-col flex-shrink-0 transition-all duration-300 shadow-xl z-20">
        <div className="p-6 flex items-center gap-4 border-b border-surface-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center font-bold text-xl shadow-glow text-white">
            R
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-lg tracking-tight block leading-none">Resumaxer</span>
            <span className="text-xs text-surface-400 font-medium">AI Career Suite</span>
          </div>
        </div>
        
        <nav className="flex-1 py-8 space-y-2 px-3 overflow-y-auto">
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
            label="Dashboard" 
            active={currentView === AppView.DASHBOARD}
            onClick={() => setCurrentView(AppView.DASHBOARD)} 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-surface-500 uppercase tracking-wider hidden md:block">
            Tools
          </div>
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            label="Resume Builder" 
            active={currentView === AppView.BUILDER}
            onClick={() => setCurrentView(AppView.BUILDER)} 
          />
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            label="Resume Analysis" 
            active={currentView === AppView.ATS_SCORER}
            onClick={() => setCurrentView(AppView.ATS_SCORER)} 
          />
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            label="Resume Tailor" 
            active={currentView === AppView.OPTIMIZER}
            onClick={() => setCurrentView(AppView.OPTIMIZER)} 
          />
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            label="Cover Letter" 
            active={currentView === AppView.COVER_LETTER}
            onClick={() => setCurrentView(AppView.COVER_LETTER)} 
          />
           <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
            label="Career Roadmap" 
            active={currentView === AppView.ROADMAP}
            onClick={() => setCurrentView(AppView.ROADMAP)} 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-surface-500 uppercase tracking-wider hidden md:block">
            Fun
          </div>
          <NavItem 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
            label="Roast My Resume" 
            active={currentView === AppView.ROASTER}
            onClick={() => setCurrentView(AppView.ROASTER)}
            variant="danger"
          />
        </nav>
        
        <div className="p-4 border-t border-surface-700/50">
          <button 
             onClick={() => setCurrentView(AppView.PROFILE)}
             className={`w-full bg-surface-800 rounded-lg p-3 flex items-center gap-3 hover:bg-surface-700 transition-colors ${currentView === AppView.PROFILE ? 'ring-2 ring-primary-500' : ''}`}
          >
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-indigo-300 flex items-center justify-center font-bold text-surface-900 text-xs">
                {resumeData.fullName ? resumeData.fullName.charAt(0) : 'G'}
             </div>
             <div className="hidden md:block text-left">
               <div className="text-sm font-medium text-white">{resumeData.fullName || 'Guest User'}</div>
               <div className="text-xs text-surface-400">View Profile</div>
             </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-surface-50">
        <header className="bg-white border-b border-surface-200 p-4 md:px-8 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold text-surface-900 capitalize tracking-tight">
              {currentView === AppView.OPTIMIZER ? 'Resume Tailor' : currentView === AppView.ATS_SCORER ? 'Resume Analysis' : currentView.replace('_', ' ').toLowerCase()}
             </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative scroll-smooth">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Sub-components for cleaner App.tsx
const NavItem = ({ icon, label, active, onClick, variant = 'default' }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
      ${active 
        ? variant === 'danger' ? 'bg-red-500 text-white shadow-lg' : 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
        : 'text-surface-400 hover:text-white hover:bg-surface-800'}
    `}
  >
    <span className={`relative z-10 ${active ? 'text-white' : 'text-surface-400 group-hover:text-white'}`}>{icon}</span>
    <span className="hidden md:block font-medium text-sm relative z-10">{label}</span>
    {active && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
  </button>
);

const Dashboard = ({ onViewChange }: { onViewChange: (view: AppView) => void }) => (
  <div className="max-w-6xl mx-auto">
    <div className="mb-12">
      <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight">Hello, Professional.</h2>
      <p className="text-surface-500 mt-2 text-lg">Your career acceleration toolkit is ready.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <DashboardCard 
        title="Resume Builder" 
        desc="Draft a perfectly formatted resume with smart AI suggestions."
        icon="📄"
        color="bg-blue-500"
        gradient="from-blue-500 to-blue-600"
        onClick={() => onViewChange(AppView.BUILDER)}
      />
      <DashboardCard 
        title="Resume Analysis" 
        desc="Detailed analysis on content, ATS, and job optimization."
        icon="📊"
        color="bg-violet-500"
        gradient="from-violet-500 to-violet-600"
        onClick={() => onViewChange(AppView.ATS_SCORER)}
      />
      <DashboardCard 
        title="Resume Tailor" 
        desc="Match your existing resume to a specific JD."
        icon="✂️"
        color="bg-fuchsia-500"
        gradient="from-fuchsia-500 to-fuchsia-600"
        onClick={() => onViewChange(AppView.OPTIMIZER)}
      />
      <DashboardCard 
        title="Cover Letter" 
        desc="Generate a persuasive cover letter tailored to a job."
        icon="📝"
        color="bg-indigo-500"
        gradient="from-indigo-500 to-indigo-600"
        onClick={() => onViewChange(AppView.COVER_LETTER)}
      />
    </div>

    <div className="mt-12">
      <h3 className="text-xl font-bold text-surface-800 mb-6">Quick Insights</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <TipCard 
           title="Keywords are King" 
           body="75% of resumes are rejected by ATS before a human sees them. Always tailor your keywords."
           icon="🔑"
        />
        <TipCard 
           title="Clean Formatting" 
           body="Avoid columns, graphics, and tables. Simple layouts parse 30% better on average."
           icon="✨"
        />
        <TipCard 
           title="Measurable Impact" 
           body="Don't just list duties. List achievements. 'Increased sales by 20%' wins interviews."
           icon="📈"
        />
      </div>
    </div>
  </div>
);

const DashboardCard = ({ title, desc, icon, gradient, onClick }: any) => (
  <button 
    onClick={onClick}
    className="group relative bg-white p-8 rounded-2xl shadow-soft border border-surface-200 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
    
    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="font-bold text-xl text-surface-900 mb-2 relative z-10">{title}</h3>
    <p className="text-sm text-surface-500 leading-relaxed relative z-10">{desc}</p>
    
    <div className="mt-6 flex items-center text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
      <span>Launch Tool</span>
      <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
    </div>
  </button>
);

const TipCard = ({ title, body, icon }: any) => (
    <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm flex gap-4">
        <div className="text-2xl bg-surface-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div>
            <span className="font-bold text-surface-800 block mb-1">{title}</span>
            <p className="text-sm text-surface-600 leading-relaxed">{body}</p>
        </div>
    </div>
)

export default App;