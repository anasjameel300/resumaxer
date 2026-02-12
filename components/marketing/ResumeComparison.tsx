"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MousePointer2 } from "lucide-react";

export const ResumeComparison = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse Position State
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    // Smooth physics for the lens movement
    const lensX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const lensY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    return (
        <section id="comparison" className="py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col gap-16 items-center text-center mb-12">
                    <div className="space-y-4 max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Reality Lens.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            See what recruiters look for. Hover over the document to reveal the hidden optimizations that maximize your chances.
                        </p>
                    </div>
                </div>

                {/* Comparison Component */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full max-w-5xl mx-auto relative h-[700px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group select-none bg-zinc-900 cursor-none"
                >

                    {/* Image 1: Bad Resume (Background - Blurred & Darkened) */}
                    <div className="absolute inset-0 bg-zinc-950 p-12 font-mono text-xs text-gray-600 filter blur-[2px] opacity-50 grayscale transition-all duration-500">
                        <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none" />
                        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                            <div className="space-y-2">
                                <div className="text-black bg-zinc-800 w-1/3 h-8"></div>
                                <div className="bg-zinc-800 w-full h-4"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="font-bold bg-zinc-800 w-1/4 h-6"></div>
                                <div className="bg-zinc-800 w-full h-20"></div>
                                <div className="bg-zinc-800 w-full h-20"></div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-red-500 text-red-500 font-black text-7xl uppercase p-8 -rotate-12 opacity-20">
                                REJECTED
                            </div>
                        </div>
                    </div>

                    {/* Image 2: Good Resume (Foreground - Revealed by Mask) */}
                    <motion.div
                        className="absolute inset-0 bg-white z-20 overflow-hidden"
                        style={{
                            maskImage: "radial-gradient(circle 150px at var(--x, 50%) var(--y, 50%), black 100%, transparent 100%)",
                            WebkitMaskImage: "radial-gradient(circle 150px at var(--x, 50%) var(--y, 50%), black 100%, transparent 100%)",
                        }}
                    >
                        {/* We use a motion component to bind the CSS variables for the mask */}
                        <MaskUpdateListener x={lensX} y={lensY} />

                        <div className="absolute inset-0 bg-zinc-950 p-12 font-sans text-zinc-300 max-w-3xl mx-auto">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-zinc-800 pb-6 mb-8">
                                <div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">ALEX MERCER</h1>
                                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mt-2">Senior Operations Manager</div>
                                </div>
                                <div className="text-right text-xs text-zinc-500">
                                    alex.mercer@professional.com • (555) 987-6543<br />
                                    New York, NY • linkedin.com/in/alexmercer
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span> Professional Experience
                                    </h3>

                                    <div className="mb-6 group/item relative">
                                        <div className="flex justify-between font-bold text-white text-sm mb-1">
                                            <span>Logistics Shift Supervisor</span>
                                            <div className="text-zinc-500 text-xs">2021 - Present</div>
                                        </div>
                                        <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Global Logistics Partners</div>
                                        <ul className="text-xs list-disc ml-4 space-y-2 text-zinc-400 leading-relaxed">
                                            <li>
                                                <span className="text-white font-medium">Spearheaded</span> a warehouse reorganization project that increased daily throughput by <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 h-5 px-1.5 mx-1">25%</Badge> within 3 months, reducing overhead costs.
                                            </li>
                                            <li>
                                                <span className="text-white font-medium">Orchestrated</span> a cross-functional team of 15 associates, achieving the highest regional safety rating for 2 consecutive years through rigorous training protocols.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between font-bold text-white text-sm mb-1">
                                            <span>Operations Associate</span>
                                            <div className="text-zinc-500 text-xs">2019 - 2021</div>
                                        </div>
                                        <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Walmart Supply Chain</div>
                                        <ul className="text-xs list-disc ml-4 space-y-2 text-zinc-400 leading-relaxed">
                                            <li>
                                                Optimized inventory tracking using SAP ERP systems, reducing discrepancy rates by <span className="text-white font-medium">15%</span>.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span> Core Competencies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Supply Chain Management', 'SAP ERP', 'Team Leadership', 'Lean Six Sigma', 'Data Analysis', 'Conflict Resolution', 'Inventory Control'].map(s => (
                                            <span key={s} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-md text-[11px] font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flashlight Ring */}
                        <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/30 rounded-full w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-emerald-500/5 backdrop-brightness-125"
                            style={{
                                left: "var(--x)",
                                top: "var(--y)"
                            }}
                        />
                    </motion.div>

                    {/* Fallback Instruction if not hovering */}
                    {!isHovering && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                            <div className="flex flex-col items-center gap-3 animate-bounce opacity-50">
                                <MousePointer2 className="w-8 h-8 text-white" />
                                <span className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Hover to Reveal</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

// Helper component to update CSS variables from Framer Motion values
const MaskUpdateListener = ({ x, y }: { x: any, y: any }) => {
    return (
        <motion.div
            style={{ x, y }}
            className="hidden"
            onUpdate={(latest) => {
                // We find the parent container that needs the variables. 
                // Since this component is inside the masked motion div, we target the closest relative container or global if needed.
                // However, CSS variables cascade. So we can update them on a higher level container if we can reach it, 
                // OR we can update the specific element by ID or class.
                const els = document.querySelectorAll(".bg-white.z-20");
                els.forEach((el) => {
                    (el as HTMLElement).style.setProperty("--x", `${latest.x}px`);
                    (el as HTMLElement).style.setProperty("--y", `${latest.y}px`);
                });
            }}
        />
    )
}
