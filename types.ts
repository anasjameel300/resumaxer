
export enum AppView {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  BUILDER = 'BUILDER',
  ATS_SCORER = 'ATS_SCORER',
  ROASTER = 'ROASTER',
  PROFILE = 'PROFILE',
  ROADMAP = 'ROADMAP',
  COVER_LETTER = 'COVER_LETTER',
  TRACKER = 'TRACKER',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
}

export type TemplateId = 'modern' | 'classic' | 'creative' | 'minimalist' | 'standard' | 'executive' | 'compact' | 'elegant' | 'timeline';

export interface TemplateConfig {
  hasProfileImage: boolean;
  // Add other feature flags here in the future (e.g., hasSkillsBar, hasCompactHeader)
}

export const TEMPLATE_CONFIG: Record<TemplateId, TemplateConfig> = {
  modern: { hasProfileImage: true },
  classic: { hasProfileImage: false },
  creative: { hasProfileImage: true },
  minimalist: { hasProfileImage: false },
  standard: { hasProfileImage: false },
  executive: { hasProfileImage: true },
  compact: { hasProfileImage: false },
  elegant: { hasProfileImage: false },
  timeline: { hasProfileImage: false },
};

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  targetRole?: string;
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
  profileImage?: string;
  template?: TemplateId;
}

export interface WizardInitialData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  userContext?: UserContext;
  experienceRaw: string;
  educationRaw: string;
  skillsRaw: string;
  analysisImprovements?: string[];
  oldAtsScore?: number;
  newAtsScore?: number;
}

export interface UserContext {
  identity: 'Student' | 'Professional' | 'Manager' | 'Executive';
  experience: string; // e.g. "0-1 Years"
  goal: 'Job' | 'Salary' | 'Remote' | 'CareerChange';
  blocker: 'ATS' | 'Roadmap' | 'Design';
  targetRole: string;
  skills?: string[];
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

export interface AchievementItem {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: string;
  source_type: string;
  date?: string;
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