import React, { useState, useRef } from 'react';
import { JobApplication, ApplicationStatus } from '../types';

const STATUS_COLUMNS: { id: ApplicationStatus; label: string; color: string; icon: string }[] = [
    { id: 'Saved', label: 'Saved', color: 'bg-gray-100 border-gray-200', icon: '🔖' },
    { id: 'Applied', label: 'Applied', color: 'bg-blue-50 border-blue-200', icon: '📤' },
    { id: 'Interviewing', label: 'Interviewing', color: 'bg-purple-50 border-purple-200', icon: '🎤' },
    { id: 'Offer', label: 'Offer', color: 'bg-green-50 border-green-200', icon: '🎉' },
    { id: 'Rejected', label: 'Rejected', color: 'bg-red-50 border-red-200', icon: '🚫' },
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
        // Transparent drag image hack if needed, but default is usually fine
    };

    const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
        e.preventDefault(); // Necessary to allow dropping
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
        <div className="h-full flex flex-col animate-fade-in pb-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Application Tracker</h2>
                    <p className="text-surface-500 mt-1">Drag and drop cards to update your progress.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-900/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    <span>+</span> Add Job
                </button>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100">
                        <h3 className="text-xl font-bold mb-4 text-surface-900">Add New Application</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-surface-500 uppercase">Company</label>
                                <input type="text" className="input-field" autoFocus value={newJob.company || ''} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="e.g. Airbnb" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-surface-500 uppercase">Role</label>
                                <input type="text" className="input-field" value={newJob.role || ''} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-surface-500 uppercase">Salary (Optional)</label>
                                    <input type="text" className="input-field" value={newJob.salary || ''} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g. $120k" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-surface-500 uppercase">Status</label>
                                    <select className="input-field" value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value as ApplicationStatus })}>
                                        {STATUS_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-surface-500 uppercase">Notes</label>
                                <textarea className="input-field h-20 resize-none" value={newJob.notes || ''} onChange={e => setNewJob({ ...newJob, notes: e.target.value })} placeholder="Referral, key contacts, etc." />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-surface-600 font-bold hover:bg-surface-50 rounded-xl transition-colors">Cancel</button>
                            <button onClick={addApplication} className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-md transition-colors">Save Job</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-[1200px] h-full">
                    {STATUS_COLUMNS.map(column => {
                        const columnApps = applications.filter(a => a.status === column.id);
                        const isOver = dragOverColumn === column.id;

                        return (
                            <div
                                key={column.id}
                                className="flex-1 flex flex-col min-w-[280px] h-full"
                                onDragOver={(e) => handleDragOver(e, column.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, column.id)}
                            >
                                {/* Column Header */}
                                <div className={`flex items-center justify-between p-4 rounded-t-xl border-t border-l border-r border-b-0 shadow-sm z-10 ${column.color}`}>
                                    <div className="flex items-center gap-2 font-bold text-surface-700">
                                        <span className="text-lg">{column.icon}</span>
                                        <span>{column.label}</span>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm text-surface-500 min-w-[24px] text-center">{columnApps.length}</span>
                                    </div>
                                </div>

                                {/* Drop Zone / Content Area */}
                                <div className={`flex-1 p-3 rounded-b-xl border border-t-0 space-y-3 transition-colors duration-200 
                        ${column.color.split(' ')[1]} 
                        ${isOver ? 'bg-primary-50/80 ring-2 ring-primary-300 ring-inset' : 'bg-surface-50/50'}
                    `}>
                                    {columnApps.map(app => (
                                        <div
                                            key={app.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, app.id)}
                                            className={`bg-white p-4 rounded-xl shadow-sm border border-surface-200 hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing
                                    ${draggedId === app.id ? 'opacity-50 rotate-3 scale-95' : 'hover:-translate-y-1'}
                                `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-surface-900 leading-tight">{app.company}</h4>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteApplication(app.id); }}
                                                    className="text-surface-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-2 -mr-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                            <div className="text-sm text-primary-600 font-medium mb-3">{app.role}</div>
                                            <div className="flex justify-between items-center text-xs text-surface-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {app.date}
                                                </span>
                                                {app.salary && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold">{app.salary}</span>}
                                            </div>
                                            {app.notes && (
                                                <div className="mt-3 pt-3 border-t border-surface-100 text-xs text-surface-500 italic truncate flex items-center gap-1">
                                                    <svg className="w-3 h-3 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    {app.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {columnApps.length === 0 && (
                                        <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-surface-200/50 rounded-lg">
                                            <span className="text-surface-400 text-sm italic">Drop here</span>
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