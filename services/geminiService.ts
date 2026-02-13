import { AtsAnalysis, ResumeData, WizardInitialData, CareerRoadmapResponse } from "../types";

// Helper function for API calls
const postToAi = async (endpoint: string, body: any) => {
  const response = await fetch(`/api/ai/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to call ${endpoint}`);
  }

  return response.json();
};

export const analyzeAtsScore = async (resumeText: string, jobDescription?: string): Promise<AtsAnalysis> => {
  return postToAi('analyze-ats', { resumeText, jobDescription });
};

export const parseRawResumeData = async (resumeText: string): Promise<WizardInitialData> => {
  return postToAi('parse-resume', { resumeText });
};

export const tailorResume = async (currentResume: ResumeData, jobDescription: string): Promise<string> => {
  const result = await postToAi('tailor-resume', {
    currentResume: JSON.stringify(currentResume, null, 2),
    jobDescription
  });
  return result.tailoredContent;
};

export const generateClarificationQuestions = async (inputs: any): Promise<string[]> => {
  return postToAi('clarify', { resumeData: inputs });
};

export const generateFullResume = async (inputs: any, clarificationAnswers?: any): Promise<any> => {
  const result = await postToAi('generate-resume', { resumeData: inputs, clarificationAnswers });
  return result.resume;
}

export const optimizeResumeContent = async (currentResume: string, jobDescription: string): Promise<string> => {
  // Re-using tailor endpoint for content optimization
  const result = await postToAi('tailor-resume', {
    currentResume,
    jobDescription
  });
  return result.tailoredContent;
};

export const roastMyResume = async (resumeText: string, persona: string = 'hr'): Promise<string> => {
  const result = await postToAi('roast-resume', { resumeText, persona });
  return result.roast;
};

export const generateResumeSummary = async (data: Partial<ResumeData>, targetRole: string): Promise<string> => {
  const result = await postToAi('summary', { resumeData: data, targetRole });
  return result.summary;
};

export const generateCareerRoadmap = async (data: ResumeData, targetRole: string): Promise<CareerRoadmapResponse | null> => {
  return postToAi('roadmap', { resumeData: data, targetRole });
};

export const generateCoverLetter = async (data: ResumeData, jobDescription: string): Promise<string> => {
  const result = await postToAi('cover-letter', { resumeData: data, jobDescription });
  return result.coverLetter;
};
