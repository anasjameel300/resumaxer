"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

export const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "/forever",
            description: "Build a great resume manually.",
            features: [
                { name: "Manual Resume Builder", included: true },
                { name: "1 Resume Template", included: true },
                { name: "TXT Export", included: true },
                { name: "AI Content Generation", included: false },
                { name: "ATS Optimization", included: false },
                { name: "PDF Source File", included: false },
            ],
            cta: "Create Free Resume",
            popular: false,
        },
        {
            name: "Pro",
            price: "$10",
            period: "/month",
            description: "Supercharge your resume with AI.",
            features: [
                { name: "Unlimited AI Bullet Points", included: true },
                { name: "10+ Professional Templates", included: true },
                { name: "PDF & Word Export", included: true },
                { name: "AI Summary Writer", included: true },
                { name: "ATS Scoring (Basic)", included: true },
                { name: "Priority Support", included: false },
            ],
            cta: "Upgrade to Pro",
            popular: false,
        },
        {
            name: "Recruiting Plan",
            price: "$49",
            period: "/6 months",
            description: "Perfect for your entire job search journey.",
            features: [
                { name: "Everything in Pro", included: true },
                { name: "Advanced ATS Keywords", included: true },
                { name: "LinkedIn Profile Optimization", included: true },
                { name: "Cover Letter Generator", included: true },
                { name: "Unlimited Resumes", included: true },
                { name: "Priority 24/7 Support", included: true },
            ],
            cta: "Get Recruiting Plan",
            popular: true,
            badge: "Most Popular",
            save: "SAVE 20%"
        },
    ];

    return (
        <section id="pricing" className="py-24 bg-background border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal width="100%">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                            Simple, Transparent <span className="text-primary">Pricing.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Start for free and upgrade as you grow. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-3xl border flex flex-col transition-all duration-300
                    ${plan.popular ? "bg-zinc-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105 z-10" : "bg-zinc-950/50 border-white/10 hover:border-white/20"}
                `}
                            >
                                {plan.popular && (
                                    <>
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            {plan.badge}
                                        </div>
                                        {plan.save && (
                                            <div className="absolute -top-3 -right-3 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full rotate-12 shadow-lg">
                                                {plan.save}
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="mb-8 text-center pt-4">
                                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                                    <div className="flex items-end justify-center gap-1 mb-2">
                                        <span className="text-5xl font-black text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground text-sm font-medium mb-1">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </div>

                                <div className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <div key={feature.name} className={cn("flex items-center gap-3 text-sm", feature.included ? "text-foreground" : "text-muted-foreground/50")}>
                                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", feature.included ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800/50 text-zinc-600")}>
                                                {feature.included ? <Check size={12} strokeWidth={3} /> : <div className="w-2 h-0.5 bg-current rotate-45" />}
                                                {/* Note: Cross icon simulated or use Lucide X if imported */}
                                            </div>
                                            <span className={feature.included ? "" : "line-through"}>{feature.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.popular ? "glow" : "outline"}
                                    className={cn("w-full py-6 text-base", plan.popular ? "font-bold" : "")}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
