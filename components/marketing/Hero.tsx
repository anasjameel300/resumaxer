"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Aurora Gradients */}
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-100 mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    AI Model V2.0 Live
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-white mb-8 leading-[1.1]"
                >
                    Your Career <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                        On Autopilot.
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Stop guessing. Our AI builds, scores, and tailors your resume to beat the algorithms and impress humans.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" variant="glow" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto hover:scale-105 transition-transform">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Build My Resume
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto hover:bg-white/5 border-white/10">
                        Check ATS Score
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>

                {/* Social Proof Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground/60"
                >
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500/80" />
                        <span>ATS Optimized</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500/80" />
                        <span>GPT-4 Powered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500/80" />
                        <span>Instant PDF</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
