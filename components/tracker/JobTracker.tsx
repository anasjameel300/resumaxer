import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  CalendarDays,
  DollarSign,
  Briefcase,
  Plus,
  X,
  MoreVertical,
  Trash2,
  Bookmark,
  Send,
  MessageSquare,
  CheckCircle2,
  XCircle,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLUMNS: { id: ApplicationStatus; label: string; color: string; icon: React.ReactNode; border: string }[] = [
  { id: 'Saved', label: 'Saved', color: 'from-gray-500/20 to-gray-600/5', border: 'border-gray-500/50', icon: <Bookmark className="w-4 h-4 text-gray-400" /> },
  { id: 'Applied', label: 'Applied', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/50', icon: <Send className="w-4 h-4 text-blue-400" /> },
  { id: 'Interviewing', label: 'Interviewing', color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/50', icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
  { id: 'Offer', label: 'Offer', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/50', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
  { id: 'Rejected', label: 'Rejected', color: 'from-red-500/20 to-red-600/5', border: 'border-red-500/50', icon: <XCircle className="w-4 h-4 text-red-400" /> },
];

const JobTracker: React.FC = () => {
  // Mock initial data
  const [applications, setApplications] = useState<JobApplication[]>([
    { id: '1', company: 'Google', role: 'Frontend Engineer', date: '2023-10-15', status: 'Applied', salary: '$150k' },
    { id: '2', company: 'Spotify', role: 'Product Designer', date: '2023-10-18', status: 'Saved' },
    { id: '3', company: 'Netflix', role: 'Senior React Dev', date: '2023-10-10', status: 'Interviewing', notes: 'Technical round next Tuesday' },
    { id: '4', company: 'Amazon', role: 'SDE II', date: '2023-10-20', status: 'Rejected', notes: 'Freezed hiring' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState<Partial<JobApplication>>({ status: 'Saved' });

  // Drag and Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ApplicationStatus | null>(null);

  const addApplication = () => {
    if (!newJob.company || !newJob.role) return;
    const job: JobApplication = {
      id: Date.now().toString(),
      company: newJob.company,
      role: newJob.role,
      date: new Date().toISOString().split('T')[0],
      status: newJob.status as ApplicationStatus || 'Saved',
      salary: newJob.salary,
      notes: newJob.notes
    };
    setApplications([...applications, job]);
    setNewJob({ status: 'Saved' });
    setIsAdding(false);
  };

  const deleteApplication = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      setApplications(apps => apps.filter(app => app.id !== id));
    }
  };

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedId) return;

    setApplications(apps =>
      apps.map(app =>
        app.id === draggedId ? { ...app, status: newStatus } : app
      )
    );
    setDraggedId(null);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            Job Board
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">Visualize your application pipeline.</p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Application
        </Button>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-white" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4" />
              </Button>

              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> New Job
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input autoFocus value={newJob.company || ''} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="e.g. Acme Corp" className="pl-9 bg-zinc-950/50 border-white/10" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input value={newJob.role || ''} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="e.g. Senior Engineer" className="pl-9 bg-zinc-950/50 border-white/10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input value={newJob.salary || ''} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="$140k" className="pl-9 bg-zinc-950/50 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newJob.status}
                      onChange={e => setNewJob({ ...newJob, status: e.target.value as ApplicationStatus })}
                    >
                      {STATUS_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Notes</Label>
                  <Textarea
                    className="h-24 resize-none bg-zinc-950/50 border-white/10"
                    value={newJob.notes || ''}
                    onChange={e => setNewJob({ ...newJob, notes: e.target.value })}
                    placeholder="Hiring manager context, referral info..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1 border-white/10 hover:bg-white/5">Cancel</Button>
                <Button onClick={addApplication} className="flex-1">Create Card</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <div className="flex gap-6 min-w-[1200px] h-full px-1">
          {STATUS_COLUMNS.map(column => {
            const columnApps = applications.filter(a => a.status === column.id);
            const isOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className="flex-1 flex flex-col min-w-[260px] h-full"
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-t-xl backdrop-blur-sm border-t border-x border-b-0 transition-colors",
                  "bg-gradient-to-b border-white/5",
                  column.color
                )}>
                  <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    {column.icon}
                    <span>{column.label}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">{columnApps.length}</Badge>
                </div>

                {/* Drop Zone */}
                <div className={cn(
                  "flex-1 p-3 rounded-b-xl border border-t-0 space-y-3 transition-colors duration-200 bg-zinc-900/20",
                  "border-white/5",
                  isOver && "bg-white/5 ring-1 ring-inset ring-white/10"
                )}>
                  {columnApps.map(app => (
                    <motion.div
                      layoutId={app.id}
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, app.id)}
                      className={cn(
                        "bg-zinc-900 p-4 rounded-xl border border-white/5 hover:border-white/20 shadow-sm transition-all group relative cursor-grab active:cursor-grabbing",
                        draggedId === app.id ? 'opacity-30' : 'hover:shadow-md hover:-translate-y-1'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-foreground leading-tight">{app.company}</h4>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteApplication(app.id); }}
                          className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-2 -mr-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">{app.role}</div>

                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3" />
                          {app.date}
                        </span>
                        {app.salary && <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-green-500/30 text-green-400 bg-green-500/10">{app.salary}</Badge>}
                      </div>

                      {app.notes && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-400 italic truncate flex items-center gap-1.5">
                          <GripVertical className="w-3 h-3 text-zinc-600" />
                          {app.notes}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg">
                      <span className="text-zinc-600 text-xs font-medium">Empty</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
