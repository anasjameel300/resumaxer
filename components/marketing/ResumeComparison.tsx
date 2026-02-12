"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ResumeComparison = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderValue(Number(e.target.value));
    };

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    {/* Text Content */}
                    <div className="w-full md:w-1/3 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                            Don't Let Bad Formatting <span className="text-destructive">Kill Your Chances.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Recruiters spend an average of 6 seconds scanning a resume. Our AI transforms messy, unreadable drafts into polished, professional documents that pass the ATS scan.
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold">✗</div>
                                <div>
                                    <h4 className="font-bold text-destructive">Before</h4>
                                    <p className="text-sm text-muted-foreground">Messy structure, typos, generic descriptions.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold">✓</div>
                                <div>
                                    <h4 className="font-bold text-green-500">After</h4>
                                    <p className="text-sm text-muted-foreground">Clean layout, action verbs, quantified results.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Component */}
                    <div className="w-full md:w-2/3 relative h-[600px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group select-none">

                        {/* Image 1: Bad Resume (Background) */}
                        <div className="absolute inset-0 bg-white p-8 font-mono text-xs text-gray-500">
                            <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none" />
                            <div className="relative z-10 opacity-60 blur-[0.5px] space-y-6">
                                <div className="text-black font-bold text-xl">alex mercer</div>
                                <div>email: alex_m_1990@yahoo.com | phone: 555-987-6543</div>

                                <div>
                                    <div className="font-bold underline text-black mb-2">Work History</div>
                                    <p>I worked at Global Logistics Partners from 2021 to now. I was a shift supervisor. I managed the team and made sure things were safe.</p>
                                    <p className="mt-4">Walmart (2019-2021) - Inventory Guy. Counted stock and talked to vendors.</p>
                                </div>

                                <div>
                                    <div className="font-bold underline text-black mb-2">Skills</div>
                                    <p>Microsoft Office, Hard Worker, Team Player, Logistics, Forklift Certified.</p>
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 text-red-500 font-black text-5xl uppercase p-4 -rotate-12 opacity-30">
                                REJECTED
                            </div>
                        </div>

                        {/* Image 2: Good Resume (Foreground, clipped) */}
                        <div
                            className="absolute inset-0 bg-zinc-900 z-10 overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                        >
                            <div className="absolute inset-0 bg-zinc-950 p-8 font-sans text-zinc-300">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b border-zinc-800 pb-6 mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">ALEX MERCER</h1>
                                        <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1">Senior Operations Manager</div>
                                    </div>
                                    <div className="text-right text-xs text-zinc-500">
                                        alex.mercer@professional.com • (555) 987-6543<br />
                                        New York, NY • linkedin.com/in/alexmercer
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-indigo-500 rounded-full"></span> Professional Experience
                                        </h3>

                                        <div className="mb-4">
                                            <div className="flex justify-between font-bold text-white text-sm">
                                                <span>Logistics Shift Supervisor</span>
                                                <div className="text-zinc-500 text-xs">2021 - Present</div>
                                            </div>
                                            <div className="text-xs font-bold text-indigo-400 uppercase mb-2">Global Logistics Partners</div>
                                            <ul className="text-xs list-disc ml-4 space-y-2 text-zinc-400">
                                                <li>Spearheaded a warehouse reorganization project that increased daily throughput by <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-0 h-5 px-1.5 mx-1">25%</Badge> within 3 months.</li>
                                                <li>Managed a cross-functional team of 15 associates, achieving the highest regional safety rating for 2 consecutive years.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-indigo-500 rounded-full"></span> Core Competencies
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['Supply Chain Management', 'SAP ERP', 'Team Leadership', 'Lean Six Sigma', 'Data Analysis'].map(s => (
                                                <span key={s} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded text-[10px] font-medium">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ATS Score Floating Badge */}
                                <div className="absolute top-8 right-8 bg-zinc-900/90 backdrop-blur border border-green-500/30 px-4 py-2 rounded-xl shadow-2xl flex flex-col items-center gap-0.5 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <span className="text-2xl font-black text-green-400">98</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-green-600">ATS Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute inset-y-0 w-0.5 bg-indigo-500 shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] z-20 cursor-ew-resize hover:bg-indigo-400 transition-colors"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 border border-indigo-500 rounded-full shadow-lg flex items-center justify-center">
                                <div className="flex gap-0.5">
                                    <div className="w-0.5 h-3 bg-zinc-500"></div>
                                    <div className="w-0.5 h-3 bg-zinc-500"></div>
                                </div>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                        />

                    </div>
                </div>
            </div>
        </section>
    );
};
