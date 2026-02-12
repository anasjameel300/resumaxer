import React from 'react';
import { ResumeData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Code2,
    FileText,
    Edit2,
    Sparkles,
    Trophy,
    GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface ProfileProps {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const Profile: React.FC<ProfileProps> = ({ data, setData }) => {
    const updateField = (field: keyof ResumeData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        updateField('skills', skillsArray);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">

            {/* Header Section */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
                <Card className="relative bg-zinc-900/60 border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                    {/* Cover Image Placeholder */}
                    <div className="h-32 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-white/5 relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    </div>

                    <CardContent className="px-8 pb-8 pt-0 relative">
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12">
                            {/* Avatar */}
                            <div className="relative group/avatar">
                                <div className="w-32 h-32 rounded-full p-1 bg-zinc-950 ring-4 ring-zinc-900 shadow-xl overflow-hidden relative">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                        {data.fullName ? data.fullName.charAt(0).toUpperCase() : <User className="w-12 h-12 text-zinc-600" />}
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full shadow-lg z-10" title="Active">
                                        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 text-center md:text-left pt-12 md:pt-0">
                                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-2 flex items-center justify-center md:justify-start gap-3">
                                    {data.fullName || "Guest User"}
                                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs py-0.5 px-2 align-middle">PRO</Badge>
                                </h1>
                                <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground font-medium justify-center md:justify-start text-sm">
                                    <span className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" />
                                        {data.email || "No email set"}
                                    </span>
                                    <span className="hidden md:inline w-1 h-1 bg-zinc-700 rounded-full"></span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                        {data.phone || "No phone set"}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                                <div className="bg-zinc-900/50 hover:bg-zinc-800/80 px-5 py-3 rounded-2xl border border-white/5 text-center min-w-[100px] backdrop-blur-sm transition-colors group/stat cursor-default">
                                    <div className="text-2xl font-bold text-white group-hover/stat:text-blue-400 transition-colors">{data.experience.length}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Roles</div>
                                </div>
                                <div className="bg-zinc-900/50 hover:bg-zinc-800/80 px-5 py-3 rounded-2xl border border-white/5 text-center min-w-[100px] backdrop-blur-sm transition-colors group/stat cursor-default">
                                    <div className="text-2xl font-bold text-white group-hover/stat:text-purple-400 transition-colors">{data.skills.length}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Skills</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Personal Info & Skills (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Personal Details Card */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm h-fit">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                                <User className="w-5 h-5 text-blue-500" /> Edit Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</label>
                                <Input
                                    type="text"
                                    value={data.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="bg-zinc-950/50 border-white/10 focus:border-blue-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="bg-zinc-950/50 border-white/10 focus:border-blue-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="bg-zinc-950/50 border-white/10 focus:border-blue-500/50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Card */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm flex flex-col h-full max-h-[600px]">
                        <CardHeader className="pb-4 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                                <Code2 className="w-5 h-5 text-indigo-500" /> Skills
                            </CardTitle>
                            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20">
                                {data.skills.length}
                            </Badge>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col pt-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                                    Comma-separated list
                                </label>
                                <Textarea
                                    className="flex-1 resize-none text-sm leading-relaxed min-h-[150px] bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                    placeholder="e.g. React, Node.js, Leadership, Strategic Planning..."
                                    value={data.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.slice(0, 8).map((skill, i) => (
                                    <Badge key={i} variant="outline" className="bg-zinc-900/50 border-white/10 text-zinc-300 hover:bg-zinc-800 hover:border-white/20 transition-colors cursor-default">
                                        {skill}
                                    </Badge>
                                ))}
                                {data.skills.length > 8 && (
                                    <span className="text-xs text-muted-foreground py-1 flex items-center">+ {data.skills.length - 8} more</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Summary & Experience (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Summary Card */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                                <FileText className="w-5 h-5 text-amber-500" /> Professional Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea
                                className="h-40 resize-none text-sm leading-7 text-zinc-300 p-4 bg-zinc-950/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20"
                                placeholder="Write a compelling summary that highlights your key achievements and career goals..."
                                value={data.summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Experience Card */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm min-h-[400px]">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                                <Briefcase className="w-5 h-5 text-emerald-500" /> Career History
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {data.experience.length === 0 ? (
                                <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border-2 border-dashed border-white/10">
                                    <div className="text-5xl mb-6 opacity-20 grayscale">🏢</div>
                                    <h4 className="text-lg font-bold text-white mb-2">No Experience Added</h4>
                                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">Your resume is looking a bit empty. Add your work history in the Builder to populate this section.</p>
                                    <Button variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300">
                                        Go to Resume Builder <Edit2 className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 border-l border-white/10 last:border-0 pb-2 group hover:border-emerald-500/30 transition-colors">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-900 border-2 border-zinc-500 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_0_4px_rgba(0,0,0,0.5)]"></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                                <h4 className="font-bold text-lg text-zinc-100 group-hover:text-emerald-400 transition-colors">{exp.role || "Untitled Role"}</h4>
                                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-white/5 font-mono text-xs">
                                                    {exp.duration || "Dates"}
                                                </Badge>
                                            </div>
                                            <div className="text-base font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                                                {exp.company || "Company"}
                                            </div>
                                            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line bg-zinc-950/30 p-4 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                                                {exp.details || "No description provided."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
