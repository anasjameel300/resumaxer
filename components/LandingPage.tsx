import React, { useState } from 'react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [sliderValue, setSliderValue] = useState(50);

    return (
        <div className="min-h-screen bg-white text-surface-900 font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-surface-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                            R
                        </div>
                        <span className="text-xl font-bold tracking-tight text-surface-900">Resumaxer</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onStart}
                            className="hidden md:block text-surface-600 font-medium hover:text-primary-600 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onStart}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-100/50 to-primary-100/30 rounded-full blur-3xl -z-10 opacity-60"></div>

                <div className="max-w-5xl mx-auto text-center animate-fade-in">

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-surface-900 mb-8 leading-[1.1]">
                        Build a Resume That <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Actually Gets Read.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-surface-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing what recruiters want. Use our intelligent suite to build, score, and tailor your resume for maximum impact in minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all transform hover:-translate-y-1"
                        >
                            Build My Resume Now
                        </button>
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-surface-700 border border-surface-200 rounded-full font-bold text-lg hover:bg-surface-50 transition-all"
                        >
                            Check My ATS Score
                        </button>
                    </div>
                </div>
            </section>

            {/* Trust Signal: Before/After Slider */}
            <section className="py-20 bg-surface-50 border-y border-surface-200">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-surface-900 mb-4">See the Difference AI Makes</h2>
                    <p className="text-surface-600 mb-10">Drag the slider to see how we transform a messy draft into a professional, ATS-optimized resume.</p>

                    <div className="relative w-full max-w-3xl mx-auto h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-surface-200 select-none">
                        {/* Bad Resume (Bottom Layer) */}
                        <div className="absolute inset-0 p-8 text-left bg-gray-50 text-gray-400 font-mono text-xs overflow-hidden leading-relaxed opacity-50">
                            <div className="mb-4">JOHN DOE<br />john@email.com<br />NY</div>
                            <div className="mb-4">SKILLS: computers, excel, talking to people, hard worker</div>
                            <div className="mb-4">EXPERIENCE:<br />Worked at store (2020-2022). Sold clothes to people. It was good.<br />Waiter (2018-2020). Served food.</div>
                            <div className="mb-4">EDUCATION:<br />High School</div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 text-6xl font-black text-red-500/20 border-4 border-red-500/20 p-4 rounded-xl">
                                REJECTED
                            </div>
                        </div>

                        {/* Good Resume (Top Layer - Masked) */}
                        <div
                            className="absolute inset-0 bg-white z-10 overflow-hidden border-r-4 border-primary-500"
                            style={{ width: `${sliderValue}%` }}
                        >
                            <div className="w-[768px] p-8 text-left">
                                <div className="flex justify-between items-start border-b-2 border-primary-600 pb-4 mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-surface-900">JOHN DOE</h1>
                                        <div className="text-sm text-primary-600 font-bold mt-1">RETAIL SALES MANAGER</div>
                                    </div>
                                    <div className="text-right text-xs text-surface-500 font-medium">
                                        john.doe@example.com • New York, NY • (555) 123-4567
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-primary-600 tracking-widest mb-2 border-b border-surface-100 pb-1">Professional Summary</h3>
                                        <p className="text-xs leading-relaxed text-surface-700">Results-driven Retail Manager with 4+ years of experience optimizing store operations and leading teams to exceed sales targets by 20%...</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-primary-600 tracking-widest mb-2 border-b border-surface-100 pb-1">Experience</h3>
                                        <div className="mb-3">
                                            <div className="flex justify-between font-bold text-sm text-surface-900"><span>Senior Sales Associate</span><span>2020 - 2022</span></div>
                                            <div className="text-xs italic text-surface-500 mb-1">Zara Fashion, NY</div>
                                            <ul className="text-xs list-disc ml-4 space-y-1 text-surface-600">
                                                <li>Increased monthly revenue by 15% through strategic upselling.</li>
                                                <li>Managed inventory of 5,000+ units with 99% accuracy.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-primary-600 tracking-widest mb-2 border-b border-surface-100 pb-1">Skills</h3>
                                        <div className="flex gap-2">
                                            {['Inventory Management', 'CRM Software', 'Team Leadership', 'Sales Strategy'].map(s => (
                                                <span key={s} className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-[10px] font-bold">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-10 right-10 transform rotate-12 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2">
                                    <span>✨</span> ATS Score: 95/100
                                </div>
                            </div>
                        </div>

                        {/* Slider Control */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                        />

                        {/* Slider Handle Visual */}
                        <div
                            className="absolute top-0 bottom-0 w-10 bg-transparent flex items-center justify-center pointer-events-none z-20"
                            style={{ left: `calc(${sliderValue}% - 20px)` }}
                        >
                            <div className="w-10 h-10 bg-primary-600 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer border-4 border-white">
                                ↔
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-surface-400 mt-2 max-w-3xl mx-auto uppercase tracking-widest">
                        <span>Before (Messy)</span>
                        <span>After (Optimized)</span>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-surface-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-surface-900 mb-4">Everything You Need to Get Hired</h2>
                        <p className="text-surface-600 max-w-2xl mx-auto">We don't just format text. We analyze, optimize, and strategize your career path.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon="📄"
                            title="Smart Builder"
                            desc="Create professional resumes using 9+ ATS-compliant templates. No design skills needed."
                        />
                        <FeatureCard
                            icon="🎯"
                            title="ATS Scorer"
                            desc="Get a detailed score out of 100. Find out exactly what's holding your resume back."
                        />
                        <FeatureCard
                            icon="✂️"
                            title="Resume Tailor"
                            desc="Paste a Job Description and let AI rewrite your bullets to match the keywords perfectly."
                        />
                        <FeatureCard
                            icon="🗺️"
                            title="Career Roadmap"
                            desc="Not sure what to learn next? Generate a step-by-step plan to reach your dream role."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-white border-y border-surface-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-surface-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-surface-600">Start for free. Upgrade when you're ready to get serious.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-surface-500 uppercase tracking-wider mb-2">Starter</h3>
                                <div className="text-5xl font-extrabold text-surface-900">$0<span className="text-lg font-medium text-surface-400">/mo</span></div>
                                <p className="text-surface-500 mt-4">Essential tools to build a clean resume.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-surface-700 text-sm">
                                    <span className="text-green-500">✓</span> <span>Manual Resume Builder</span>
                                </li>
                                <li className="flex items-center gap-3 text-surface-700 text-sm">
                                    <span className="text-green-500">✓</span> <span>Standard PDF Export</span>
                                </li>
                                <li className="flex items-center gap-3 text-surface-700 text-sm">
                                    <span className="text-green-500">✓</span> <span>3 Basic Templates</span>
                                </li>
                            </ul>
                            <button
                                onClick={onStart}
                                className="w-full py-4 bg-surface-100 text-surface-900 font-bold rounded-xl hover:bg-surface-200 transition-colors"
                            >
                                Start Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-surface-900 p-8 rounded-3xl border border-surface-800 shadow-xl flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                                RECOMMENDED
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-primary-400 uppercase tracking-wider mb-2">Pro Suite</h3>
                                <div className="flex items-baseline gap-2">
                                    <div className="text-5xl font-extrabold text-white">$0<span className="text-lg font-medium text-surface-400">/mo</span></div>
                                    <span className="text-xs text-primary-200 bg-primary-900/50 px-2 py-1 rounded-full border border-primary-700/50">Free during Beta</span>
                                </div>
                                <p className="text-surface-400 mt-4">Full AI power to accelerate your career.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-white text-sm">
                                    <span className="text-primary-400">✓</span> <span><strong>AI Resume Wizard</strong></span>
                                </li>
                                <li className="flex items-center gap-3 text-white text-sm">
                                    <span className="text-primary-400">✓</span> <span><strong>ATS Score Analysis</strong></span>
                                </li>
                                <li className="flex items-center gap-3 text-white text-sm">
                                    <span className="text-primary-400">✓</span> <span><strong>Job Application Tracker</strong></span>
                                </li>
                                <li className="flex items-center gap-3 text-white text-sm">
                                    <span className="text-primary-400">✓</span> <span>Resume Tailor</span>
                                </li>
                            </ul>
                            <button
                                onClick={onStart}
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:from-primary-500 hover:to-indigo-500 transition-all shadow-lg shadow-primary-900/50"
                            >
                                Get Pro Access Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface-50 py-12 border-t border-surface-200">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-surface-200 rounded-lg flex items-center justify-center text-surface-600 font-bold">R</div>
                        <span className="font-bold text-surface-700">Resumaxer</span>
                    </div>
                    <div className="text-sm text-surface-500">
                        © {new Date().getFullYear()} Resumaxer. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-soft border border-surface-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-surface-50 rounded-xl flex items-center justify-center text-3xl mb-6 border border-surface-100">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-surface-900 mb-3">{title}</h3>
        <p className="text-surface-600 leading-relaxed text-sm">
            {desc}
        </p>
    </div>
);

export default LandingPage;