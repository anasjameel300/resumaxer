import React from 'react';
import { ResumeData } from '../../types';

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Redesigned Header */}
      <div className="relative bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
        
        <div className="relative px-8 md:px-12 pt-8 pb-8">
           <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                 <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg border border-surface-200">
                    <div className="w-full h-full bg-surface-50 rounded-full flex items-center justify-center text-5xl text-primary-300 font-bold overflow-hidden">
                       {data.fullName ? data.fullName.charAt(0).toUpperCase() : (
                         <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                       )}
                    </div>
                 </div>
                 {/* Status Indicator */}
                 <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full" title="Active"></div>
              </div>

              {/* Main Info */}
              <div className="flex-1 text-center md:text-left">
                 <h1 className="text-4xl font-extrabold text-surface-900 tracking-tight mb-2">
                    {data.fullName || "Guest User"}
                 </h1>
                 <div className="flex flex-col md:flex-row items-center gap-4 text-surface-500 font-medium justify-center md:justify-start">
                    <span className="flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       {data.email || "No email set"}
                    </span>
                    <span className="hidden md:inline w-1 h-1 bg-surface-300 rounded-full"></span>
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {data.phone || "No phone set"}
                    </span>
                 </div>
              </div>

              {/* Stats/Action */}
              <div className="flex items-center gap-4">
                 <div className="bg-surface-50 px-5 py-3 rounded-2xl border border-surface-100 text-center min-w-[100px]">
                    <div className="text-2xl font-bold text-surface-900">{data.experience.length}</div>
                    <div className="text-xs font-bold text-surface-400 uppercase">Roles</div>
                 </div>
                 <div className="bg-surface-50 px-5 py-3 rounded-2xl border border-surface-100 text-center min-w-[100px]">
                    <div className="text-2xl font-bold text-surface-900">{data.skills.length}</div>
                    <div className="text-xs font-bold text-surface-400 uppercase">Skills</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* LEFT COLUMN: Personal Info & Skills (4 cols) */}
         <div className="lg:col-span-4 space-y-8">
            {/* Personal Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-100">
                   <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </div>
                   <h3 className="text-lg font-bold text-surface-900">Edit Profile</h3>
                </div>
                
                <div className="space-y-5">
                    <div className="group">
                        <label className="text-xs font-bold text-surface-400 uppercase block mb-2 group-focus-within:text-primary-600 transition-colors">Display Name</label>
                        <input 
                            type="text" 
                            value={data.fullName}
                            onChange={(e) => updateField('fullName', e.target.value)}
                            placeholder="e.g. John Doe"
                            className="input-field bg-surface-50 focus:bg-white"
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-bold text-surface-400 uppercase block mb-2 group-focus-within:text-primary-600 transition-colors">Email Address</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="john@example.com"
                            className="input-field bg-surface-50 focus:bg-white"
                        />
                    </div>
                    <div className="group">
                        <label className="text-xs font-bold text-surface-400 uppercase block mb-2 group-focus-within:text-primary-600 transition-colors">Phone Number</label>
                        <input 
                            type="tel" 
                            value={data.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="input-field bg-surface-50 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 flex flex-col h-full max-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-surface-900">Skills</h3>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {data.skills.length}
                    </span>
                </div>
                
                <div className="flex-1 flex flex-col">
                    <label className="text-xs font-bold text-surface-400 uppercase block mb-2">
                        Comma-separated list
                    </label>
                    <textarea 
                        className="input-field flex-1 resize-none text-sm leading-relaxed p-4 min-h-[150px]"
                        placeholder="e.g. React, Node.js, Leadership, Strategic Planning..."
                        value={data.skills.join(', ')}
                        onChange={handleSkillsChange}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {data.skills.slice(0, 5).map((skill, i) => (
                             <span key={i} className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded border border-surface-200">
                                {skill}
                             </span>
                        ))}
                        {data.skills.length > 5 && (
                             <span className="text-xs text-surface-400 py-1">+ {data.skills.length - 5} more</span>
                        )}
                    </div>
                </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Summary & Experience (8 cols) */}
         <div className="lg:col-span-8 space-y-8">
            {/* Summary Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-surface-900">Professional Summary</h3>
                </div>
                <textarea 
                    className="input-field h-40 resize-none text-sm leading-7 text-surface-700 p-4 border-surface-300 focus:border-amber-500 focus:ring-amber-500/20"
                    placeholder="Write a compelling summary that highlights your key achievements and career goals..."
                    value={data.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                />
            </div>

            {/* Experience Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-surface-900">Career History</h3>
                    </div>
                </div>
                
                {data.experience.length === 0 ? (
                    <div className="text-center py-16 bg-surface-50 rounded-2xl border-2 border-dashed border-surface-200">
                        <div className="text-5xl mb-4 opacity-50">🏢</div>
                        <h4 className="text-lg font-bold text-surface-900 mb-2">No Experience Added</h4>
                        <p className="text-surface-500 max-w-sm mx-auto mb-6">Your resume is looking a bit empty. Add your work history in the Builder to populate this section.</p>
                        <p className="text-sm font-semibold text-primary-600">Go to Resume Builder &rarr;</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="relative pl-8 border-l-2 border-surface-100 last:border-0 pb-2 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-surface-300 group-hover:border-primary-500 transition-colors"></div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                    <h4 className="font-bold text-lg text-surface-900 group-hover:text-primary-600 transition-colors">{exp.role || "Untitled Role"}</h4>
                                    <span className="text-sm font-medium text-surface-500 bg-surface-50 px-3 py-1 rounded-full border border-surface-100">
                                        {exp.duration || "Dates"}
                                    </span>
                                </div>
                                <div className="text-base font-semibold text-surface-700 mb-3">{exp.company || "Company"}</div>
                                <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line bg-surface-50 p-4 rounded-xl border border-surface-100 group-hover:border-primary-100 transition-colors">
                                    {exp.details || "No description provided."}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;