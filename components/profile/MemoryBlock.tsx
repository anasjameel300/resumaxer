import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Plus, Loader2, Sparkles, FileText, Trash2, Calendar, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AchievementItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryBlock: React.FC = () => {
    const { user } = useAuth();
    const supabase = createClient();
    const [achievements, setAchievements] = useState<AchievementItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchAchievements = async () => {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data && !error) {
                setAchievements(data);
            }
            setIsLoading(false);
        };

        fetchAchievements();

        // Optional: Subscribe to real-time additions (useful if sidebar tool adds them)
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setAchievements(prev => [payload.new as AchievementItem, ...prev]);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, supabase]);

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !user) return;

        setIsSaving(true);
        const newAchievement = {
            user_id: user.id,
            title,
            description,
            category: 'Manual Entry',
            source_type: 'manual',
            date: new Date().getFullYear().toString()
        };

        const { data, error } = await supabase
            .from('user_achievements')
            .insert([newAchievement])
            .select()
            .single();

        if (data && !error) {
            // Already handled by real-time subscription, but good for instant UI feedback
            // setAchievements([data, ...achievements]);
            setIsAdding(false);
            setTitle('');
            setDescription('');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        setAchievements(prev => prev.filter(a => a.id !== id));
        await supabase.from('user_achievements').delete().eq('id', id);
    };

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm relative overflow-hidden">
            {/* Thematic Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />

            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-emerald-400" />
                        Memory Block
                    </h2>
                    <p className="text-sm text-zinc-400">AI-extracted accomplishments and milestones.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-zinc-200"
                >
                    <Plus className={cn("w-4 h-4 mr-2 transition-transform", isAdding && "rotate-45")} />
                    Add Manual Entry
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-white/5 bg-black/20 overflow-hidden"
                    >
                        <form onSubmit={handleManualAdd} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Achievement Title</Label>
                                <Input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Won 1st Place at Weilliptic Hackathon"
                                    className="bg-zinc-950/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Details & Impact</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what you did and the impact..."
                                    className="bg-zinc-950/50 border-white/10 min-h-[80px]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                                <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Entry'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500/50" />
                        <span className="text-sm">Loading memories...</span>
                    </div>
                ) : achievements.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-zinc-950/30 relative">
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Sparkles className="w-5 h-5 text-emerald-500/50" />
                        </div>
                        <h3 className="text-zinc-200 font-medium mb-2">No Memories Found</h3>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                            Upload your resume, certificates, or LinkedIn profile via the Document Scanner tool, or add a manual entry.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {achievements.map((item) => (
                            <div key={item.id} className="group relative bg-zinc-950/30 border border-white/5 p-4 rounded-xl hover:bg-zinc-900/50 hover:border-white/10 transition-all">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-start gap-4 pr-12">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 mt-1">
                                        {item.source_type === 'resume' ? <FileText className="w-5 h-5 text-blue-400" /> :
                                            item.source_type === 'certificate' ? <Award className="w-5 h-5 text-purple-400" /> :
                                                item.source_type === 'linkedin' ? <FileText className="w-5 h-5 text-sky-400" /> :
                                                    <BrainCircuit className="w-5 h-5 text-emerald-400" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-zinc-100 font-semibold">{item.title}</h4>
                                            {item.source_type !== 'manual' && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                                                    AI Extracted
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                                                {item.category || 'General'}
                                            </span>
                                            {item.date && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {item.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MemoryBlock;
