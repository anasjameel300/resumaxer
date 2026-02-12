import React, { useState, useRef } from 'react';
import { generateCareerRoadmap } from '../../services/geminiService';
import { ResumeData, CareerRoadmapResponse } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Flag,
    MapPin,
    Rocket,
    CheckCircle2,
    Circle,
    ArrowRight,
    BookOpen,
    Wrench,
    ExternalLink,
    RefreshCw,
    Map as MapIcon,
    Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CareerRoadmapProps {
    data: ResumeData;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ data }) => {
    const [targetRole, setTargetRole] = useState('');
    const [currentRole, setCurrentRole] = useState(data.experience[0]?.role || '');
    const [currentSkills, setCurrentSkills] = useState(data.skills.join(', ') || '');
    const [roadmap, setRoadmap] = useState<CareerRoadmapResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // Track checked steps: Set of Step IDs
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const handleGenerate = async () => {
        if (!targetRole.trim()) return;
        setLoading(true);
        setRoadmap(null);
        setCompletedSteps(new Set());

        try {
            const contextData: ResumeData = {
                ...data,
                experience: [{ ...data.experience[0], role: currentRole, id: 'temp', company: '', duration: '', details: '' }],
                skills: currentSkills.split(',').map(s => s.trim()).filter(s => s)
            };

            const result = await generateCareerRoadmap(contextData, targetRole);
            setRoadmap(result);
        } catch (e) {
            console.error(e);
            alert("Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleStep = (stepId: string) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            if (next.has(stepId)) {
                next.delete(stepId);
            } else {
                next.add(stepId);
            }
            return next;
        });
    };

    // Calculate Progress
    const totalSteps = roadmap?.phases.reduce((acc, phase) => acc + phase.steps.length, 0) || 0;
    const progressPercent = totalSteps > 0 ? Math.round((completedSteps.size / totalSteps) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">

            {!roadmap && (
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                        Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Roadmap</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A personalized, AI-generated path from where you are to where you want to be.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Input Side (4 cols) */}
                <div className="lg:col-span-4 space-y-6 print:hidden">

                    {/* Start Point Card */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-emerald-400" /> Starting Point
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Current Role</label>
                                <Input
                                    value={currentRole}
                                    onChange={(e) => setCurrentRole(e.target.value)}
                                    className="bg-zinc-950/50 border-white/10"
                                    placeholder="e.g. Junior Developer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Key Skills</label>
                                <Textarea
                                    className="input-field text-sm resize-none h-24 bg-zinc-950/50 border-white/10"
                                    placeholder="e.g. JavaScript, React, Communication..."
                                    value={currentSkills}
                                    onChange={(e) => setCurrentSkills(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Destination Card */}
                    <Card className="bg-zinc-900 border-white/10 shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground relative z-10">
                                <Flag className="w-4 h-4 text-blue-400" /> Dream Destination
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Target Job Title</label>
                                <Input
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    className="bg-zinc-950/50 border-white/10 text-lg py-6"
                                    placeholder="e.g. Senior ML Engineer"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading || !targetRole}
                                className={cn(
                                    "w-full py-6 font-bold text-lg rounded-xl shadow-lg transition-all hover:scale-105",
                                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-900/20"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                                        Planning Route...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5 mr-2" /> Generate Roadmap
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Output Side (8 cols) */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {!roadmap ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-2xl bg-white/5"
                            >
                                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <MapIcon className="w-10 h-10 text-muted-foreground opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Map Your Future?</h3>
                                <p className="text-muted-foreground max-w-sm leading-relaxed">
                                    Enter your current details and your dream job on the left, and our AI will build a personalized, modular learning path.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                                id="roadmap-content"
                            >

                                {/* Progress Header */}
                                <Card className="bg-zinc-900 border-white/10 sticky top-4 z-30 shadow-2xl backdrop-blur-xl bg-zinc-900/90 supports-[backdrop-filter]:bg-zinc-900/80">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                                    Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{targetRole}</span>
                                                </h2>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {completedSteps.size === totalSteps ? (
                                                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                                            <CheckCircle2 className="w-4 h-4" /> Mission Accomplished!
                                                        </span>
                                                    ) : (
                                                        <span><span className="text-foreground font-bold">{completedSteps.size}</span> of <span className="text-foreground font-bold">{totalSteps}</span> tasks completed</span>
                                                    )}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => window.print()}>
                                                Print Plan
                                            </Button>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Gap Analysis Card */}
                                <Card className="bg-indigo-500/10 border-indigo-500/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                    <CardHeader>
                                        <CardTitle className="text-indigo-400 flex items-center gap-2 text-lg">
                                            <Milestone className="w-5 h-5" /> Gap Analysis & Strategy
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-indigo-200 leading-relaxed font-light">{roadmap.gapAnalysis}</p>
                                    </CardContent>
                                </Card>

                                {/* Phases Timeline */}
                                <div className="space-y-8 relative pl-4 lg:pl-0">
                                    {/* Timeline Line (Desktop) */}
                                    <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-30 z-0"></div>

                                    {roadmap.phases.map((phase, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.2 }}
                                            className="relative lg:pl-24"
                                        >
                                            {/* Timeline Node (Desktop) */}
                                            <div className={`hidden lg:flex absolute left-4 top-8 w-9 h-9 rounded-full border-4 border-zinc-950 shadow-xl z-10 items-center justify-center text-sm font-bold
                                    ${idx === 0 ? 'bg-emerald-500 text-black' : idx === 1 ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                                                {idx + 1}
                                            </div>

                                            <Card className="bg-zinc-900/40 border-white/5 hover:bg-zinc-900/60 transition-colors group overflow-hidden">
                                                {/* Color Header Strip */}
                                                <div className={`h-1 w-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>

                                                <CardContent className="p-6 md:p-8">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                        <div>
                                                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                                                                <span className="lg:hidden bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">Phase {idx + 1}</span>
                                                                <span>{phase.duration}</span>
                                                            </div>
                                                            <h3 className="text-2xl font-bold text-foreground">{phase.title}</h3>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5 flex gap-4 items-start">
                                                        <span className="text-2xl mt-0.5">🎯</span>
                                                        <div>
                                                            <span className="font-bold text-foreground text-sm block mb-1">Objective</span>
                                                            <p className="text-sm text-muted-foreground leading-relaxed">{phase.goal}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-8">
                                                        {/* Action Plan Column */}
                                                        <div className="flex flex-col h-full">
                                                            <h4 className="flex items-center gap-2 font-bold text-muted-foreground mb-4 pb-3 border-b border-white/5 text-xs uppercase tracking-wide">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Action Items
                                                            </h4>
                                                            <div className="space-y-3 flex-1">
                                                                {phase.steps.map((step) => {
                                                                    const isChecked = completedSteps.has(step.id);
                                                                    return (
                                                                        <div
                                                                            key={step.id}
                                                                            onClick={() => toggleStep(step.id)}
                                                                            className={cn(
                                                                                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                                                                isChecked
                                                                                    ? "bg-emerald-500/5 border-emerald-500/20"
                                                                                    : "bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-900"
                                                                            )}
                                                                        >
                                                                            <div className="relative mt-1">
                                                                                <div className={cn(
                                                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                                                    isChecked ? "bg-emerald-500 border-emerald-500" : "border-zinc-700 bg-zinc-950"
                                                                                )}>
                                                                                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0 relative z-10">
                                                                                <div className={cn(
                                                                                    "text-sm font-bold transition-colors",
                                                                                    isChecked ? "text-emerald-400 line-through opacity-60" : "text-zinc-200 group-hover:text-white"
                                                                                )}>
                                                                                    {step.task}
                                                                                </div>
                                                                                <div className={cn(
                                                                                    "text-xs mt-1 leading-snug transition-colors",
                                                                                    isChecked ? "text-emerald-500/50" : "text-muted-foreground"
                                                                                )}>
                                                                                    {step.description}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Resources Column */}
                                                        <div className="flex flex-col h-full">
                                                            <h4 className="flex items-center gap-2 font-bold text-muted-foreground mb-4 pb-3 border-b border-white/5 text-xs uppercase tracking-wide">
                                                                <BookOpen className="w-4 h-4 text-blue-500" /> Learning & Tools
                                                            </h4>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {phase.resources.map((res, rIdx) => (
                                                                    <a
                                                                        key={rIdx}
                                                                        href={res.url || `https://www.google.com/search?q=${encodeURIComponent(res.title + " " + res.type)}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="group flex flex-col bg-zinc-900/30 border border-white/5 rounded-xl p-4 hover:bg-zinc-900 hover:border-blue-500/30 hover:shadow-lg transition-all relative overflow-hidden"
                                                                    >
                                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                                            <Badge variant="outline" className={cn(
                                                                                "text-[10px] uppercase font-bold px-2 py-0 h-5 bg-transparent",
                                                                                res.type === 'Course' ? 'text-blue-400 border-blue-400/30' :
                                                                                    res.type === 'Tool' ? 'text-amber-400 border-amber-400/30' :
                                                                                        'text-purple-400 border-purple-400/30'
                                                                            )}>
                                                                                {res.type}
                                                                            </Badge>
                                                                            <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-white transition-colors" />
                                                                        </div>
                                                                        <div className="text-sm font-bold text-zinc-300 group-hover:text-blue-300 transition-colors line-clamp-2">
                                                                            {res.title}
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10 text-center print:hidden pb-12">
                                    <p className="text-muted-foreground mb-4">Want to adjust your path?</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => { setRoadmap(null); setTargetRole(''); }}
                                        className="border-white/10 hover:bg-white/5 text-muted-foreground"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" /> Start New Roadmap
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
