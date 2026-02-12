"use client";

import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ResumeComparison } from './ResumeComparison';
import { BentoFeatures } from './BentoFeatures';
import { Footer } from './Footer';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
            <Navbar />
            <Hero />
            <BentoFeatures />
            <ResumeComparison />
            <Footer />
        </div>
    );
};

export default LandingPage;