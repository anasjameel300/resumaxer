"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    return (
        <header className="h-20 bg-background/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight capitalize">
                    {title.replace(/_/g, " ").toLowerCase()}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Bell size={20} />
                </Button>
            </div>
        </header>
    );
};
