import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
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

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-surface-400 grayscale opacity-70">
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                 <span className="font-semibold text-sm text-surface-600">ATS Compliant</span>
             </div>
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                 <span className="font-semibold text-sm text-surface-600">Real-time Analysis</span>
             </div>
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                 <span className="font-semibold text-sm text-surface-600">Instant PDF Download</span>
             </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="bg-surface-50 rounded-3xl p-8 border border-surface-200">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="space-y-4 font-mono text-sm opacity-70">
                          <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                          <div className="h-4 bg-surface-200 rounded w-full"></div>
                          <div className="h-4 bg-surface-200 rounded w-5/6"></div>
                          <div className="h-32 bg-red-50 border-2 border-red-100 rounded-lg flex items-center justify-center text-red-400 font-sans font-bold">
                              REJECTED BY ATS
                          </div>
                      </div>
                  </div>
                  <div>
                      <h2 className="text-3xl font-bold text-surface-900 mb-4">75% of resumes are never seen by a human.</h2>
                      <p className="text-lg text-surface-600 mb-6 leading-relaxed">
                          Traditional text editors create messy code that Applicant Tracking Systems (ATS) can't read. If the robot can't read your skills, the recruiter never sees your application.
                      </p>
                      <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-surface-700">
                              <span className="text-green-500 text-xl">✓</span>
                              <span>Clean, parseable structure</span>
                          </li>
                          <li className="flex items-center gap-3 text-surface-700">
                              <span className="text-green-500 text-xl">✓</span>
                              <span>Keyword optimization for specific jobs</span>
                          </li>
                          <li className="flex items-center gap-3 text-surface-700">
                              <span className="text-green-500 text-xl">✓</span>
                              <span>Standardized formatting that recruiters love</span>
                          </li>
                      </ul>
                  </div>
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

      {/* How It Works */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-surface-900 mb-4">How It Works</h2>
                  <p className="text-surface-500">Three simple steps to your next interview.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                   {/* Connector Line (Desktop) */}
                   <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-surface-100 -z-10"></div>
                   
                   <div className="text-center">
                       <div className="w-24 h-24 bg-white border-2 border-surface-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm mx-auto mb-6 z-10 relative">
                           📝
                       </div>
                       <h3 className="font-bold text-xl mb-2">1. Input Your Data</h3>
                       <p className="text-surface-500 text-sm leading-relaxed px-4">
                           Import from an existing PDF or use our AI Wizard to draft your experience from scratch.
                       </p>
                   </div>
                   <div className="text-center">
                       <div className="w-24 h-24 bg-white border-2 border-primary-100 rounded-2xl flex items-center justify-center text-4xl shadow-glow mx-auto mb-6 z-10 relative">
                           ✨
                       </div>
                       <h3 className="font-bold text-xl mb-2">2. Optimize & Tailor</h3>
                       <p className="text-surface-500 text-sm leading-relaxed px-4">
                           Use the Scorer to fix errors and the Tailor to match your resume to the specific job description.
                       </p>
                   </div>
                   <div className="text-center">
                       <div className="w-24 h-24 bg-white border-2 border-surface-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm mx-auto mb-6 z-10 relative">
                           🚀
                       </div>
                       <h3 className="font-bold text-xl mb-2">3. Download & Apply</h3>
                       <p className="text-surface-500 text-sm leading-relaxed px-4">
                           Export perfectly formatted PDFs or generate a LaTeX source file for deeper customization.
                       </p>
                   </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-surface-50 border-y border-surface-200">
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
                          <li className="flex items-center gap-3 text-surface-700 text-sm">
                              <span className="text-green-500">✓</span> <span>Basic Preview</span>
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
                              <span className="text-primary-400">✓</span> <span><strong>AI Resume Wizard</strong> (Auto-Write)</span>
                          </li>
                          <li className="flex items-center gap-3 text-white text-sm">
                              <span className="text-primary-400">✓</span> <span><strong>ATS Score Analysis</strong> & Reporting</span>
                          </li>
                          <li className="flex items-center gap-3 text-white text-sm">
                              <span className="text-primary-400">✓</span> <span><strong>Resume Tailor</strong> (Match JDs)</span>
                          </li>
                          <li className="flex items-center gap-3 text-white text-sm">
                              <span className="text-primary-400">✓</span> <span>Career Roadmap Generator</span>
                          </li>
                          <li className="flex items-center gap-3 text-white text-sm">
                              <span className="text-primary-400">✓</span> <span>Unlimited Cover Letters</span>
                          </li>
                          <li className="flex items-center gap-3 text-white text-sm">
                              <span className="text-primary-400">✓</span> <span>Access to All 9 Templates</span>
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

      {/* Roast Section (Fun) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    Fan Favorite
                </div>
                <h2 className="text-4xl font-extrabold text-surface-900 mb-6">Roast My Resume 🔥</h2>
                <p className="text-lg text-surface-600 mb-8 leading-relaxed">
                    Need a reality check? Our "Roast" feature simulates tough recruiters (or savage CEOs) to give you brutally honest feedback. It's fun, it hurts a little, but it works.
                </p>
                <button 
                  onClick={onStart}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1"
                >
                    Try the Roast
                </button>
            </div>
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-red-50 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
                <div className="relative bg-surface-900 text-white p-8 rounded-3xl shadow-2xl transform -rotate-1 border border-surface-700">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-xl">🚀</div>
                         <div>
                             <div className="font-bold">Savage CEO</div>
                             <div className="text-xs text-surface-400">Just now</div>
                         </div>
                    </div>
                    <p className="font-mono text-sm leading-relaxed opacity-90">
                        "**First Impression:** Is this a resume or a sleeping pill? You used the word 'motivated' three times. If you were actually motivated, you would have quantified your achievements. **The Verdict:** Rewrite it. Use numbers. Stop boring me."
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface-50 border-t border-surface-200">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-surface-900 mb-4">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-6">
                  <FAQItem 
                      question="Is my data safe?" 
                      answer="Yes. We process your data to generate the resume and it is stored locally in your browser session. We do not sell your personal information." 
                  />
                  <FAQItem 
                      question="What is an ATS?" 
                      answer="ATS stands for Applicant Tracking System. It's software that recruiters use to filter resumes before reading them. If your resume isn't formatted correctly, the ATS might reject it instantly." 
                  />
                  <FAQItem 
                      question="Can I download my resume in Word format?" 
                      answer="Currently, we support PDF and LaTeX exports. PDF is the industry standard for ensuring your formatting stays perfect across all devices." 
                  />
                   <FAQItem 
                      question="Is the 'Roast' feature really mean?" 
                      answer="It can be! You can select different personas. The 'Friendly' persona is nice, but the 'Savage CEO' pulls no punches. It's designed to give you the honest feedback friends won't give you." 
                  />
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

const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
    <div className="bg-white p-6 rounded-xl border border-surface-200 hover:border-primary-200 transition-colors">
        <h3 className="font-bold text-surface-900 mb-2 text-lg">{question}</h3>
        <p className="text-surface-600 leading-relaxed text-sm">{answer}</p>
    </div>
);

export default LandingPage;