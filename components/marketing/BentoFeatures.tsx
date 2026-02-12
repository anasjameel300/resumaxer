"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wand2,
    ScanSearch,
    Map as MapIcon,
    FileText,
    Target,
    Sparkles,
    ArrowUpRight,
    Cpu,
    Network,
    CheckCircle2,
    Briefcase,
    TrendingUp,
    AlertCircle
} from "lucide-react";

export const BentoFeatures = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    return (
        <section id="features" className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

            {/* Neural Connection Lines (SVG Background) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,1)" />
                        <stop offset="100%" stopColor="rgba(168,85,247,0)" />
                    </linearGradient>
                </defs>
                {/* Connecting lines between grid positions - purely decorative but aligned with grid */}
                <path d="M 200,300 Q 400,100 600,300 T 1000,300" fill="none" stroke="url(#line-gradient)" strokeWidth="1" className="animate-pulse" />
                <path d="M 300,600 Q 500,800 800,500" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <ScrollReveal width="100%">
                    {/* Section Header */}
                    <div className="text-center mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                            <Cpu className="w-3 h-3 text-blue-500" />
                            <span>Neural Engine v2.4</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Neural Grid.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            A living ecosystem of AI agents working in harmony to optimize every pixel of your professional identity.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                        {/* 1. AI Resume Builder (Large, Top Left) */}
                        <div
                            onMouseEnter={() => setHoveredCard(1)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 p-0 hover:bg-zinc-900/60 transition-colors flex flex-col md:flex-row"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Text Content - Left Side */}
                            <div className="relative z-10 p-8 flex flex-col justify-start md:w-1/2 shrink-0">
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Smart Builder</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                                            Generative AI that writes your bullets for you. Not just templates—intelligence.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Mockup - Right Side (Full Height) */}
                            <div className="relative md:w-1/2 h-64 md:h-auto bg-zinc-950/50 border-t md:border-t-0 md:border-l border-white/10 overflow-hidden">
                                <div className="absolute inset-0 p-6 flex items-center justify-center">
                                    <div className="w-full space-y-4 font-mono text-xs text-zinc-500 transform group-hover:scale-105 transition-transform duration-500">
                                        <div className="flex gap-2 opacity-50">
                                            <span className="text-red-500 shrink-0">-</span>
                                            <span className="line-through truncate">Managed a team of sales people.</span>
                                        </div>
                                        <div className="flex gap-2 text-emerald-400">
                                            <span className="shrink-0">+</span>
                                            <TypewriterEffect text="Led a high-performing sales team of 15, driving a 20% YoY revenue increase." />
                                        </div>
                                    </div>

                                    {/* AI Processing Badge */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase">Optimizing</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. ATS Scorer (Tall, Top Right) */}
                        <div
                            onMouseEnter={() => setHoveredCard(2)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="md:row-span-2 relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 p-8 hover:bg-zinc-900/60 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 h-full flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6">
                                    <ScanSearch className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">ATS Scorer</h3>
                                <p className="text-muted-foreground text-sm mb-8">Real-time parseability analysis.</p>

                                {/* Radar Chart Visual */}
                                <div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <RadarChart active={hoveredCard === 2} />
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase">Keywords</p>
                                        <p className="text-lg font-bold text-white">98%</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase">Brevity</p>
                                        <p className="text-lg font-bold text-white">100%</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase">Impact</p>
                                        <p className="text-lg font-bold text-white">High</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase">Style</p>
                                        <p className="text-lg font-bold text-white">Clean</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Job Matcher (Was "Targeted Tailor") (Small, Bottom Left) */}
                        <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 p-8 hover:bg-zinc-900/60 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4">
                                        <Target className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Job Matcher</h3>
                                    <p className="text-xs text-muted-foreground">We scan the job description and tell you exactly what keywords are missing.</p>
                                </div>

                                {/* Visual: Missing Keywords Detector */}
                                <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 mt-4 space-y-2">
                                    <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                                        <span>Detected Missing</span>
                                        <span className="text-red-400 animate-pulse">3 Critical</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> React
                                        </span>
                                        <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> TypeScript
                                        </span>
                                    </div>
                                    <div className="h-px w-full bg-zinc-800 my-1" />
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Auto-injecting into summary...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Career Pathfinder (Was "Roadmap") (Small, Bottom Middle) */}
                        <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 p-8 hover:bg-zinc-900/60 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 mb-4">
                                        <MapIcon className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Career Pathfinder</h3>
                                    <p className="text-xs text-muted-foreground">See your next role, salary potential, and the skills needed to get there.</p>
                                </div>

                                {/* Visual: Vertical Career Ladder */}
                                <div className="flex flex-col gap-2 mt-2 relative">
                                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-zinc-800" />

                                    {/* Step 3 (Goal) */}
                                    <div className="flex items-center gap-3 relative z-10 opacity-40 group-hover:opacity-100 transition-opacity delay-200">
                                        <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-zinc-900" />
                                        <div className="text-[10px]">
                                            <div className="text-orange-300 font-bold">VP of Engineering</div>
                                            <div className="text-zinc-500">$250k+</div>
                                        </div>
                                    </div>

                                    {/* Step 2 (Next) */}
                                    <div className="flex items-center gap-3 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity delay-100">
                                        <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-zinc-900 animate-pulse" />
                                        <div className="text-[10px]">
                                            <div className="text-orange-200 font-bold">Sr. Engineering Manager</div>
                                            <div className="text-zinc-500">$180k - $220k</div>
                                        </div>
                                    </div>

                                    {/* Step 1 (Current) */}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-3 h-3 rounded-full bg-zinc-600 border-2 border-zinc-900" />
                                        <div className="text-[10px]">
                                            <div className="text-zinc-400 font-bold">Senior Engineer</div>
                                            <div className="text-zinc-600">Current</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

// --- Sub-components for Visuals ---

const TypewriterEffect = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.substring(0, i));
            i++;
            if (i > text.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <span>
            {displayedText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

const RadarChart = ({ active }: { active: boolean }) => {
    // Simple SVG pentagon radar chart
    const points = "100,20 180,80 150,180 50,180 20,80"; // Outer shape
    const dataPoints = "100,30 170,85 140,170 60,170 30,85"; // Inner shape (Data)

    return (
        <svg viewBox="0 0 200 200" className="w-full h-full p-4">
            {/* Grid Background */}
            <polygon points={points} fill="none" stroke="#333" strokeWidth="1" />
            <polygon points="100,60 140,90 125,140 75,140 60,90" fill="none" stroke="#333" strokeWidth="1" />

            {/* Axis Lines */}
            <line x1="100" y1="100" x2="100" y2="20" stroke="#333" strokeWidth="1" />
            <line x1="100" y1="100" x2="180" y2="80" stroke="#333" strokeWidth="1" />
            <line x1="100" y1="100" x2="150" y2="180" stroke="#333" strokeWidth="1" />
            <line x1="100" y1="100" x2="50" y2="180" stroke="#333" strokeWidth="1" />
            <line x1="100" y1="100" x2="20" y2="80" stroke="#333" strokeWidth="1" />

            {/* Data Shape */}
            <motion.polygon
                points={dataPoints}
                fill="rgba(168,85,247,0.2)"
                stroke="#a855f7"
                strokeWidth="2"
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={active ? {
                    opacity: 1,
                    scale: 1.05,
                    // Simulate "Scanning" by slightly morphing points (simplified scale for now)
                } : { opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Active dots at vertices */}
            <circle cx="100" cy="30" r="2" fill="#a855f7" className="animate-pulse" />
            <circle cx="170" cy="85" r="2" fill="#a855f7" className="animate-pulse" />
            <circle cx="140" cy="170" r="2" fill="#a855f7" className="animate-pulse" />
            <circle cx="60" cy="170" r="2" fill="#a855f7" className="animate-pulse" />
            <circle cx="30" cy="85" r="2" fill="#a855f7" className="animate-pulse" />
        </svg>
    );
};
