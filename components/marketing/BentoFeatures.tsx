"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ScanSearch, Wand2, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const features = [
    {
        icon: <FileText className="w-8 h-8 text-indigo-400" />,
        title: "Smart Builder",
        description: "Create professional resumes using 9+ ATS-compliant templates. No design skills needed.",
        colSpan: "md:col-span-2",
    },
    {
        icon: <ScanSearch className="w-8 h-8 text-pink-400" />,
        title: "ATS Scorer",
        description: "Get a detailed score out of 100. Find out exactly what's holding your resume back.",
        colSpan: "md:col-span-1",
    },
    {
        icon: <Wand2 className="w-8 h-8 text-cyan-400" />,
        title: "Resume Tailor",
        description: "Paste a Job Description and let AI rewrite your bullets to match the keywords perfectly.",
        colSpan: "md:col-span-1",
    },
    {
        icon: <Map className="w-8 h-8 text-emerald-400" />,
        title: "Career Roadmap",
        description: "Not sure what to learn next? Generate a step-by-step plan to reach your dream role.",
        colSpan: "md:col-span-2",
    },
];

export const BentoFeatures = () => {
    return (
        <section id="features" className="py-24 bg-background border-t border-white/5 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background">
            <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal width="100%">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Get Hired.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We don't just format text. We analyze, optimize, and strategize your career path using advanced LLMs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)] hover:-translate-y-1 backdrop-blur-sm",
                                    feature.colSpan
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="p-8 flex flex-col justify-between h-full relative z-10">
                                    <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
