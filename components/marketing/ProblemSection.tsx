"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertTriangle, FileWarning, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ProblemSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={sectionRef} className="py-24 relative overflow-hidden bg-black">
            {/* Background Noise */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 mb-6"
                    >
                        <AlertTriangle className="w-3 h-3" />
                        The Hard Truth
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
                    >
                        Your Resume is probably <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            invisible.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        75% of resumes are rejected by ATS algorithms before a human ever sees them.
                        Fancy columns, graphics, and unoptimized keywords trigger instant rejection.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <FileWarning className="w-8 h-8 text-red-500" />,
                            title: "Format Failures",
                            desc: "Columns, icons, and invisible tables confuse the parser, turning your experience into gibberish."
                        },
                        {
                            icon: <SearchX className="w-8 h-8 text-orange-500" />,
                            title: "Missing Keywords",
                            desc: "If you don't match the exact skills in the job description, you're scored as 0% relevant."
                        },
                        {
                            icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
                            title: "Generic Content",
                            desc: "Recruiters spend 6 seconds scanning. If you don't hook them instantly, you're out."
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * idx }}
                        >
                            <Card className="bg-zinc-900/50 border-white/5 hover:bg-zinc-900 hover:border-red-500/20 transition-all duration-300 group">
                                <CardContent className="p-8 text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:border-red-500/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
