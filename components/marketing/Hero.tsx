"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ScanLine, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Hero = ({ onStart }: { onStart: () => void }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <section ref={targetRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Aurora Gradients - Adjusted for Split Layout */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-blob mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT COLUMN: Content */}
                    <div className="text-center lg:text-left space-y-8">
                        {/* Badge Removed as per feedback */}
                        <div className="h-4"></div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter text-white leading-[1.05]"
                            >
                                Outsmart the <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                                    Algorithms.
                                </span> <br />
                                Impress Humans.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Stop sending your resume into the void. We help you structure, format, and optimize your application to ensure it gets read by a human.
                            </motion.p>
                        </div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
                                <Button
                                    size="lg"
                                    className="relative h-14 px-8 text-lg rounded-full bg-zinc-950 text-white border border-white/10 hover:bg-zinc-900 w-full sm:w-auto"
                                    onClick={onStart}
                                >
                                    <ScanLine className="mr-2 h-5 w-5 text-blue-400" />
                                    Start Free Scan
                                </Button>
                            </div>

                            <Button
                                size="lg"
                                variant="ghost"
                                className="h-14 px-8 text-lg rounded-full w-full sm:w-auto hover:bg-white/5 text-muted-foreground hover:text-white"
                                onClick={onStart}
                            >
                                View Examples
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>

                        {/* Trust Signals */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground/50"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                                <span>ATS-Friendly</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500/80" />
                                <span>Instant Analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span>Smart Optimization</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: 3D Visual */}
                    <motion.div
                        style={{ opacity, scale, y }}
                        className="relative hidden lg:block h-[600px] perspective-1000"
                    >
                        {/* 3D Tilted Card Container */}
                        <motion.div
                            initial={{ rotateX: 20, rotateY: -20, rotateZ: 5, opacity: 0, scale: 0.8 }}
                            animate={{ rotateX: 10, rotateY: -15, rotateZ: 2, opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center transform-style-3d"
                        >
                            {/* The Resume Card */}
                            <div className="w-[400px] h-[560px] bg-zinc-950 border border-white/10 rounded-xl shadow-2xl relative overflow-hidden group">
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>

                                {/* Header Mockup */}
                                <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-full bg-zinc-800 animate-pulse"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                                            <div className="h-3 w-1/2 bg-zinc-800/50 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body Mockup */}
                                <div className="p-8 space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="h-3 w-1/4 bg-blue-500/20 rounded"></div>
                                            <div className="h-2 w-full bg-zinc-800/50 rounded"></div>
                                            <div className="h-2 w-full bg-zinc-800/50 rounded"></div>
                                            <div className="h-2 w-5/6 bg-zinc-800/50 rounded"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Scanning Line Effect */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-scan"></div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 top-1/4 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold">ATS Score</p>
                                        <p className="text-xl font-bold text-white">98/100</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-8 bottom-1/4 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md z-20 max-w-[200px]"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                                        <Sparkles className="w-3 h-3" /> Keyword Match
                                    </div>
                                    <p className="text-xs text-zinc-400">"Leadership" detected. Relevance increased by 15%.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Live Scan Ticker */}
                <div className="mt-20 border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden py-4">
                    <div className="flex items-center gap-12 animate-marquee whitespace-nowrap opacity-50">
                        {/* Duplicate content to create seamless loop */}
                        {[...Array(2)].map((_, groupIndex) => (
                            <React.Fragment key={groupIndex}>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    <span className="text-sm font-mono text-muted-foreground">REAL-TIME CONTENT ANALYSIS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    <span className="text-sm font-mono text-muted-foreground">KEYWORD MATCHING</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    <span className="text-sm font-mono text-muted-foreground">ATS COMPLIANCE CHECK</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                    <span className="text-sm font-mono text-muted-foreground">PDF GENERATION</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                    <span className="text-sm font-mono text-muted-foreground">GRAMMAR OPTIMIZATION</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

