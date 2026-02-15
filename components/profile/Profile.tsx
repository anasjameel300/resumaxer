import React, { useState } from 'react';
import { ResumeData } from '../../types';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Globe, Linkedin, Github,
    Briefcase, LogOut, Save, Camera, Sparkles, LayoutTemplate, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProfileProps {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const Profile: React.FC<ProfileProps> = ({ data, setData }) => {
    const { user, signOut } = useAuth();
    const supabase = createClient();
    const [isSaving, setIsSaving] = useState(false);

    if (!data) return null;

    const handleSave = async () => {
        setIsSaving(true);
        if (user) {
            await supabase.from('profiles').update({
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                location: data.location,
                target_role: data.targetRole,
                updated_at: new Date().toISOString(),
            }).eq('id', user.id);
        }
        setTimeout(() => setIsSaving(false), 600);
    };

    const updateField = (field: keyof ResumeData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateSocial = (id: string, url: string) => {
        setData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map(link =>
                link.id === id ? { ...link, url } : link
            )
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pb-20 space-y-8"
        >
            {/* Header / Cover */}
            <div className="relative h-48 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-zinc-900" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-8 flex items-end gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-zinc-900 border-4 border-zinc-950 shadow-2xl flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden group/avatar cursor-pointer">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt={data?.fullName || 'Profile'}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : data?.fullName ? (
                                data.fullName.charAt(0).toUpperCase()
                            ) : (
                                <User className="w-10 h-10 text-zinc-600" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-zinc-950 rounded-full" />
                    </div>
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{data.fullName || 'Guest User'}</h1>
                        <p className="text-zinc-400 flex items-center gap-2 text-sm">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Premium Member
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation/Actions */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900/40 border-white/5 p-2 overflow-hidden backdrop-blur-sm">
                        <nav className="space-y-1">
                            {['General', 'Account', 'Billing'].map((item, i) => (
                                <button
                                    key={item}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        i === 0
                                            ? "bg-white/10 text-white"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                        <div className="my-2 border-t border-white/5" />
                        <button onClick={signOut} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 group">
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Sign Out
                        </button>
                    </Card>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
                        <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" />
                            Pro Tips
                        </h3>
                        <p className="text-xs text-indigo-200/70 leading-relaxed mb-4">
                            Completing your profile increases resume generation quality by 40%.
                        </p>
                        <Button size="sm" variant="secondary" className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-0 h-8 text-xs">
                            Upgrade Plan
                        </Button>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white">Personal Information</h2>
                                <p className="text-sm text-zinc-400">Manage your public profile details.</p>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                size="sm"
                                className={cn(
                                    "gap-2 transition-all",
                                    isSaving ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-zinc-200"
                                )}
                            >
                                {isSaving ? <CheckCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saved!' : 'Save Changes'}
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            value={data.fullName}
                                            onChange={(e) => updateField('fullName', e.target.value)}
                                            className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Title/Role</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            value={data.targetRole || ''} // Using targetRole as title fallback
                                            onChange={(e) => updateField('targetRole', e.target.value)} // Assuming we can use targetRole here? Or fallback to just UI
                                            className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                            placeholder="Senior Engineer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            value={data.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            value={data.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        value={data.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50"
                                        placeholder="San Francisco, CA"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-bold text-white">Social Links</h2>
                            <p className="text-sm text-zinc-400">Where can recruiters find you?</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.socialLinks.map(link => (
                                <div key={link.id} className="flex gap-4 items-center group">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                        {link.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-500" />}
                                        {link.platform === 'GitHub' && <Github className="w-5 h-5 text-white" />}
                                        {link.platform === 'Portfolio' && <Globe className="w-5 h-5 text-emerald-500" />}
                                        {link.platform === 'Website' && <LayoutTemplate className="w-5 h-5 text-purple-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateSocial(link.id, e.target.value)}
                                            className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 h-10"
                                            placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                                        />
                                    </div >
                                </div >
                            ))}
                        </div >
                    </Card >
                </div >
            </div >
        </motion.div >
    );
};


export default Profile;
