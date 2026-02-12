"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "$0",
            description: "Perfect for students and first-time job seekers.",
            features: ["1 Resume", "Basic Templates", "PDF Export"],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Pro",
            price: "$19",
            description: "Supercharge your job search with AI optimization.",
            features: ["Unlimited Resumes", "AI Bullet Point Writer", "ATS Scorer", "Cover Letter Generator"],
            cta: "Go Pro",
            popular: true,
        },
        {
            name: "Power",
            price: "$39",
            description: "For serious professionals targeting top-tier roles.",
            features: ["Everything in Pro", "LinkedIn Optimization", "Career Roadmap", "Priority Support"],
            cta: "Get Power",
            popular: false,
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

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-2xl border flex flex-col bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2
                    ${plan.popular ? "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20 scale-105 z-10" : "border-white/10 hover:border-white/20"}
                `}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                        POPULAR
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">/mo</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4">{plan.description}</p>
                                </div>

                                <div className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-primary" />
                                            </div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.popular ? "glow" : "outline"}
                                    className="w-full"
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
