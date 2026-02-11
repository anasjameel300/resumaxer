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
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[10%] right-[20%] w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[20%] left-[30%] w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center animate-fade-in relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-surface-200 rounded-full px-4 py-1.5 shadow-sm mb-8 animate-bounce-slow hover:shadow-md transition-shadow cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-surface-600 uppercase tracking-wider">AI Model V2.0 Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-surface-900 mb-8 leading-[1.1]">
            Your Career <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">On Autopilot.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-surface-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Stop guessing. Our AI builds, scores, and tailors your resume to beat the algorithms and impress humans.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-surface-900 text-white rounded-full font-bold text-xl shadow-2xl shadow-surface-900/20 hover:bg-black transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
            >
              Build My Resume
              <span className="text-2xl">→</span>
            </button>
            <button 
               onClick={onStart}
               className="w-full sm:w-auto px-10 py-5 bg-white text-surface-900 border border-surface-200 rounded-full font-bold text-xl hover:bg-surface-50 transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🎯</span> Check ATS Score
            </button>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-surface-500 font-medium text-sm">
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                 <span>ATS Optimized</span>
             </div>
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                 <span>Keyword Targeting</span>
             </div>
             <div className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                 <span>Instant PDF</span>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12 border-y border-surface-100 bg-surface-50/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-8">Trusted by candidates hired at top companies</p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {['Google', 'Spotify', 'Amazon', 'Netflix', 'Airbnb', 'Microsoft'].map(brand => (
                      <span key={brand} className="text-2xl font-black text-surface-800">{brand}</span>
                  ))}
              </div>
          </div>
      </section>

      {/* Comparison Slider Section */}
      <section className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="w-full md:w-1/3">
                      <h2 className="text-4xl font-extrabold text-surface-900 mb-6">Don't Let Bad Formatting Kill Your Chances.</h2>
                      <p className="text-lg text-surface-600 mb-8 leading-relaxed">
                          Recruiters spend an average of 6 seconds scanning a resume. Our AI transforms messy, unreadable drafts into polished, professional documents that pass the ATS scan and catch the human eye.
                      </p>
                      <div className="space-y-4">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">✗</div>
                              <div className="text-surface-700"><strong>Before:</strong> Messy structure, typos, generic descriptions.</div>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                              <div className="text-surface-700"><strong>After:</strong> Clean layout, action verbs, quantified results.</div>
                          </div>
                      </div>
                  </div>

                  <div className="w-full md:w-2/3">
                      <div className="relative w-full h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-surface-200 select-none ring-1 ring-surface-900/5 group">
                          {/* Bad Resume (Underneath) */}
                          <div className="absolute inset-0 bg-gray-100 p-10 font-mono text-xs text-gray-500 overflow-hidden">
                              <div className="absolute inset-0 bg-red-500/5 z-0"></div>
                              <div className="relative z-10 opacity-70 blur-[0.5px]">
                                  <div className="mb-6">
                                      <div className="text-xl text-black font-bold">alex mercer</div>
                                      <div>email: alex_m_1990@yahoo.com</div>
                                      <div>phone: 555-987-6543</div>
                                  </div>
                                  
                                  <div className="mb-6">
                                      <div className="font-bold underline mb-2 text-black">Work:</div>
                                      <div className="mb-4">
                                          <div>Global Logistics Partners (2021-now)</div>
                                          <div>- Shift Supervisor</div>
                                          <div>- Managed the warehouse team.</div>
                                          <div>- Made sure things were safe.</div>
                                          <div>- Used SAP system.</div>
                                      </div>
                                      <div>
                                          <div>Walmart (2019-2021)</div>
                                          <div>- Inventory Guy</div>
                                          <div>- Counted stock and talked to vendors.</div>
                                          <div>- Good at organizing things.</div>
                                      </div>
                                  </div>

                                  <div className="mb-6">
                                      <div className="font-bold underline mb-2 text-black">Skills:</div>
                                      <div>Microsoft Office, Hard Worker, Team Player, Logistics, Forklift Certified.</div>
                                  </div>

                                  <div className="mb-6">
                                      <div className="font-bold underline mb-2 text-black">School:</div>
                                      <div>State University.</div>
                                  </div>

                                  <div className="p-4 border-4 border-red-500 rounded-lg text-red-600 font-black text-3xl uppercase inline-block transform -rotate-12 mt-4 opacity-50">
                                      REJECTED
                                  </div>
                              </div>
                          </div>

                          {/* Good Resume (Top Layer) */}
                          <div 
                            className="absolute inset-0 bg-white z-10 overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.1)]"
                            style={{ width: `${sliderValue}%` }}
                          >
                               <div className="w-full h-full min-w-[800px] bg-white p-10 font-sans text-surface-800 relative">
                                   {/* Professional Header */}
                                   <div className="flex justify-between items-start border-b-2 border-primary-600 pb-6 mb-6">
                                       <div>
                                           <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight uppercase">ALEX MERCER</h1>
                                           <div className="text-sm font-bold text-primary-600 uppercase tracking-widest mt-1">Senior Operations Manager</div>
                                       </div>
                                       <div className="text-right text-xs text-surface-600 font-medium leading-relaxed">
                                           alex.mercer@professional.com • (555) 987-6543<br/>
                                           New York, NY • linkedin.com/in/alexmercer
                                       </div>
                                   </div>
                                   
                                   <div className="space-y-6">
                                       {/* Summary */}
                                       <div>
                                           <h3 className="text-[10px] font-bold uppercase text-surface-400 tracking-widest mb-2 flex items-center gap-2">
                                               <span className="w-4 h-0.5 bg-primary-600"></span> Professional Summary
                                           </h3>
                                           <p className="text-xs leading-relaxed text-surface-700 text-justify">
                                               Results-oriented Operations Specialist with 5+ years of experience optimizing supply chain logistics and team performance. Proven track record of reducing overhead costs by <strong>15%</strong> while maintaining <strong>99.9%</strong> inventory accuracy. Certified in Lean Six Sigma with a focus on sustainable process improvement.
                                           </p>
                                       </div>

                                       {/* Experience */}
                                       <div>
                                           <h3 className="text-[10px] font-bold uppercase text-surface-400 tracking-widest mb-3 flex items-center gap-2">
                                               <span className="w-4 h-0.5 bg-primary-600"></span> Professional Experience
                                           </h3>
                                           
                                           <div className="mb-4">
                                               <div className="flex justify-between font-bold text-surface-900 text-sm">
                                                   <span>Logistics Shift Supervisor</span>
                                                   <span className="text-surface-500 text-xs font-medium">2021 - Present</span>
                                               </div>
                                               <div className="text-xs font-bold text-primary-700 uppercase mb-1">Global Logistics Partners</div>
                                               <ul className="text-xs list-disc ml-4 space-y-1.5 text-surface-600 leading-snug">
                                                   <li>Spearheaded a warehouse reorganization project that increased daily throughput by <span className="bg-green-100 text-green-700 px-1 rounded font-bold">25%</span> within 3 months.</li>
                                                   <li>Managed a cross-functional team of 15 associates, achieving the highest regional safety rating for 2 consecutive years.</li>
                                                   <li>Implemented a new inventory tracking system (SAP), reducing discrepancies to near-zero levels.</li>
                                               </ul>
                                           </div>

                                           <div>
                                               <div className="flex justify-between font-bold text-surface-900 text-sm">
                                                   <span>Inventory Control Specialist</span>
                                                   <span className="text-surface-500 text-xs font-medium">2019 - 2021</span>
                                               </div>
                                               <div className="text-xs font-bold text-primary-700 uppercase mb-1">Walmart Supply Chain</div>
                                               <ul className="text-xs list-disc ml-4 space-y-1.5 text-surface-600 leading-snug">
                                                   <li>Analyzed stock levels for 5 high-volume departments, optimizing reorder points to reduce waste by <span className="bg-green-100 text-green-700 px-1 rounded font-bold">$10k/quarter</span>.</li>
                                                   <li>Collaborated with vendors to streamline delivery schedules, improving on-time receiving by 20%.</li>
                                               </ul>
                                           </div>
                                       </div>

                                       {/* Skills */}
                                       <div>
                                            <h3 className="text-[10px] font-bold uppercase text-surface-400 tracking-widest mb-2 flex items-center gap-2">
                                               <span className="w-4 h-0.5 bg-primary-600"></span> Core Competencies
                                           </h3>
                                           <div className="flex flex-wrap gap-1.5">
                                               {['Supply Chain Management', 'SAP ERP', 'Team Leadership', 'Lean Six Sigma', 'Data Analysis (Excel/Tableau)', 'Vendor Relations'].map(s => (
                                                   <span key={s} className="bg-surface-100 text-surface-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-surface-200">{s}</span>
                                               ))}
                                           </div>
                                       </div>
                                   </div>
                                   
                                   {/* Score Badge */}
                                   <div className="absolute top-8 right-8 bg-white/95 backdrop-blur border border-green-100 text-green-700 px-4 py-2 rounded-xl shadow-xl flex flex-col items-center gap-0.5 animate-bounce-slow z-20">
                                       <span className="text-2xl font-black tracking-tighter">98</span>
                                       <span className="text-[8px] font-bold uppercase tracking-widest text-green-600">ATS Score</span>
                                   </div>
                               </div>
                          </div>

                          {/* Slider Handle */}
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-primary-600 cursor-ew-resize z-20 group-hover:bg-primary-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                            style={{ left: `${sliderValue}%` }}
                          >
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-primary-600 flex items-center justify-center text-primary-600 text-sm">
                                  ↔
                              </div>
                          </div>
                          
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

      {/* Testimonials */}
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