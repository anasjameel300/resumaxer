import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Plus, Loader2, Sparkles, FileText, Trash2, Calendar, Award, UploadCloud, X, FileSearch } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AchievementItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryBlockTool: React.FC = () => {
    const { user } = useAuth();
    const supabase = createClient();
    const [achievements, setAchievements] = useState<AchievementItem[]>([]);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
    const [isAddingManual, setIsAddingManual] = useState(false);

    // Manual Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSavingManual, setIsSavingManual] = useState(false);

    // Upload State
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'success' | 'error' | 'confirm'>('idle');
    const [uploadErrorMsg, setUploadErrorMsg] = useState('');
    const [pendingConfirmation, setPendingConfirmation] = useState<{ reason: string, achievements: any[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Fetch Timeline ───
    useEffect(() => {
        if (!user) return;

        const fetchAchievements = async () => {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data && !error) setAchievements(data);
            setIsLoadingTimeline(false);
        };

        fetchAchievements();

        // Realtime Subscription
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    // Only add if we don't already have it (debounce dups during direct inserts)
                    setAchievements(prev => {
                        const exists = prev.find(p => p.id === payload.new.id);
                        if (exists) return prev;
                        return [payload.new as AchievementItem, ...prev];
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, supabase]);

    // ─── Manual Add ───
    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !user) return;

        setIsSavingManual(true);
        const newAchievement = {
            user_id: user.id,
            title,
            description,
            category: 'Manual',
            source_type: 'manual',
            date: new Date().getFullYear().toString()
        };

        const { data, error } = await supabase.from('user_achievements').insert([newAchievement]).select().single();
        if (data && !error) {
            setIsAddingManual(false);
            setTitle('');
            setDescription('');
        }
        setIsSavingManual(false);
    };

    const handleDelete = async (id: string) => {
        setAchievements(prev => prev.filter(a => a.id !== id));
        await supabase.from('user_achievements').delete().eq('id', id);
    };

    // ─── File Upload Logic ───
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) processFileSelection(files[0]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) processFileSelection(files[0]);
    };

    const processFileSelection = (file: File) => {
        if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
            setUploadStatus('error');
            setUploadErrorMsg('Please upload a PDF or TXT file only.');
            return;
        }
        setSelectedFile(file);
        setUploadStatus('idle');
        setUploadErrorMsg('');
    };

    const saveAchievementsToDb = async (aiAchievements: any[], fileName: string) => {
        if (!user || aiAchievements.length === 0) return;

        const rowsToInsert = aiAchievements.map((item: any) => ({
            user_id: user.id,
            title: item.title,
            description: item.description,
            category: item.category,
            date: item.date,
            source_type: fileName.toLowerCase().includes('resume') ? 'resume' : 'certificate'
        }));

        const { error: dbError } = await supabase.from('user_achievements').insert(rowsToInsert);
        if (dbError) throw new Error("Failed to save achievements to database.");
    };

    const confirmPendingExtraction = async () => {
        if (!pendingConfirmation || !selectedFile) return;
        setIsProcessingFile(true);
        setUploadStatus('uploading');

        try {
            await saveAchievementsToDb(pendingConfirmation.achievements, selectedFile.name);
            setUploadStatus('success');
            setPendingConfirmation(null);
            setTimeout(() => {
                setSelectedFile(null);
                setUploadStatus('idle');
            }, 3000);
        } catch (err: any) {
            setUploadStatus('error');
            setUploadErrorMsg(err.message || 'Error saving confirmed achievements.');
        } finally {
            setIsProcessingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const cancelPendingExtraction = () => {
        setPendingConfirmation(null);
        setSelectedFile(null);
        setUploadStatus('idle');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processWithAI = async () => {
        if (!selectedFile || !user) return;

        setIsProcessingFile(true);
        setUploadStatus('uploading');
        setPendingConfirmation(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userName', user?.user_metadata?.full_name || user?.email || 'User');

            setUploadStatus('extracting');

            const res = await fetch('/api/document/parse', { method: 'POST', body: formData });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to process document');
            }

            if (result.status === 'REJECTED') {
                setUploadStatus('error');
                setUploadErrorMsg(result.reason || "This document was rejected by the verification system.");
                setIsProcessingFile(false);
                return;
            }

            const aiAchievements = result.achievements || [];
            if (aiAchievements.length === 0) {
                setUploadStatus('error');
                setUploadErrorMsg("We couldn't find any relevant achievements in this document.");
                setIsProcessingFile(false);
                return;
            }

            if (result.status === 'REQUIRES_CONFIRMATION') {
                setUploadStatus('confirm');
                setPendingConfirmation({ reason: result.reason, achievements: aiAchievements });
                setIsProcessingFile(false);
                return;
            }

            // SUCCESS case
            await saveAchievementsToDb(aiAchievements, selectedFile.name);

            setUploadStatus('success');
            setTimeout(() => {
                setSelectedFile(null);
                setUploadStatus('idle');
            }, 3000);

        } catch (err: any) {
            setUploadStatus('error');
            setUploadErrorMsg(err.message || 'An unexpected error occurred.');
        } finally {
            if (uploadStatus !== 'confirm') {
                setIsProcessingFile(false);
                if (fileInputRef.current && uploadStatus === 'success') fileInputRef.current.value = '';
            }
        }
    };


    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-emerald-400" />
                    Memory Block
                </h1>
                <p className="text-zinc-400 mt-2">
                    Build your achievement vault. Upload resumes, certificates, and more to let AI automatically extract and catalog your top milestones.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* ─── LEFT: DOMUMENT UPLOAD TOOL ─── */}
                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden sticky top-24">
                    <div className="p-6 border-b border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileSearch className="w-5 h-5 text-emerald-400" />
                            AI Document Scanner
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">Accepts PDF & TXT. Files are processed securely in-memory and never saved to disk.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {!selectedFile ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                                    isDragging ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                )}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.txt"
                                    onChange={handleFileSelect}
                                />
                                <div className="w-16 h-16 bg-zinc-950 border border-white/10 rounded-full flex items-center justify-center mb-4 shadow-xl">
                                    <UploadCloud className={cn("w-8 h-8", isDragging ? "text-emerald-400" : "text-zinc-500")} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Document Here</h3>
                                <p className="text-sm text-zinc-400 max-w-xs mx-auto mb-4">
                                    Upload a resume, certificate, or academic transcript.
                                </p>
                                <Button variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700 pointer-events-none">
                                    Browse Files
                                </Button>
                            </div>
                        ) : (
                            <div className="border border-white/10 rounded-2xl p-6 bg-black/20">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</h4>
                                            <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF/TXT</p>
                                        </div>
                                    </div>
                                    {!isProcessingFile && (
                                        <button onClick={() => setSelectedFile(null)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors bg-white/5 rounded-full hover:bg-red-500/10">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Status Visualizer */}
                                {isProcessingFile && (
                                    <div className="space-y-4 mb-6 relative">
                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-emerald-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: uploadStatus === 'extracting' ? "80%" : "30%" }}
                                                transition={{ duration: React.useId ? 2 : 20, ease: "easeOut" }} // simulate progress jump
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <span className={uploadStatus === 'uploading' ? 'text-emerald-400' : 'text-zinc-500'}>Uploading</span>
                                            <span className={uploadStatus === 'extracting' ? 'text-emerald-400 flex items-center gap-2' : 'text-zinc-500'}>
                                                {uploadStatus === 'extracting' && <Loader2 className="w-3 h-3 animate-spin" />}
                                                AI Parsing
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus === 'success' && (
                                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 shrink-0" />
                                        <p className="text-sm font-medium">Successfully extracted! Check your timeline.</p>
                                    </div>
                                )}

                                {uploadStatus === 'error' && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium leading-relaxed">
                                        <div className="font-bold mb-1 flex items-center gap-2">
                                            <X className="w-4 h-4" /> Extraction Failed
                                        </div>
                                        {uploadErrorMsg}
                                    </div>
                                )}

                                {uploadStatus === 'confirm' && pendingConfirmation && (
                                    <div className="mb-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <h4 className="text-amber-500 font-bold mb-2">Verification Incomplete</h4>
                                        <p className="text-amber-200/80 text-sm mb-4 leading-relaxed">{pendingConfirmation.reason}</p>
                                        <p className="text-amber-500/80 text-xs font-bold uppercase tracking-wider mb-4 border-t border-amber-500/20 pt-4">Do you still want to proceed?</p>
                                        <div className="flex gap-3">
                                            <Button onClick={confirmPendingExtraction} className="bg-amber-600 hover:bg-amber-700 text-white flex-1 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                                <span className="relative z-10">Yes, Extract it</span>
                                            </Button>
                                            <Button onClick={cancelPendingExtraction} variant="outline" className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10 flex-1">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {!isProcessingFile && uploadStatus !== 'success' && uploadStatus !== 'confirm' && (
                                    <Button
                                        onClick={processWithAI}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" /> Extract Achievements
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* ─── RIGHT: TIMELINE ─── */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden relative">
                        {/* Thematic Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    Timeline
                                </h2>
                                <p className="text-sm text-zinc-400">All your professional memories in one place.</p>
                            </div>
                            <Button
                                onClick={() => setIsAddingManual(!isAddingManual)}
                                size="sm"
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 text-zinc-200"
                            >
                                <Plus className={cn("w-4 h-4 mr-2 transition-transform", isAddingManual && "rotate-45")} />
                                Add Manual Entry
                            </Button>
                        </div>

                        <AnimatePresence>
                            {isAddingManual && (
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
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingManual(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                                            <Button type="submit" disabled={isSavingManual} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                                {isSavingManual ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Entry'}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-6">
                            {isLoadingTimeline ? (
                                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500/50" />
                                    <span className="text-sm">Loading timeline...</span>
                                </div>
                            ) : achievements.length === 0 ? (
                                <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-zinc-950/30 relative">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Sparkles className="w-5 h-5 text-indigo-500/50" />
                                    </div>
                                    <h3 className="text-zinc-200 font-medium mb-2">Timeline Empty</h3>
                                    <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                        Upload documents on the left scanner to start populating your memory block instantly.
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
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 mt-1",
                                                    item.source_type === 'manual' ? "bg-zinc-900 border-white/5 text-emerald-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                                )}>
                                                    {item.source_type === 'resume' ? <FileText className="w-5 h-5" /> :
                                                        item.source_type === 'certificate' ? <Award className="w-5 h-5" /> :
                                                            <BrainCircuit className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h4 className="text-zinc-100 font-bold">{item.title}</h4>
                                                        {item.source_type !== 'manual' && (
                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 uppercase tracking-wider font-bold">
                                                                AI Extracted
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                                            {item.category || 'General'}
                                                        </span>
                                                        {item.date && (
                                                            <span className="flex items-center gap-1.5 text-zinc-400">
                                                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
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
                </div>
            </div>
        </div>
    );
};

export default MemoryBlockTool;
