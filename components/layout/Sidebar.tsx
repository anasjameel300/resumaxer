"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    ClipboardList,
    BarChart,
    Wand2,
    Mail,
    Map,
    Flame,
    User,
    Zap
} from "lucide-react";
import { AppView } from "@/types"; // We need to ensure types are imported correctly. Assuming AppView is in types.

// We need to define AppView here if it's not exported or just accept string/enum
// Based on the previous file, AppView is an enum. 
// I will accept the currentView and onViewChange props.

interface SidebarProps {
    currentView: any; // Using any for now to avoid enum import issues if path is wrong, but ideally AppView
    onViewChange: (view: any) => void;
    userData: { fullName: string; email?: string; avatarUrl?: string };
}

export const Sidebar = ({ currentView, onViewChange, userData }: SidebarProps) => {

    const navItems = [
        { label: "Dashboard", icon: <LayoutDashboard size={20} />, view: "DASHBOARD" },
        { label: "Resume Builder", icon: <FileText size={20} />, view: "BUILDER", category: "Build & Track" },
        { label: "Job Tracker", icon: <ClipboardList size={20} />, view: "TRACKER", category: "Build & Track" },
        { label: "Resume Analysis", icon: <BarChart size={20} />, view: "ATS_SCORER", category: "Optimize" },
        { label: "Cover Letter", icon: <Mail size={20} />, view: "COVER_LETTER", category: "Optimize" },
        { label: "Career Roadmap", icon: <Map size={20} />, view: "ROADMAP", category: "Optimize" },
        { label: "Roast My Resume", icon: <Flame size={20} />, view: "ROASTER", category: "Fun", variant: "danger" },
    ];

    // Group items by category
    const groups = navItems.reduce((acc, item) => {
        const cat = item.category || "Main";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, typeof navItems>);

    const groupOrder = ["Main", "Build & Track", "Optimize", "Fun"];

    return (
        <aside className="w-20 md:w-72 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen sticky top-0 transition-all duration-300 z-40">

            {/* Brand */}
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <Zap size={20} fill="currentColor" />
                </div>
                <div className="hidden md:block">
                    <span className="font-bold text-lg tracking-tight text-white block leading-none">Resumaxer</span>
                    <span className="text-xs text-zinc-500 font-medium tracking-wide">AI Career Suite</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto custom-scrollbar">
                {groupOrder.map((group) => (
                    groups[group] && (
                        <div key={group}>
                            {group !== "Main" && (
                                <div className="px-4 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:block">
                                    {group}
                                </div>
                            )}
                            <div className="space-y-1">
                                {groups[group].map((item) => {
                                    const isActive = currentView === item.view;
                                    const isDanger = item.variant === "danger";

                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => onViewChange(item.view)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? isDanger
                                                        ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                                                        : "bg-primary/10 text-primary ring-1 ring-primary/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <span className="relative z-10">{item.icon}</span>
                                            <span className="hidden md:block font-medium text-sm relative z-10">{item.label}</span>
                                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                    onClick={() => onViewChange("PROFILE")}
                    className={cn(
                        "w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/5 transition-colors group",
                        currentView === "PROFILE" && "ring-1 ring-primary/50 bg-primary/5"
                    )}
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center font-bold text-white text-xs border border-white/10 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all overflow-hidden">
                        {userData.avatarUrl ? (
                            <img src={userData.avatarUrl} alt={userData.fullName || 'Profile'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'G'
                        )}
                    </div>
                    <div className="hidden md:block text-left overflow-hidden">
                        <div className="text-sm font-medium text-zinc-200 truncate">{userData.fullName || 'Guest User'}</div>
                        <div className="text-xs text-zinc-500 group-hover:text-primary transition-colors">View Profile</div>
                    </div>
                </button>
            </div>
        </aside>
    );
};
