
export enum AppView {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  BUILDER = 'BUILDER',
  ATS_SCORER = 'ATS_SCORER',
  OPTIMIZER = 'OPTIMIZER',
  ROASTER = 'ROASTER',
  PROFILE = 'PROFILE',
  ROADMAP = 'ROADMAP',
  COVER_LETTER = 'COVER_LETTER',
  TRACKER = 'TRACKER',
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

export interface WizardInitialData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  experienceRaw: string;
  educationRaw: string;
  skillsRaw: string;
  analysisImprovements?: string[];
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

// --- Roadmap Types ---
export interface RoadmapResource {
  title: string;
  type: string; // Course, Article, Book, Tool
  url?: string;
}

export interface RoadmapStep {
  id: string;
  task: string;
  description: string;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  goal: string;
  steps: RoadmapStep[];
  resources: RoadmapResource[];
}

export interface CareerRoadmapResponse {
  currentStatus: string;
  gapAnalysis: string;
  phases: RoadmapPhase[];
}

// --- Job Tracker Types ---
export type ApplicationStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  date: string;
  status: ApplicationStatus;
  salary?: string;
  notes?: string;
  url?: string;
}