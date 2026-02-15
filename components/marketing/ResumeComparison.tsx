"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle2, MousePointer2, ScanLine, Briefcase, GraduationCap, Code2, Globe, Linkedin, Github, ExternalLink, Award, ShieldCheck, TrendingUp } from "lucide-react";

export const ResumeComparison = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const maskedRef = useRef<HTMLDivElement>(null); // Ref for the masked element

    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Mouse Position State
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for the lens movement
    const lensX = useSpring(mouseX, { stiffness: 400, damping: 30 });
    const lensY = useSpring(mouseY, { stiffness: 400, damping: 30 });

    useEffect(() => {
        setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);

        let controls: number;

        const startAutoScan = () => {
            if (isHovering || !containerRef.current) return;

            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;

            const time = Date.now() / 2000;
            const x = (Math.sin(time) + 1) * 0.5 * width;
            const y = (Math.cos(time * 0.7) + 1) * 0.5 * height;

            mouseX.set(x);
            mouseY.set(y);

            controls = requestAnimationFrame(startAutoScan);
        };

        if (!isHovering) {
            controls = requestAnimationFrame(startAutoScan);
        }

        return () => cancelAnimationFrame(controls);
    }, [isHovering, mouseX, mouseY]);

    // Optimize the mask update loop
    useEffect(() => {
        const updateMask = () => {
            if (maskedRef.current) {
                const x = lensX.get();
                const y = lensY.get();
                maskedRef.current.style.setProperty("--x", `${x}px`);
                maskedRef.current.style.setProperty("--y", `${y}px`);
            }
            requestAnimationFrame(updateMask);
        };
        const animationId = requestAnimationFrame(updateMask);
        return () => cancelAnimationFrame(animationId);
    }, [lensX, lensY]);


    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(clientX - rect.left);
        mouseY.set(clientY - rect.top);
        setIsHovering(true);
    }, [mouseX, mouseY]);

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <section id="comparison" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-8 items-center text-center mb-16">
                    <div className="space-y-6 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider">
                            <ScanLine className="w-3 h-3" />
                            Recruiter Vision
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight tracking-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Reality Lens.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                            Recruiters scan resumes in <span className="text-foreground font-semibold">6 seconds</span>. Hover to reveal how a Resumaxer resume cuts through the noise.
                        </p>
                    </div>
                </div>

                {/* Comparison Component */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchEnd={handleMouseLeave}
                    className="w-full max-w-3xl mx-auto relative aspect-[210/297] rounded-3xl border border-white/10 shadow-2xl overflow-hidden group select-none bg-zinc-950 cursor-crosshair transform transition-transform duration-500 hover:scale-[1.005]"
                >

                    {/* ------------------------------------------------------------ */}
                    {/* LAYER 1: THE "BAD" RESUME (Hidden/Messy/Chaos)               */}
                    {/* ------------------------------------------------------------ */}
                    <div className="absolute inset-0 bg-white p-6 md:p-12 font-serif text-zinc-900 overflow-hidden filter blur-[1px] opacity-50 grayscale-[20%]">
                        <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none mix-blend-multiply" />

                        {/* Chaos Header */}
                        <div className="text-center border-b-2 border-black pb-4 mb-4">
                            <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Johnathan Doe</h1>
                            <p className="text-[10px] mt-2">123 Street Address • Apt 4B • City, State 12345 • john.doe.super.long.email@provider.com • (555) 012-3456</p>
                            <p className="text-[10px] italic mt-1 w-3/4 mx-auto">"Objective: Seeking a challenging position to utilize my skills in a growth-oriented company where I can add value"</p>
                        </div>

                        {/* Wall of Text */}
                        <div className="columns-1 md:columns-2 gap-6 text-[9px] leading-tight text-justify space-y-4 opacity-70">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="mb-2">
                                    <h4 className="font-bold underline mb-0.5">Role Description & Duties:</h4>
                                    <p className="mb-1">
                                        Responsible for synergistic alignment of cross-functional paradigms to leverage low-hanging fruit.
                                        Proactively envisioned multimedia based expertise and cross-media growth strategies.
                                        Seamlessly visualized quality intellectual capital without superior collaboration and idea-sharing.
                                        Holistically pontificated installed base portals after maintainable products.
                                    </p>
                                    <p>
                                        Phosfluorescently engaged worldwide methodologies with web-enabled technology.
                                        Interactively coordinated proactive e-commerce via process-centric "outside the box" thinking.
                                        Completely pursued scalable customer service through sustainable potentialities.
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Red Flags (Decorative) */}
                        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 border-4 border-red-600/30 text-red-600/30 font-black text-4xl uppercase p-4 -rotate-12">
                            CLUTTERED
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 border-4 border-red-600/30 text-red-600/30 font-black text-4xl uppercase p-4 rotate-6">
                            UNREADABLE
                        </div>
                    </div>


                    {/* ------------------------------------------------------------ */}
                    {/* LAYER 2: THE "GOOD" RESUME (Revealed via Mask)              */}
                    {/* ------------------------------------------------------------ */}
                    <motion.div
                        ref={maskedRef}
                        className="absolute inset-0 bg-zinc-200 z-20 overflow-hidden" // Slight off-white background for paper feel
                        style={{
                            maskImage: "radial-gradient(circle 220px at var(--x, 50%) var(--y, 50%), black 100%, transparent 100%)",
                            WebkitMaskImage: "radial-gradient(circle 220px at var(--x, 50%) var(--y, 50%), black 100%, transparent 100%)",
                        }}
                    >
                        {/* Content Container - WHITE PAPER LOOK */}
                        <div className="absolute inset-0 bg-white font-sans text-slate-800 shadow-inner flex">

                            {/* Paper Grain/Texture (Subtle) */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] pointer-events-none" />

                            {/* Left Accent Bar */}
                            <div className="w-1.5 bg-gradient-to-b from-indigo-500 via-indigo-600 to-purple-600 shrink-0" />

                            {/* Main Content */}
                            <div className="flex-1 p-5 md:p-7 overflow-hidden">

                                {/* Header */}
                                <div className="border-b border-slate-200 pb-3 mb-4 flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-0.5">John Doe</h1>
                                        <p className="text-sm font-semibold text-indigo-600">Senior Full Stack Engineer</p>
                                        <div className="flex items-center gap-3 mt-2.5">
                                            <span className="flex items-center gap-1 text-[10px] text-slate-500"><Globe className="w-3 h-3" />San Francisco, CA</span>
                                            <span className="flex items-center gap-1 text-[10px] text-indigo-600 font-medium"><Linkedin className="w-3 h-3" />linkedin.com/in/johndoe</span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-600 font-medium"><Github className="w-3 h-3" />github.com/johndoe</span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-600 font-medium"><ExternalLink className="w-3 h-3" />johndoe.dev</span>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-slate-500 space-y-0.5 shrink-0">
                                        <p>john@example.com</p>
                                        <p>(555) 123-4567</p>
                                    </div>
                                </div>

                                {/* Professional Summary */}
                                <div className="mb-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-1">Professional Summary</h3>
                                    <p className="text-[10px] text-slate-700 leading-relaxed">
                                        Results-oriented software architect with <span className="font-bold text-slate-900">7+ years</span> building high-scale distributed systems serving <span className="font-bold text-slate-900">5M+ DAU</span>.
                                        Reduced infrastructure costs by <span className="font-bold text-slate-900">40%</span> at TechFlow while leading a cross-functional team of 8.
                                        Expert in React ecosystem, Node.js microservices, and AWS cloud architecture. Passionate about developer experience and system reliability.
                                    </p>
                                </div>

                                {/* Projects Section - New addition to fill space */}
                                <div className="mb-3 space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-1">Key Projects</h3>

                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900 text-xs">E-Commerce Platform Rebrand</h4>
                                            <span className="text-[10px] font-semibold text-indigo-600">React, Node.js, Stripe</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-700 mt-0.5">
                                            <li>Led frontend overhaul effectively increasing conversion rate by <span className="font-bold text-slate-900">15%</span> within 3 months post-launch.</li>
                                            <li>Implemented secure payment gateway processing <span className="font-bold text-slate-900">$50k+</span> monthly transactions with 0% downtime.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900 text-xs">Real-Time Analytics Dashboard</h4>
                                            <span className="text-[10px] font-semibold text-indigo-600">Vue.js, Firebase, D3.js</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-700 mt-0.5">
                                            <li>Built interactive data visualization tools used by <span className="font-bold text-slate-900">200+</span> internal stakeholders for daily reporting.</li>
                                            <li>Optimized data fetching logic, reducing load times by <span className="font-bold text-slate-900">40%</span> for large datasets.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div className="mb-3 space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-1">Experience</h3>

                                    {/* Role 1 */}
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900 text-xs">Senior Tech Lead</h4>
                                            <span className="text-[10px] font-mono text-slate-400">Jan 2023 — Present</span>
                                        </div>
                                        <div className="text-[10px] font-semibold text-indigo-600 mb-1">TechFlow Systems · San Francisco, CA</div>
                                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-700">
                                            <li>Architected micro-frontend migration serving <span className="font-bold text-slate-900">5M+ users</span>, increasing deployment velocity by <span className="font-bold text-slate-900">300%</span> and reducing release cycles from 2 weeks to 2 days.</li>
                                            <li>Led a team of 8 engineers to deliver a payments overhaul processing <span className="font-bold text-slate-900">$12M+ annually</span>, achieving PCI-DSS compliance ahead of schedule.</li>
                                            <li>Designed and implemented CI/CD pipeline with automated E2E testing, reducing production bug reports by <span className="font-bold text-slate-900">65%</span> and saving <span className="font-bold text-slate-900">$180K/year</span> in QA costs.</li>
                                        </ul>
                                    </div>

                                    {/* Role 2 */}
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900 text-xs">Senior Frontend Developer</h4>
                                            <span className="text-[10px] font-mono text-slate-400">Mar 2020 — Dec 2022</span>
                                        </div>
                                        <div className="text-[10px] font-semibold text-indigo-600 mb-1">DataViz Corp · Remote</div>
                                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-700">
                                            <li>Optimized real-time dashboard rendering pipeline, boosting frame rates from 24fps to <span className="font-bold text-slate-900">60fps</span> and increasing user engagement by <span className="font-bold text-slate-900">22%</span>.</li>
                                            <li>Built a shared component library adopted across <span className="font-bold text-slate-900">12 product lines</span>, reducing UI development time by <span className="font-bold text-slate-900">40%</span>.</li>
                                            <li>Mentored 4 junior developers through structured code reviews, resulting in <span className="font-bold text-slate-900">100%</span> promotion rate within 18 months.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Bottom Grid: Skills + Education + Certs */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        {/* Skills - Categorized */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Technical Skills</h3>
                                            <div className="space-y-2">
                                                {[
                                                    { category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
                                                    { category: 'Backend', skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'Redis'] },
                                                    { category: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'K8s', 'Terraform'] },
                                                ].map(group => (
                                                    <div key={group.category}>
                                                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">{group.category}</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {group.skills.map(skill => (
                                                                <span key={skill} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-indigo-100">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Certifications</h3>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                                                    <Award className="w-3 h-3 text-amber-500" />
                                                    <span className="font-semibold">AWS Solutions Architect — Professional</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                                                    <Award className="w-3 h-3 text-amber-500" />
                                                    <span className="font-semibold">Google Cloud Professional Data Engineer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {/* Education */}
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2">Education</h3>
                                        <div className="mb-3">
                                            <div className="flex justify-between items-baseline">
                                                <div className="font-bold text-slate-900 text-xs">BS Computer Science</div>
                                                <div className="text-[10px] text-slate-400 font-mono">2016 — 2020</div>
                                            </div>
                                            <div className="text-slate-500 text-[10px]">University of California, Berkeley</div>
                                            <div className="mt-1 flex gap-2 text-[9px] text-slate-600">
                                                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1 rounded">GPA: 3.9/4.0</span>
                                                <span className="italic">Magna Cum Laude</span>
                                            </div>
                                            <div className="mt-1 text-[9px] text-slate-500 leading-tight">
                                                <span className="font-medium text-slate-600">Relevant:</span> Distributed Systems, Machine Learning, Algorithms, Cloud Computing
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ATS Score Badge */}
                                <div className="absolute top-6 right-6 pointer-events-none">
                                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black tracking-wide">ATS Score: 96/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ------------------------------------------------------------ */}
                    {/* LAYER 3: THE LENS (Glass/Ring/Scanner Overlay)               */}
                    {/* ------------------------------------------------------------ */}
                    <motion.div
                        className="absolute w-[440px] h-[440px] rounded-full pointer-events-none z-30"
                        style={{
                            x: lensX,
                            y: lensY,
                            left: -220,
                            top: -220,
                        }}
                    >
                        {/* Glass Reflection - Darker/Sharper for contrast against white */}
                        <div className="absolute inset-0 rounded-full border-[1px] border-indigo-500/20 shadow-[0_0_80px_rgba(0,0,0,0.2),inset_0_0_40px_rgba(255,255,255,0.2)] backdrop-brightness-105" />

                        {/* Subtle Glint */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-white/30 rounded-full blur-2xl opacity-40" />

                        {/* Crosshairs - Darker for visibility */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 opacity-30">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-indigo-900" />
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-indigo-900" />
                        </div>
                    </motion.div>


                    {/* ------------------------------------------------------------ */}
                    {/* LAYER 4: FALLBACK / INSTRUCTIONS                             */}
                    {/* ------------------------------------------------------------ */}
                    {!isHovering && !isMobile && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-300">
                            <div className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white rounded-full border border-white/10 backdrop-blur-md shadow-xl">
                                <MousePointer2 className="w-4 h-4 animate-bounce" />
                                <span className="text-xs font-medium uppercase tracking-wide">Hover to Reveal Quality</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan-fast {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0%); }
                }
                .animate-scan-fast {
                    animation: scan-fast 1.5s linear infinite;
                }
            `}</style>
        </section>
    );
};
