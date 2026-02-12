"use client";

import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-background border-t border-white/5 py-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold border border-white/5">R</div>
                            <span className="font-bold text-foreground text-lg">Resumaxer</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The future of career building. <br /> Powered by advanced AI.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4 font-heading">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground/60">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Builder</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Templates</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4 font-heading">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground/60">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">ATS Guide</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4 font-heading">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground/60">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/40">
                    <div>© {new Date().getFullYear()} Resumaxer Inc. All rights reserved.</div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>
            {/* Ambient Glow */}
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-600/10 blur-[100px] pointer-events-none" />
        </footer>
    );
};
