import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../types';

const STATUS_COLUMNS: { id: ApplicationStatus; label: string; color: string; icon: string }[] = [
    { id: 'Saved', label: 'Saved', color: 'bg-gray-100 border-gray-200', icon: '🔖' },
    { id: 'Applied', label: 'Applied', color: 'bg-blue-50 border-blue-200', icon: '📤' },
    { id: 'Interviewing', label: 'Interviewing', color: 'bg-purple-50 border-purple-200', icon: '🎤' },
    { id: 'Offer', label: 'Offer', color: 'bg-green-50 border-green-200', icon: '🎉' },
    { id: 'Rejected', label: 'Rejected', color: 'bg-red-50 border-red-200', icon: '🚫' },
];

const JobTracker: React.FC = () => {
    // Mock initial data - In a real app, this would come from props or a store
    const [applications, setApplications] = useState<JobApplication[]>([
        { id: '1', company: 'Google', role: 'Frontend Engineer', date: '2023-10-15', status: 'Applied', salary: '$150k' },
        { id: '2', company: 'Spotify', role: 'Product Designer', date: '2023-10-18', status: 'Saved' },
        { id: '3', company: 'Netflix', role: 'Senior React Dev', date: '2023-10-10', status: 'Interviewing', notes: 'Technical round next Tuesday' },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newJob, setNewJob] = useState<Partial<JobApplication>>({ status: 'Saved' });

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

    const updateStatus = (id: string, newStatus: ApplicationStatus) => {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const deleteApplication = (id: string) => {
        if (confirm('Are you sure you want to delete this application?')) {
            setApplications(apps => apps.filter(app => app.id !== id));
        }
    };

    return (
        <div className="h-full flex flex-col animate-fade-in pb-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Application Tracker</h2>
                    <p className="text-surface-500 mt-1">Manage your job search pipeline efficiently.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-900/20 flex items-center gap-2 transition-all"
                >
                    <span>+</span> Add Job
                </button>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Add New Application</h3>
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
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1200px] h-full pb-4">
                    {STATUS_COLUMNS.map(column => {
                        const columnApps = applications.filter(a => a.status === column.id);
                        return (
                            <div key={column.id} className="flex-1 flex flex-col min-w-[280px]">
                                <div className={`flex items-center justify-between p-3 rounded-t-xl border-t border-l border-r border-b-0 ${column.color}`}>
                                    <div className="flex items-center gap-2 font-bold text-surface-700">
                                        <span>{column.icon}</span>
                                        <span>{column.label}</span>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm text-surface-500">{columnApps.length}</span>
                                    </div>
                                </div>
                                <div className={`flex-1 bg-surface-50/50 p-3 rounded-b-xl border border-t-0 space-y-3 ${column.color.split(' ')[1]}`}>
                                    {columnApps.map(app => (
                                        <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-surface-200 hover:shadow-md transition-all group relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-surface-900">{app.company}</h4>
                                                <button onClick={() => deleteApplication(app.id)} className="text-surface-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                            </div>
                                            <div className="text-sm text-primary-600 font-medium mb-3">{app.role}</div>
                                            <div className="flex justify-between items-center text-xs text-surface-500">
                                                <span>{app.date}</span>
                                                {app.salary && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">{app.salary}</span>}
                                            </div>
                                            {app.notes && (
                                                <div className="mt-3 pt-3 border-t border-surface-100 text-xs text-surface-500 italic truncate">
                                                    "{app.notes}"
                                                </div>
                                            )}

                                            {/* Quick Move Dropdown */}
                                            <div className="mt-3 pt-2 border-t border-surface-100 flex items-center justify-between">
                                                <label className="text-[10px] font-bold uppercase text-surface-400">Move to:</label>
                                                <select
                                                    className="text-xs border-none bg-surface-50 rounded px-2 py-1 text-surface-600 font-medium focus:ring-0 cursor-pointer hover:bg-surface-100"
                                                    value={app.status}
                                                    onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                                                >
                                                    {STATUS_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {columnApps.length === 0 && (
                                        <div className="text-center py-8 text-surface-400 text-sm italic border-2 border-dashed border-surface-200/50 rounded-lg">
                                            No jobs
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