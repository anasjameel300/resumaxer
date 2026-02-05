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
                {/* Animated background blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-100/50 to-primary-100/30 rounded-full blur-3xl -z-10 opacity-60 animate-pulse"></div>
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-bl from-purple-100/40 to-pink-100/30 rounded-full blur-3xl -z-10 opacity-50"></div>

                <div className="max-w-5xl mx-auto text-center animate-fade-in">

                    <div className="inline-flex items-center gap-2 bg-white border border-surface-200 rounded-full px-4 py-1.5 shadow-sm mb-8 animate-bounce-slow">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">🎉 V2.0 Now Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-surface-900 mb-8 leading-[1.1]">
                        Build a Resume That <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">Actually Gets Read.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-surface-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing what recruiters want. Use our intelligent suite to build, score, and tailor your resume for maximum impact in minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all transform hover:-translate-y-1 hover:scale-105"
                        >
                            Build My Resume Now
                        </button>
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-surface-700 border border-surface-200 rounded-full font-bold text-lg hover:bg-surface-50 transition-all hover:shadow-md"
                        >
                            Check My ATS Score
                        </button>
                    </div>

                    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-surface-400 opacity-70">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-semibold text-sm text-surface-600">95+ ATS Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-semibold text-sm text-surface-600">Real-time Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-semibold text-sm text-surface-600">Instant PDF Download</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Logos */}
            <section className="py-12 border-y border-surface-100 bg-surface-50/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-8">Trusted by candidates hired at</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Spotify', 'Amazon', 'Netflix', 'Airbnb', 'Microsoft'].map(brand => (
                            <span key={brand} className="text-xl font-black text-surface-800">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Signal: Before/After Slider (IMPROVED) */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-surface-900 mb-4">See the Difference AI Makes</h2>
                    <p className="text-surface-600 mb-12 max-w-2xl mx-auto">Drag the slider to see how we transform a messy, unreadable draft into a professional, ATS-optimized resume that passes the 6-second scan.</p>

                    <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-surface-200 select-none ring-8 ring-surface-50">

                        {/* Bad Resume (Bottom Layer - Visible on Left) */}
                        <div className="absolute inset-0 p-10 text-left bg-gray-50 font-mono text-sm leading-relaxed text-gray-600">
                            <div className="absolute top-4 left-4 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200 z-10">BEFORE</div>

                            <div className="mb-8">
                                <div className="text-xl font-bold text-black mb-1">john doe</div>
                                <div>email: coolguy_john@email.com | 1234567890</div>
                                <div>Address: New York</div>
                            </div>

                            <div className="mb-6">
                                <div className="font-bold underline mb-2">Work Exp.</div>
                                <p className="mb-2">
                                    <span className="bg-red-100 text-red-800 px-1 rounded" title="Vague">Worked at retail store</span> (2020-2022). I sold clothes to people and helped with <span className="bg-red-100 text-red-800 px-1 rounded" title="Spelling error">invantory</span>. It was a good job and I learned a lot about talking to customers.
                                </p>
                                <p>
                                    Waiter (2018-2020). <span className="bg-red-100 text-red-800 px-1 rounded" title="Passive voice">Food was served by me</span>. I was on time always.
                                </p>
                            </div>

                            <div className="mb-6">
                                <div className="font-bold underline mb-2">Skills</div>
                                <div>computers, microsoft word, excel, internet, hard worker, fast learner, motivated.</div>
                            </div>

                            <div className="mb-6">
                                <div className="font-bold underline mb-2">Education</div>
                                <div>High School Diploma.</div>
                            </div>

                            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-red-500 text-red-500 font-black text-5xl p-4 rounded-xl opacity-30">
                                REJECTED
                            </div>
                        </div>

                        {/* Good Resume (Top Layer - Masked - Visible on Right) */}
                        <div
                            className="absolute inset-0 bg-white z-10 overflow-hidden"
                            style={{ width: `${sliderValue}%` }}
                        >
                            <div className="w-[896px] h-full p-10 text-left bg-white relative">
                                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">AFTER (Resumaxer)</div>

                                <div className="flex justify-between items-start border-b-2 border-primary-600 pb-6 mb-8">
                                    <div>
                                        <h1 className="text-4xl font-extrabold text-surface-900 tracking-tight">JOHN DOE</h1>
                                        <div className="text-sm font-bold text-primary-600 uppercase tracking-widest mt-2">Retail Sales Manager</div>
                                    </div>
                                    <div className="text-right text-xs text-surface-500 font-medium leading-loose">
                                        john.doe@professional.com • (555) 123-4567<br />
                                        New York, NY • linkedin.com/in/johndoe
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-surface-400 tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-8 h-0.5 bg-primary-600"></span> Professional Summary
                                        </h3>
                                        <p className="text-sm leading-relaxed text-surface-700 text-justify">
                                            Results-driven Retail Manager with 4+ years of experience optimizing store operations and leading cross-functional teams. Proven track record of increasing revenue by 20% YoY through strategic upselling and inventory management.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-surface-400 tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-0.5 bg-primary-600"></span> Experience
                                        </h3>
                                        <div className="mb-4">
                                            <div className="flex justify-between font-bold text-surface-900">
                                                <span>Senior Sales Associate</span>
                                                <span className="text-sm font-medium text-surface-500">Jan 2020 - Dec 2022</span>
                                            </div>
                                            <div className="text-xs font-bold text-primary-600 uppercase mb-2">Zara Fashion, New York</div>
                                            <ul className="text-sm list-disc ml-4 space-y-1.5 text-surface-600">
                                                <li><span className="font-semibold text-emerald-600">Spearheaded</span> a new sales initiative that increased monthly revenue by <span className="bg-emerald-50 text-emerald-700 px-1 rounded font-bold">15%</span>.</li>
                                                <li>Managed inventory of 5,000+ units with <span className="font-bold text-surface-800">99% accuracy</span> using CRM software.</li>
                                                <li>Mentored 10+ junior staff members, improving team efficiency ratings by 25%.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-surface-400 tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-8 h-0.5 bg-primary-600"></span> Core Competencies
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['Inventory Management', 'CRM Software (Salesforce)', 'Team Leadership', 'Sales Strategy', 'Conflict Resolution'].map(s => (
                                                <span key={s} className="bg-surface-50 text-surface-700 px-3 py-1 rounded-md text-xs font-bold border border-surface-200">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-20 right-10 transform rotate-12 bg-white/90 backdrop-blur border border-emerald-100 text-emerald-700 px-6 py-4 rounded-xl shadow-xl font-bold flex flex-col items-center gap-1 z-20">
                                    <span className="text-3xl">95</span>
                                    <span className="text-[10px] uppercase tracking-widest">ATS Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Slider Control Line */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-primary-600 cursor-ew-resize z-20 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-primary-600 flex items-center justify-center text-primary-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" /></svg>
                            </div>
                        </div>

                        {/* Input Range Overlay */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                        />
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-surface-50 border-y border-surface-200">
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

            {/* Testimonials (NEW) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-surface-900 mb-4">Success Stories</h2>
                        <p className="text-surface-600">Join thousands of professionals who landed their dream jobs.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            text="I applied to 50 jobs with no response. After using the ATS Scorer and fixing my keywords, I got 3 interviews in a week."
                            name="Sarah Jenkins"
                            role="Product Manager"
                            company="TechCorp"
                        />
                        <TestimonialCard
                            text="The Resume Tailor feature is magic. It rewrote my generic bullets to match the JD perfectly. Saved me hours."
                            name="David Chen"
                            role="Software Engineer"
                            company="Startup Inc"
                        />
                        <TestimonialCard
                            text="I used the 'Roast My Resume' feature for fun, but it actually gave me the most honest feedback I've ever received."
                            name="Emily Rodriguez"
                            role="Marketing Director"
                            company="Global Media"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-surface-50 border-t border-surface-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-surface-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-surface-600">Start for free. Upgrade when you're ready to get serious.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
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
                        <div className="bg-surface-900 p-8 rounded-3xl border border-surface-800 shadow-xl flex flex-col relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
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
            <footer className="bg-white py-12 border-t border-surface-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-surface-900 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                                <span className="font-bold text-surface-900 text-lg">Resumaxer</span>
                            </div>
                            <p className="text-sm text-surface-500 leading-relaxed">
                                The all-in-one AI career toolkit designed to help you land your dream job faster.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-surface-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-surface-500">
                                <li><button onClick={onStart} className="hover:text-primary-600">Resume Builder</button></li>
                                <li><button onClick={onStart} className="hover:text-primary-600">Templates</button></li>
                                <li><button onClick={onStart} className="hover:text-primary-600">Cover Letter</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-surface-900 mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-surface-500">
                                <li><button onClick={onStart} className="hover:text-primary-600">Career Blog</button></li>
                                <li><button onClick={onStart} className="hover:text-primary-600">ATS Guide</button></li>
                                <li><button onClick={onStart} className="hover:text-primary-600">Interview Prep</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-surface-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-surface-500">
                                <li><button onClick={onStart} className="hover:text-primary-600">Privacy Policy</button></li>
                                <li><button onClick={onStart} className="hover:text-primary-600">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-surface-500">
                        <div>© {new Date().getFullYear()} Resumaxer Inc. All rights reserved.</div>
                        <div className="flex gap-6">
                            <span>Made with ❤️ for Job Seekers</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-soft border border-surface-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="w-14 h-14 bg-surface-50 rounded-xl flex items-center justify-center text-3xl mb-6 border border-surface-100 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-surface-900 mb-3">{title}</h3>
        <p className="text-surface-600 leading-relaxed text-sm">
            {desc}
        </p>
    </div>
);

const TestimonialCard = ({ text, name, role, company }: { text: string, name: string, role: string, company: string }) => (
    <div className="bg-surface-50 p-8 rounded-2xl border border-surface-100 relative">
        <div className="text-4xl text-primary-200 absolute top-4 left-6">"</div>
        <p className="text-surface-700 italic mb-6 relative z-10">{text}</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-surface-900 text-sm">{name}</div>
                <div className="text-xs text-surface-500">{role} at {company}</div>
            </div>
        </div>
    </div>
);

export default LandingPage;