"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ResumePreview from '../builder/ResumeTemplates';
import { ResumeData, TemplateId } from '@/types';

// --- SAMPLE DATA FOR PREVIEWS ---
const SAMPLE_RESUME: ResumeData = {
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    socialLinks: [
        { id: "1", platform: "LinkedIn", url: "linkedin.com/in/alexmorgan" },
        { id: "2", platform: "GitHub", url: "github.com/alexmorgan" }
    ],
    summary: "Senior Frontend Engineer with 6+ years of experience building scalable web applications. Expert in React, TypeScript, and modern UI/UX design. Passionate about performance optimization and accessibility.",
    experience: [
        {
            id: "1",
            role: "Senior Frontend Engineer",
            company: "TechFlow Inc.",
            duration: "2021 - Present",
            details: "• Led migration of legacy dashboard to Next.js, improving load time by 40%.\n• Mentored 3 junior developers and established code quality standards.\n• Implemented complex data visualization features using D3.js."
        },
        {
            id: "2",
            role: "Software Developer",
            company: "Creative Sol",
            duration: "2018 - 2021",
            details: "• Developed responsive marketing sites for high-profile clients.\n• Collaborated with designers to implement pixel-perfect UIs."
        }
    ],
    education: [
        {
            id: "1",
            degree: "BS Computer Science",
            school: "University of Tech",
            year: "2018"
        }
    ],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL"],
    projects: [],
    achievements: [],
    languages: []
};

const TEMPLATES_ROW_1: { id: TemplateId; name: string }[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'executive', name: 'Executive' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'timeline', name: 'Timeline' },
];

const TEMPLATES_ROW_2: { id: TemplateId; name: string }[] = [
    { id: 'creative', name: 'Creative' },
    { id: 'standard', name: 'Standard' },
    { id: 'compact', name: 'Compact' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'modern', name: 'Modern Plus' }, // Reusing modern for filler
];

const TemplateCard = ({ template }: { template: { id: TemplateId; name: string } }) => {
    return (
        <div className="relative group cursor-pointer">
            {/* Card Container */}
            <div className="w-[280px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">

                {/* Scaled Resume Preview */}
                <div className="absolute top-0 left-0 w-[210mm] min-h-[297mm] origin-top-left transform scale-[0.35] pointer-events-none select-none">
                    <ResumePreview data={SAMPLE_RESUME} template={template.id} />
                </div>

                {/* Overlay Gradient & content (unchanged) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {template.name}
                    </span>
                    <button className="mt-3 bg-white text-slate-900 text-xs font-bold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg">
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    );
};

const Marquee = ({ children, direction = "left", speed = 40, className }: { children: React.ReactNode, direction?: "left" | "right", speed?: number, className?: string }) => {
    return (
        <div className={cn("flex overflow-hidden select-none gap-8 w-full", className)}>
            <motion.div
                className="flex shrink-0 gap-8 min-w-full items-stretch"
                initial={{ x: direction === "left" ? 0 : "-100%" }}
                animate={{ x: direction === "left" ? "-100%" : 0 }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
            >
                {children}
            </motion.div>
            <motion.div
                className="flex shrink-0 gap-8 min-w-full items-stretch"
                initial={{ x: direction === "left" ? 0 : "-100%" }}
                animate={{ x: direction === "left" ? "-100%" : 0 }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}


export const TemplatesGallery = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>

            <div className="container mx-auto px-4 mb-12 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        Professional Templates for <span className="text-indigo-600">Every Role</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Choose from our collection of ATS-optimized designs. From creative to executive, we have a style that fits your career.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-12 relative z-0">
                {/* Row 1: Left */}
                <Marquee direction="left" speed={60}>
                    {TEMPLATES_ROW_1.map((template, idx) => (
                        <TemplateCard key={`row1-${idx}`} template={template} />
                    ))}
                </Marquee>

                {/* Row 2: Right */}
                <Marquee direction="right" speed={50}>
                    {TEMPLATES_ROW_2.map((template, idx) => (
                        <TemplateCard key={`row2-${idx}`} template={template} />
                    ))}
                </Marquee>
            </div>

            {/* Vignette for smooth edge fading */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};
