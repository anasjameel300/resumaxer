import React from 'react';
import { ResumeData, TemplateId } from '../../types';

interface ResumePreviewProps {
    data: ResumeData;
    template: TemplateId;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
    const safeData = {
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        socialLinks: data.socialLinks || [],
        languages: data.languages || [],
        summary: data.summary || "",
        experience: data.experience || [],
        projects: data.projects || [],
        education: data.education || [],
        skills: data.skills || [],
        achievements: data.achievements || [],
        themeColor: data.themeColor || '#4f46e5',
        font: data.font || 'sans'
    };

    let fontClass = "font-sans";
    if (safeData.font === 'serif') fontClass = "font-serif";
    if (safeData.font === 'mono') fontClass = "font-mono";

    // Changed h-full to min-h-full and removed overflow-hidden to prevent cutting off content
    const containerClass = `w-full min-h-[297mm] bg-white text-left relative box-border ${fontClass}`;

    switch (template) {
        case 'classic': return <div className={containerClass}><ClassicTemplate data={safeData} /></div>;
        case 'creative': return <div className={containerClass}><CreativeTemplate data={safeData} /></div>;
        case 'minimalist': return <div className={containerClass}><MinimalistTemplate data={safeData} /></div>;
        case 'standard': return <div className={containerClass}><StandardTemplate data={safeData} /></div>;
        case 'executive': return <div className={containerClass}><ExecutiveTemplate data={safeData} /></div>;
        case 'compact': return <div className={containerClass}><CompactTemplate data={safeData} /></div>;
        case 'elegant': return <div className={containerClass}><ElegantTemplate data={safeData} /></div>;
        case 'timeline': return <div className={containerClass}><TimelineTemplate data={safeData} /></div>;
        case 'modern':
        default: return <div className={containerClass}><ModernTemplate data={safeData} /></div>;
    }
};

export default ResumePreview;

// --- SHARED COMPONENTS ---
const SectionTitle: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = "", style }) => (
    <h2 className={`text-sm font-bold uppercase tracking-[0.15em] mb-4 ${className}`} style={style}>{children}</h2>
);

const Socials = ({ data, className = "flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium" }: { data: any, className?: string }) => (
    <div className={className}>
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
        {data.socialLinks.filter((l: any) => l.url).map((link: any, i: number) => (
             <span key={i}><a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">{link.platform}</a></span>
        ))}
    </div>
);

const LanguagesSection = ({ languages, styleTitle, className = "mt-4" }: { languages: any[], styleTitle?: React.CSSProperties, className?: string }) => {
    if (!languages || languages.length === 0) return null;
    return (
        <section className={className}>
             <SectionTitle className="border-b pb-2" style={styleTitle}>Languages</SectionTitle>
             <div className="flex flex-wrap gap-4 mt-2">
                 {languages.map((l, i) => (
                     <div key={i} className="text-sm">
                         <span className="font-bold">{l.language}</span> <span className="text-gray-500 text-xs">({l.proficiency})</span>
                     </div>
                 ))}
             </div>
        </section>
    )
}

