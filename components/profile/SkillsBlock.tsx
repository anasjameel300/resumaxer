import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Cpu } from 'lucide-react';

interface SkillsBlockProps {
    skills: string[];
    onUpdate: (skills: string[]) => void;
}

const SkillsBlock: React.FC<SkillsBlockProps> = ({ skills, onUpdate }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAdd = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newSkill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onUpdate([...skills, trimmed]);
            setNewSkill('');
        }
    };

    const handleRemove = (skillToRemove: string) => {
        onUpdate(skills.filter(s => s !== skillToRemove));
    };

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-white/5 flex items-start justify-between">
                <div>
                    <h2 className="text-md font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        Skills Context
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-[200px] leading-relaxed">Manage the core skills that drive your AI analysis.</p>
                </div>
                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-1">
                    {skills.length} Skills
                </Badge>
            </div>
            <div className="p-4 space-y-5 flex-1 flex flex-col">
                <form onSubmit={handleAdd} className="flex gap-3">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. React.js, Python, Product Management"
                        className="bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 flex-1"
                    />
                    <Button type="submit" variant="secondary" className="bg-white text-black hover:bg-zinc-200">
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </form>

                <div className={skills.length === 0 ? "flex-1 flex" : "flex flex-wrap gap-2.5"}>
                    {skills.length === 0 ? (
                        <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-white/[0.02]">
                            <p className="text-xs text-zinc-500 py-6 text-center px-4 leading-relaxed">
                                No skills added yet.<br />Type one above to improve AI matching.
                            </p>
                        </div>
                    ) : (
                        skills.map(skill => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1.5 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/80 border border-white/5 flex items-center gap-2 transition-colors rounded-lg font-medium text-xs"
                            >
                                <span className="max-w-[140px] truncate" title={skill}>{skill}</span>
                                <button
                                    onClick={() => handleRemove(skill)}
                                    className="p-1 -mr-1 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors focus:outline-none shrink-0"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))
                    )}
                </div>
            </div>
        </Card>
    );
};

export default SkillsBlock;
