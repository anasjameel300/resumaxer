
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  BUILDER = 'BUILDER',
  ATS_SCORER = 'ATS_SCORER',
  OPTIMIZER = 'OPTIMIZER',
  ROASTER = 'ROASTER',
  PROFILE = 'PROFILE',
  ROADMAP = 'ROADMAP',
  COVER_LETTER = 'COVER_LETTER',
}

export type TemplateId = 'modern' | 'classic' | 'creative' | 'minimalist' | 'standard' | 'executive' | 'compact' | 'elegant' | 'timeline';

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  website?: string; // Kept for legacy support
  socialLinks: SocialLink[];
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: string[];
  achievements: string[]; 
  languages: LanguageItem[];
  themeColor?: string;
  font?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  link?: string;
  technologies?: string;
  details: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface SocialLink {
  id: string;
  platform: string; // e.g., LinkedIn, GitHub
  url: string;
}

export interface AtsAnalysis {
  overallScore: number;
  contentQuality: number;
  atsStructure: number;
  jobOptimization: number;
  writingQuality: number;
  applicationReady: number;
  summary: string;
  improvements: string[];
}

export interface OptimizationResult {
  originalText: string;
  optimizedText: string;
  explanation: string;
}