const ProjectsSection = ({ projects, styleTitle, themeColor, className = "mt-6" }: { projects: any[], styleTitle?: React.CSSProperties, themeColor: string, className?: string }) => {
    if (!projects || projects.length === 0) return null;
    return (
        <section className={className}>
            <SectionTitle className="border-b pb-2" style={styleTitle}>Projects</SectionTitle>
            <div className="space-y-4 mt-4">
                {projects.map((proj, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base">{proj.title}</h3>
                            {proj.technologies && <span className="text-xs font-medium text-gray-500">{proj.technologies}</span>}
                        </div>
                        {proj.link && <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} className="text-xs text-blue-600 hover:underline block mb-1">{proj.link}</a>}
                        <ul className="list-disc ml-4 text-sm space-y-1 text-gray-800">
                            {proj.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

const AchievementsSection = ({ achievements, styleTitle, className = "mt-6" }: { achievements: string[], styleTitle?: React.CSSProperties, className?: string }) => {
    if (!achievements || achievements.length === 0) return null;
    return (
        <section className={className}>
            <SectionTitle className="border-b pb-2" style={styleTitle}>Achievements</SectionTitle>
            <ul className="list-disc ml-4 text-sm space-y-1 text-gray-800">
                {achievements.filter(a => a.trim()).map((a, i) => (
                    <li key={i}>{a}</li>
                ))}
            </ul>
        </section>
    );
}

// --- TEMPLATE 1: MODERN ---
const ModernTemplate = ({ data }: { data: any }) => (
    <div className="p-10 min-h-full flex flex-col">
        <header className="border-b-2 border-slate-100 pb-8 mb-8 flex justify-between items-start">
            <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">{data.fullName || "Your Name"}</h1>
                <Socials data={data} />
            </div>
            <div className="w-16 h-16 text-white flex items-center justify-center text-2xl font-bold rounded-xl shadow-lg" style={{ backgroundColor: data.themeColor }}>
                 {data.fullName ? data.fullName.charAt(0) : "R"}
            </div>
        </header>

        <div className="flex-1 space-y-8">
            {data.summary && (
                <section>
                    <SectionTitle className="border-b pb-2" style={{ color: data.themeColor, borderColor: `${data.themeColor}33` }}>Professional Summary</SectionTitle>
                    <p className="text-sm leading-relaxed text-slate-600 text-justify">{data.summary}</p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section>
                    <SectionTitle className="border-b pb-2" style={{ color: data.themeColor, borderColor: `${data.themeColor}33` }}>Work Experience</SectionTitle>
                    <div className="space-y-6 mt-4">
                        {data.experience.map((exp: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-4">
                                <div className="col-span-3 text-xs font-bold text-slate-400 uppercase pt-1">{exp.duration}</div>
                                <div className="col-span-9">
                                    <h3 className="font-bold text-slate-900 text-lg">{exp.role}</h3>
                                    <div className="font-semibold text-sm mb-2" style={{ color: data.themeColor }}>{exp.company}</div>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <ProjectsSection projects={data.projects} styleTitle={{ color: data.themeColor, borderColor: `${data.themeColor}33` }} themeColor={data.themeColor} />

            {data.education.length > 0 && (
                <section>
                    <SectionTitle className="border-b pb-2" style={{ color: data.themeColor, borderColor: `${data.themeColor}33` }}>Education</SectionTitle>
                     <div className="space-y-4 mt-4">
                        {data.education.map((edu: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div><h3 className="font-bold text-slate-900">{edu.school}</h3><p className="text-sm text-slate-600">{edu.degree}</p></div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.skills.length > 0 && (
                <section>
                    <SectionTitle className="border-b pb-2" style={{ color: data.themeColor, borderColor: `${data.themeColor}33` }}>Technical Skills</SectionTitle>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {data.skills.map((skill: string, i: number) => (
                            <span key={i} className="bg-slate-50 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200">{skill}</span>
                        ))}
                    </div>
                </section>
            )}

            <AchievementsSection achievements={data.achievements} styleTitle={{ color: data.themeColor, borderColor: `${data.themeColor}33` }} />
            <LanguagesSection languages={data.languages} styleTitle={{ color: data.themeColor, borderColor: `${data.themeColor}33` }} />
        </div>
    </div>
);

// --- TEMPLATE 2: CLASSIC ---
const ClassicTemplate = ({ data }: { data: any }) => (
    <div className="p-12 min-h-full max-w-full leading-relaxed">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-4 border-b-2 pb-4" style={{ borderColor: 'black' }}>{data.fullName || "Your Name"}</h1>
            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-700 font-medium italic">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.location && <span>{data.location}</span>}
                {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i}><a href={l.url}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="space-y-6">
            {data.summary && <section><h2 className="text-sm font-bold uppercase border-b mb-3 tracking-widest text-gray-800" style={{ borderColor: '#9ca3af' }}>Professional Profile</h2><p className="text-sm text-justify">{data.summary}</p></section>}
            {data.experience.length > 0 && <section><h2 className="text-sm font-bold uppercase border-b mb-4 tracking-widest text-gray-800" style={{ borderColor: '#9ca3af' }}>Experience</h2><div className="space-y-6">{data.experience.map((exp:any, idx:number) => (<div key={idx}><div className="flex justify-between items-baseline mb-1"><h3 className="font-bold text-base text-black">{exp.company}</h3><span className="text-sm font-medium">{exp.duration}</span></div><div className="text-sm font-bold italic text-gray-700 mb-2">{exp.role}</div><p className="text-sm text-gray-800 whitespace-pre-line pl-2 border-l-2 border-gray-200">{exp.details}</p></div>))}</div></section>}
            <ProjectsSection projects={data.projects} styleTitle={{ borderColor: '#9ca3af' }} themeColor={data.themeColor} />
            {data.education.length > 0 && <section><h2 className="text-sm font-bold uppercase border-b mb-4 tracking-widest text-gray-800" style={{ borderColor: '#9ca3af' }}>Education</h2><div className="space-y-3">{data.education.map((edu:any, idx:number) => (<div key={idx} className="flex justify-between items-end"><div><h3 className="font-bold text-sm text-black">{edu.school}</h3><div className="text-sm italic text-gray-700">{edu.degree}</div></div><span className="text-sm font-medium">{edu.year}</span></div>))}</div></section>}
            {data.skills.length > 0 && <section><h2 className="text-sm font-bold uppercase border-b mb-3 tracking-widest text-gray-800" style={{ borderColor: '#9ca3af' }}>Key Competencies</h2><div className="text-sm leading-relaxed flex flex-wrap gap-x-6 gap-y-2">{data.skills.map((skill:string, i:number) => (<div key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black rounded-full"></span><span>{skill}</span></div>))}</div></section>}
            <AchievementsSection achievements={data.achievements} styleTitle={{ borderColor: '#9ca3af' }} />
            <LanguagesSection languages={data.languages} styleTitle={{ borderColor: '#9ca3af' }} />
        </div>
    </div>
);

// --- TEMPLATE 3: CREATIVE ---
const CreativeTemplate = ({ data }: { data: any }) => (
    <div className="flex min-h-[297mm] bg-white h-auto">
        <div className="w-[32%] text-slate-300 p-8 flex flex-col gap-8 flex-shrink-0" style={{ backgroundColor: '#0f172a' }}>
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl border-4 border-slate-800" style={{ backgroundColor: data.themeColor }}>{data.fullName ? data.fullName.charAt(0).toUpperCase() : "ME"}</div>
                <div className="space-y-3 text-xs w-full">
                    {data.email && <div>{data.email}</div>}
                    {data.phone && <div>{data.phone}</div>}
                    {data.location && <div>{data.location}</div>}
                    {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <div key={i}><a href={l.url} className="text-white hover:underline">{l.platform}</a></div>)}
                </div>
             </div>
             {data.skills.length > 0 && <div className="flex-1"><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-slate-700 pb-2 mb-4">Expertise</h3><div className="flex flex-wrap gap-2">{data.skills.map((skill:string, i:number) => <span key={i} className="bg-slate-800 text-slate-200 px-2 py-1.5 rounded text-[10px] font-semibold border border-slate-700">{skill}</span>)}</div></div>}
             <AchievementsSection achievements={data.achievements} styleTitle={{ color: 'white', borderColor: '#334155' }} className="text-slate-300" />
             {data.languages.length > 0 && <div><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-slate-700 pb-2 mb-4">Languages</h3><div className="space-y-2">{data.languages.map((l:any, i:number) => <div key={i} className="text-xs"><span className="text-white block">{l.language}</span><span className="text-slate-500">{l.proficiency}</span></div>)}</div></div>}
        </div>
        <div className="w-[68%] p-10 flex flex-col">
            <div className="mb-10"><h1 className="text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-2">{data.fullName?.split(" ")[0]} <span style={{ color: data.themeColor }}>{data.fullName?.split(" ").slice(1).join(" ")}</span></h1></div>
            {data.summary && <div className="mb-10"><h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-3 flex items-center gap-2"><span className="w-8 h-1" style={{ backgroundColor: data.themeColor }}></span> Profile</h3><p className="text-sm leading-7 text-slate-600">{data.summary}</p></div>}
            {data.experience.length > 0 && <div className="mb-8"><h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><span className="w-8 h-1" style={{ backgroundColor: data.themeColor }}></span> Experience</h3><div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">{data.experience.map((exp:any, idx:number) => (<div key={idx} className="relative pl-8"><div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: data.themeColor }}></div><h4 className="font-bold text-lg text-slate-900">{exp.role}</h4><div className="flex items-center gap-2 text-xs font-bold uppercase mb-2" style={{ color: data.themeColor }}><span>{exp.company}</span><span className="text-slate-300">|</span><span>{exp.duration}</span></div><p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.details}</p></div>))}</div></div>}
            
            {data.projects && data.projects.length > 0 && (
                 <div className="mb-8">
                     <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><span className="w-8 h-1" style={{ backgroundColor: data.themeColor }}></span> Projects</h3>
                     <div className="space-y-6">
                        {data.projects.map((proj: any, idx: number) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg text-slate-900">{proj.title}</h4>
                                    <span className="text-xs font-bold uppercase" style={{ color: data.themeColor }}>{proj.technologies}</span>
                                </div>
                                {proj.link && <a href={`https://${proj.link}`} className="text-xs text-slate-400 block mb-2">{proj.link}</a>}
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{proj.details}</p>
                            </div>
                        ))}
                     </div>
                 </div>
            )}

            {data.education.length > 0 && <div className="mt-2"><h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><span className="w-8 h-1" style={{ backgroundColor: data.themeColor }}></span> Education</h3><div className="space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx} className="flex justify-between items-end border-b border-slate-100 pb-2"><div><h4 className="font-bold text-lg text-slate-900">{edu.school}</h4><div className="text-sm text-slate-600">{edu.degree}</div></div><span className="font-bold text-sm" style={{ color: data.themeColor }}>{edu.year}</span></div>))}</div></div>}
        </div>
    </div>
);

// --- TEMPLATE 4: MINIMALIST ---
const MinimalistTemplate = ({ data }: { data: any }) => (
    <div className="p-12 min-h-full max-w-full">
        <div className="text-center mb-12">
            <h1 className="text-4xl tracking-[0.2em] mb-4 uppercase" style={{ color: data.themeColor }}>{data.fullName || "Your Name"}</h1>
            <div className="flex justify-center flex-wrap gap-4 text-xs tracking-widest text-gray-500">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span className="border-l border-gray-400 pl-4">{data.phone}</span>}
                {data.location && <span className="border-l border-gray-400 pl-4">{data.location}</span>}
                {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i} className="border-l border-gray-400 pl-4"><a href={l.url}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="space-y-8">
            {data.summary && <section><div className="flex items-center gap-4 mb-4"><div className="flex-1 h-px bg-gray-300"></div><h2 className="uppercase tracking-widest text-sm font-bold" style={{ color: data.themeColor }}>Summary</h2><div className="flex-1 h-px bg-gray-300"></div></div><p className="text-xs leading-6 text-center max-w-2xl mx-auto">{data.summary}</p></section>}
            {data.experience.length > 0 && <section><div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-gray-300"></div><h2 className="uppercase tracking-widest text-sm font-bold" style={{ color: data.themeColor }}>Experience</h2><div className="flex-1 h-px bg-gray-300"></div></div><div className="space-y-6">{data.experience.map((exp:any, idx:number) => (<div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4"><div className="md:col-span-1 text-xs text-gray-500 pt-1 text-center md:text-left">{exp.duration}</div><div className="md:col-span-3"><h3 className="text-sm font-bold uppercase tracking-wide">{exp.role}</h3><div className="text-xs italic mb-2" style={{ color: data.themeColor }}>{exp.company}</div><p className="text-xs leading-5 whitespace-pre-line">{exp.details}</p></div></div>))}</div></section>}
            
            {data.projects && data.projects.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-gray-300"></div><h2 className="uppercase tracking-widest text-sm font-bold" style={{ color: data.themeColor }}>Projects</h2><div className="flex-1 h-px bg-gray-300"></div></div>
                    <div className="space-y-6">
                        {data.projects.map((proj: any, idx: number) => (
                            <div key={idx} className="text-center">
                                <h3 className="text-sm font-bold uppercase tracking-wide">{proj.title}</h3>
                                {proj.technologies && <div className="text-xs italic text-gray-500 mb-1">{proj.technologies}</div>}
                                <p className="text-xs leading-5 whitespace-pre-line max-w-2xl mx-auto">{proj.details}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <AchievementsSection achievements={data.achievements} styleTitle={{ color: data.themeColor, textAlign: 'center', borderBottom: 'none' }} className="text-center" />

            {data.education.length > 0 && <section><div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-gray-300"></div><h2 className="uppercase tracking-widest text-sm font-bold" style={{ color: data.themeColor }}>Education</h2><div className="flex-1 h-px bg-gray-300"></div></div><div className="space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx} className="text-center"><h3 className="text-sm font-bold uppercase tracking-wide">{edu.school}</h3><div className="text-xs italic text-gray-500">{edu.degree} <span className="mx-1">•</span> {edu.year}</div></div>))}</div></section>}
            <LanguagesSection languages={data.languages} styleTitle={{ color: data.themeColor, textAlign: 'center', borderBottom: 'none' }} className="text-center" />
        </div>
    </div>
);

// --- TEMPLATE 5: STANDARD ---
const StandardTemplate = ({ data }: { data: any }) => (
    <div className="p-12 min-h-full max-w-full">
        <div className="mb-8 pb-4 border-b border-gray-300">
            <h1 className="text-3xl font-bold mb-2" style={{ color: data.themeColor }}>{data.fullName || "Your Name"}</h1>
            <div className="text-sm text-gray-600 flex gap-4 flex-wrap">
                {data.location && <span>{data.location}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.email && <span>{data.email}</span>}
                {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i}><a href={l.url} style={{ color: data.themeColor }}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="space-y-6">
            {data.summary && <section><h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Summary</h2><p className="text-sm leading-relaxed">{data.summary}</p></section>}
            {data.skills.length > 0 && <section><h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Skills</h2><div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">{data.skills.map((skill:string, i:number) => (<div key={i} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: data.themeColor }}></span>{skill}</div>))}</div></section>}
            {data.experience.length > 0 && <section><h2 className="text-sm font-bold uppercase text-gray-500 mb-4">Experience</h2><div className="space-y-5">{data.experience.map((exp:any, idx:number) => (<div key={idx}><div className="flex justify-between items-baseline mb-1"><h3 className="font-bold text-base">{exp.role}</h3><span className="text-sm text-gray-500">{exp.duration}</span></div><div className="text-sm font-semibold mb-2" style={{ color: data.themeColor }}>{exp.company}</div><ul className="list-disc ml-4 text-sm space-y-1 text-gray-800">{exp.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}</ul></div>))}</div></section>}
            <ProjectsSection projects={data.projects} styleTitle={{ color: '#6b7280' }} themeColor={data.themeColor} />
            <AchievementsSection achievements={data.achievements} styleTitle={{ color: '#6b7280' }} />
            {data.education.length > 0 && <section><h2 className="text-sm font-bold uppercase text-gray-500 mb-4">Education</h2><div className="space-y-3">{data.education.map((edu:any, idx:number) => (<div key={idx} className="flex justify-between items-baseline"><div><h3 className="font-bold text-sm">{edu.school}</h3><div className="text-sm text-gray-600 italic">{edu.degree}</div></div><span className="text-sm text-gray-500">{edu.year}</span></div>))}</div></section>}
            <LanguagesSection languages={data.languages} styleTitle={{ color: data.themeColor }} />
        </div>
    </div>
);

// --- TEMPLATE 6: EXECUTIVE ---
const ExecutiveTemplate = ({ data }: { data: any }) => (
    <div className="bg-white min-h-full max-w-full flex flex-col">
        <div className="h-4 w-full flex-shrink-0" style={{ backgroundColor: data.themeColor }}></div>
        <header className="px-10 py-8 bg-slate-50 border-b border-gray-200 flex items-center gap-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 overflow-hidden border-4 border-white shadow-sm">
                <span className="text-3xl font-bold text-white w-full h-full flex items-center justify-center" style={{ backgroundColor: data.themeColor }}>{data.fullName ? data.fullName.charAt(0) : "IMG"}</span>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.fullName || "Your Name"}</h1>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                     {data.email && <div>✉ {data.email}</div>}
                     {data.phone && <div>📞 {data.phone}</div>}
                     {data.location && <div>📍 {data.location}</div>}
                     {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <div key={i}>🌐 <a href={l.url}>{l.platform}</a></div>)}
                </div>
            </div>
        </header>
        <div className="flex flex-1">
             <aside className="w-[30%] bg-slate-100 p-8 border-r border-gray-200">
                {data.skills.length > 0 && <div className="mb-8"><h3 className="font-bold uppercase text-slate-700 mb-4 border-b border-slate-300 pb-1 text-sm" style={{ color: data.themeColor }}>Skills</h3><div className="flex flex-col gap-2">{data.skills.map((skill:string, i:number) => <span key={i} className="text-sm font-medium text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">{skill}</span>)}</div></div>}
                <LanguagesSection languages={data.languages} styleTitle={{ color: data.themeColor }} className="mb-8" />
                <AchievementsSection achievements={data.achievements} styleTitle={{ color: data.themeColor }} className="mb-8" />
                {data.education.length > 0 && <div><h3 className="font-bold uppercase text-slate-700 mb-4 border-b border-slate-300 pb-1 text-sm" style={{ color: data.themeColor }}>Education</h3><div className="space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx}><div className="font-bold text-sm text-slate-800">{edu.degree}</div><div className="text-xs text-slate-600">{edu.school}</div><div className="text-xs text-slate-500 italic mt-1">{edu.year}</div></div>))}</div></div>}
             </aside>
             <main className="w-[70%] p-8">
                 {data.summary && <section className="mb-8"><h3 className="font-bold text-lg text-slate-800 mb-3 border-b-2 inline-block pr-4" style={{ borderColor: data.themeColor }}>Profile</h3><p className="text-sm leading-relaxed text-gray-700">{data.summary}</p></section>}
                 {data.experience.length > 0 && <section><h3 className="font-bold text-lg text-slate-800 mb-6 border-b-2 inline-block pr-4" style={{ borderColor: data.themeColor }}>Professional Experience</h3><div className="space-y-8">{data.experience.map((exp:any, idx:number) => (<div key={idx}><div className="flex justify-between items-start mb-1"><h4 className="font-bold text-base text-slate-800">{exp.role}</h4><span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: data.themeColor }}>{exp.duration}</span></div><div className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">{exp.company}</div><p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed border-l-2 border-slate-200 pl-3">{exp.details}</p></div>))}</div></section>}
                 
                 {data.projects && data.projects.length > 0 && (
                     <section className="mt-8">
                         <h3 className="font-bold text-lg text-slate-800 mb-6 border-b-2 inline-block pr-4" style={{ borderColor: data.themeColor }}>Projects</h3>
                         <div className="space-y-6">
                            {data.projects.map((proj: any, idx: number) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-base text-slate-800">{proj.title}</h4>
                                    </div>
                                    {proj.technologies && <div className="text-xs font-bold text-slate-500 mb-1">{proj.technologies}</div>}
                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed border-l-2 border-slate-200 pl-3">{proj.details}</p>
                                </div>
                            ))}
                         </div>
                     </section>
                 )}
             </main>
        </div>
    </div>
);

// --- TEMPLATE 7: COMPACT ---
const CompactTemplate = ({ data }: { data: any }) => (
    <div className="bg-white min-h-full max-w-full">
        <div className="text-white p-10 mb-8" style={{ backgroundColor: data.themeColor || '#a69b95' }}>
            <h1 className="text-4xl mb-2 uppercase tracking-wide">{data.fullName || "Your Name"}</h1>
            <div className="flex flex-wrap gap-x-6 text-sm font-medium opacity-90">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.location && <span>{data.location}</span>}
                {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i}><a href={l.url}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="px-10 pb-10 space-y-8">
            {data.summary && <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Summary</div><div className="col-span-9 text-sm leading-relaxed text-gray-700 border-l border-gray-200 pl-6">{data.summary}</div></div>}
            {data.skills.length > 0 && <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Skills</div><div className="col-span-9 border-l border-gray-200 pl-6"><ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 list-disc ml-4">{data.skills.map((skill:string, i:number) => <li key={i}>{skill}</li>)}</ul></div></div>}
            {data.languages.length > 0 && <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Languages</div><div className="col-span-9 border-l border-gray-200 pl-6"><div className="flex gap-4 text-sm">{data.languages.map((l:any,i:number)=><span key={i}><strong>{l.language}</strong> ({l.proficiency})</span>)}</div></div></div>}
            
            {data.experience.length > 0 && <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Experience</div><div className="col-span-9 border-l border-gray-200 pl-6 space-y-6">{data.experience.map((exp:any, idx:number) => (<div key={idx}><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-900 text-sm uppercase">{exp.role}</h3><span className="text-xs text-gray-500">{exp.duration}</span></div><div className="text-sm font-bold text-gray-600 mb-2">{exp.company}</div><div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1">{exp.details}</div></div>))}</div></div>}
            
            {data.projects && data.projects.length > 0 && (
                 <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6">
                    <div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Projects</div>
                    <div className="col-span-9 border-l border-gray-200 pl-6 space-y-6">
                        {data.projects.map((proj:any, idx:number) => (
                            <div key={idx}>
                                <h3 className="font-bold text-gray-900 text-sm uppercase">{proj.title}</h3>
                                {proj.technologies && <div className="text-xs text-gray-500 mb-2">{proj.technologies}</div>}
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1">{proj.details}</div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
            
            <AchievementsSection achievements={data.achievements} styleTitle={{ color: data.themeColor || '#a69b95' }} />

            {data.education.length > 0 && <div className="grid grid-cols-12 gap-6 border-t border-gray-200 pt-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm pt-1" style={{ color: data.themeColor || '#a69b95' }}>Education</div><div className="col-span-9 border-l border-gray-200 pl-6 space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx}><div className="font-bold text-sm text-gray-900">{edu.school}</div><div className="text-sm text-gray-600 italic">{edu.degree}</div><div className="text-xs text-gray-400 mt-1">{edu.year}</div></div>))}</div></div>}
        </div>
    </div>
);

// --- TEMPLATE 8: ELEGANT ---
const ElegantTemplate = ({ data }: { data: any }) => (
    <div className="p-12 min-h-full max-w-full text-center">
        <div className="mb-8 border-b-2 pb-6" style={{ borderColor: data.themeColor }}>
            <h1 className="text-4xl font-bold mb-3">{data.fullName || "Your Name"}</h1>
            <div className="text-sm text-gray-600 flex justify-center gap-4 flex-wrap">
                {data.location && <span>{data.location}</span>}
                {data.phone && <span>| {data.phone}</span>}
                {data.email && <span>| {data.email}</span>}
                {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i}>| <a href={l.url}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="space-y-8 text-left max-w-3xl mx-auto">
            {data.summary && <section><h2 className="text-center font-bold text-lg mb-3 pb-1 border-b border-gray-300">Summary</h2><p className="text-sm leading-relaxed text-center">{data.summary}</p></section>}
            {data.skills.length > 0 && <section><h2 className="text-center font-bold text-lg mb-3 pb-1 border-b border-gray-300">Skills</h2><div className="grid grid-cols-2 gap-4 text-sm text-center"><div>{data.skills.slice(0, Math.ceil(data.skills.length / 2)).map((s:string, i:number) => <div key={i}>• {s}</div>)}</div><div>{data.skills.slice(Math.ceil(data.skills.length / 2)).map((s:string, i:number) => <div key={i}>• {s}</div>)}</div></div></section>}
            <LanguagesSection languages={data.languages} styleTitle={{ borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', textAlign: 'center' }} className="text-center" />
            
            {data.experience.length > 0 && <section><h2 className="text-center font-bold text-lg mb-4 pb-1 border-b border-gray-300">Experience</h2><div className="space-y-6">{data.experience.map((exp:any, idx:number) => (<div key={idx}><div className="flex justify-between font-bold text-base mb-1"><span style={{ color: data.themeColor }}>{exp.role}</span><span>{exp.duration}</span></div><div className="font-bold text-sm text-gray-600 mb-2">{exp.company}</div><ul className="list-disc ml-5 text-sm space-y-1 text-gray-800">{exp.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}</ul></div>))}</div></section>}
            
            {data.projects && data.projects.length > 0 && (
                 <section>
                    <h2 className="text-center font-bold text-lg mb-4 pb-1 border-b border-gray-300">Projects</h2>
                    <div className="space-y-6">
                        {data.projects.map((proj:any, idx:number) => (
                            <div key={idx}>
                                <div className="font-bold text-base mb-1" style={{ color: data.themeColor }}>{proj.title}</div>
                                <div className="text-xs text-gray-500 mb-2 italic">{proj.technologies}</div>
                                <ul className="list-disc ml-5 text-sm space-y-1 text-gray-800">{proj.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                 </section>
            )}

            <AchievementsSection achievements={data.achievements} styleTitle={{ borderBottom: '1px solid #d1d5db', paddingBottom: '0.25rem', textAlign: 'center' }} />

            {data.education.length > 0 && <section><h2 className="text-center font-bold text-lg mb-4 pb-1 border-b border-gray-300">Education</h2><div className="space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx} className="text-center"><div className="font-bold text-sm">{edu.school}</div><div className="text-sm text-gray-600 italic">{edu.degree} ({edu.year})</div></div>))}</div></section>}
        </div>
    </div>
);

// --- TEMPLATE 9: TIMELINE ---
const TimelineTemplate = ({ data }: { data: any }) => (
    <div className="p-12 min-h-full max-w-full">
        <div className="mb-10">
            <h1 className="text-5xl mb-4 uppercase tracking-tight">{data.fullName || "Your Name"}</h1>
            <div className="h-1 w-20 mb-4" style={{ backgroundColor: data.themeColor }}></div>
            <div className="text-sm text-gray-600 flex gap-6 flex-wrap">
                 {data.location && <span>{data.location}</span>}
                 {data.phone && <span>{data.phone}</span>}
                 {data.email && <span>{data.email}</span>}
                 {data.socialLinks.filter((l: any) => l.url).map((l:any, i:number) => <span key={i}><a href={l.url}>{l.platform}</a></span>)}
            </div>
        </div>
        <div className="space-y-8">
            {data.summary && <section><h2 className="text-sm font-bold uppercase mb-4 tracking-widest text-gray-500">SUMMARY</h2><p className="text-sm leading-relaxed max-w-3xl">{data.summary}</p></section>}
            {data.skills.length > 0 && <section><h2 className="text-sm font-bold uppercase mb-4 tracking-widest text-gray-500">SKILLS</h2><div className="grid grid-cols-2 gap-y-2 gap-x-8 max-w-2xl text-sm">{data.skills.map((skill:string, i:number) => (<div key={i} className="flex items-center gap-3"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: data.themeColor }}></span>{skill}</div>))}</div></section>}
            <LanguagesSection languages={data.languages} styleTitle={{ color: '#6b7280' }} />
            {data.experience.length > 0 && <section><h2 className="text-sm font-bold uppercase mb-6 tracking-widest text-gray-500">EXPERIENCE</h2><div className="space-y-6">{data.experience.map((exp:any, idx:number) => (<div key={idx} className="grid grid-cols-12 gap-4"><div className="col-span-3 text-sm font-bold pt-1" style={{ color: data.themeColor }}>{exp.duration}</div><div className="col-span-9"><div className="text-base font-bold uppercase tracking-wide mb-1" style={{ color: data.themeColor }}>{exp.role}</div><div className="text-sm font-bold text-gray-500 mb-3">{exp.company}</div><ul className="list-disc ml-4 text-sm space-y-2 text-gray-700">{exp.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}</ul></div></div>))}</div></section>}
            
            {data.projects && data.projects.length > 0 && (
                <section><h2 className="text-sm font-bold uppercase mb-6 tracking-widest text-gray-500">PROJECTS</h2><div className="space-y-6">{data.projects.map((proj:any, idx:number) => (<div key={idx} className="grid grid-cols-12 gap-4"><div className="col-span-3 text-sm font-bold pt-1 text-gray-400">Project</div><div className="col-span-9"><div className="text-base font-bold uppercase tracking-wide mb-1" style={{ color: data.themeColor }}>{proj.title}</div><div className="text-sm font-bold text-gray-500 mb-3">{proj.technologies}</div><ul className="list-disc ml-4 text-sm space-y-2 text-gray-700">{proj.details.split('\n').map((line:string, lIdx:number) => line.trim() && <li key={lIdx}>{line.replace(/^[•-]\s*/, '')}</li>)}</ul></div></div>))}</div></section>
            )}

            <AchievementsSection achievements={data.achievements} styleTitle={{ color: '#6b7280' }} />

            {data.education.length > 0 && <section><h2 className="text-sm font-bold uppercase mb-6 tracking-widest text-gray-500">EDUCATION</h2><div className="space-y-4">{data.education.map((edu:any, idx:number) => (<div key={idx} className="grid grid-cols-12 gap-4"><div className="col-span-3 text-sm font-bold pt-1" style={{ color: data.themeColor }}>{edu.year}</div><div className="col-span-9"><div className="font-bold text-gray-900">{edu.school}</div><div className="text-sm text-gray-600 italic">{edu.degree}</div></div></div>))}</div></section>}
        </div>
    </div>
);