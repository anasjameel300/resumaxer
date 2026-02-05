import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AtsAnalysis, ResumeData, WizardInitialData, CareerRoadmapResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Total score out of 100." },
    contentQuality: { type: Type.INTEGER, description: "Score 0-100 for content impact and clarity." },
    atsStructure: { type: Type.INTEGER, description: "Score 0-100 for formatting and ATS parsing likelihood." },
    jobOptimization: { type: Type.INTEGER, description: "Score 0-100 for keyword matching (if JD provided) or general relevance." },
    writingQuality: { type: Type.INTEGER, description: "Score 0-100 for grammar, tone, and action verbs." },
    applicationReady: { type: Type.INTEGER, description: "Score 0-100 for overall readiness to submit." },
    summary: { type: Type.STRING, description: "A brief executive summary of the analysis." },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific actionable improvements." },
  },
  required: ["overallScore", "contentQuality", "atsStructure", "jobOptimization", "writingQuality", "applicationReady", "summary", "improvements"]
};

// Clarification Questions Schema
const clarificationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 specific follow-up questions."
    }
  },
  required: ["questions"]
};

// Wizard Parsing Schema
const wizardParseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
      }
    },
    experienceRaw: { type: Type.STRING, description: "The work experience section as a single string block." },
    educationRaw: { type: Type.STRING, description: "The education section as a single string block." },
    skillsRaw: { type: Type.STRING, description: "Skills and projects sections combined as a single string block." },
  },
  required: ["personalInfo", "experienceRaw", "educationRaw", "skillsRaw"]
};

// Schema for generating a full resume structure
const resumeDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    location: { type: Type.STRING },
    summary: { type: Type.STRING },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          details: { type: Type.STRING },
        },
        required: ["role", "company", "duration", "details"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          technologies: { type: Type.STRING },
          link: { type: Type.STRING },
          details: { type: Type.STRING },
        },
        required: ["title", "details"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING },
        },
        required: ["school", "degree", "year"]
      }
    },
    socialLinks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          platform: { type: Type.STRING },
          url: { type: Type.STRING },
        },
        required: ["platform", "url"]
      }
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          language: { type: Type.STRING },
          proficiency: { type: Type.STRING },
        },
        required: ["language", "proficiency"]
      }
    },
    suggestedTemplate: { 
      type: Type.STRING, 
      enum: ['modern', 'classic', 'creative', 'minimalist', 'standard', 'executive', 'compact', 'elegant', 'timeline'],
      description: "The best template ID for this specific user profile."
    },
    suggestedThemeColor: { type: Type.STRING, description: "Hex color code suitable for the resume style." },
    suggestedFont: { type: Type.STRING, enum: ['sans', 'serif', 'mono'], description: "Best font family ID." }
  },
  required: ["fullName", "email", "summary", "experience", "education", "skills", "suggestedTemplate", "suggestedThemeColor", "suggestedFont"]
};

// Roadmap Schema
const roadmapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    currentStatus: { type: Type.STRING, description: "Brief assessment of where the user is now." },
    gapAnalysis: { type: Type.STRING, description: "What is missing between current skills and target role." },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "e.g., Phase 1: Foundations" },
          duration: { type: Type.STRING, description: "e.g., Weeks 1-4" },
          goal: { type: Type.STRING, description: "Main objective of this phase." },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                task: { type: Type.STRING, description: "Actionable item, e.g., 'Learn React Hooks'" },
                description: { type: Type.STRING, description: "Why this is important." }
              },
              required: ["id", "task", "description"]
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Course", "Article", "Book", "Tool", "Project"] },
                url: { type: Type.STRING, description: "A valid URL or search query." }
              },
              required: ["title", "type"]
            }
          }
        },
        required: ["title", "duration", "goal", "steps", "resources"]
      }
    }
  },
  required: ["currentStatus", "gapAnalysis", "phases"]
};

export const analyzeAtsScore = async (resumeText: string, jobDescription?: string): Promise<AtsAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  let prompt = `You are a strict, objective ATS (Applicant Tracking System) Scanner. 
  Your job is to score resumes consistently based on a fixed rubric.
  
  SCORING RUBRIC (Follow Strict Scoring):
  - Base Score for all categories starts at 50.
  - Content Quality: +10 for quantified metrics (numbers, %), +10 for clear results, -10 for vague duties.
  - ATS Structure: +10 for standard headings, -20 for tables/columns/graphics that break parsing.
  - Job Optimization: +20 if keywords match the JD (or industry standards if no JD), -20 if generic.
  - Writing Quality: +10 for active voice, -10 for passive voice or typos.
  
  Analyze this resume based on 5 categories: Content Quality, ATS & Structure, Job Optimization, Writing Quality, and Application Ready.
  Provide a score out of 100 for each, and an overall score (average).
  `;

  if (jobDescription) {
    prompt += `\n\nThe user is applying for this specific job. Optimizing for keywords is critical:\n${jobDescription}`;
  } else {
    prompt += `\n\nNo specific job description provided. Evaluate against general industry standards for the detected role.`;
  }

  prompt += `\n\nResume Text:\n${resumeText}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0, // Deterministic output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AtsAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const parseRawResumeData = async (resumeText: string): Promise<WizardInitialData> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Parse the following resume text into structured raw data blocks.
  The goal is to pre-fill a resume builder wizard.
  
  Resume Text:
  ${resumeText}
  
  Requirements:
  1. Extract 'personalInfo' (Name, email, phone, location, linkedin).
  2. Extract 'experienceRaw' as a single block of text containing all work history details. Keep the original formatting if possible.
  3. Extract 'educationRaw' as a single block of text containing all education details.
  4. Extract 'skillsRaw' as a single block of text containing skills, projects, and certifications.
  
  Return JSON only.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: wizardParseSchema,
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to parse resume.");
  return JSON.parse(text) as WizardInitialData;
};

export const tailorResume = async (currentResumeData: ResumeData, jobDescription: string): Promise<string> => {
  const model = "gemini-3-pro-preview"; // Using Pro for complex reasoning
  
  const resumeContext = `
  Name: ${currentResumeData.fullName}
  Summary: ${currentResumeData.summary}
  Experience: ${JSON.stringify(currentResumeData.experience)}
  Skills: ${currentResumeData.skills.join(", ")}
  `;

  const prompt = `You are an expert Resume Tailor. I have a candidate's current resume data and a target Job Description.
  
  Your task is to REWRITE the "Professional Summary" and "Work Experience" bullet points to specifically target the Job Description keywords and requirements.
  
  Rules:
  1. Do not invent fake experience. Use the existing experience but rephrase it to highlight relevant skills for the JD.
  2. Use strong action verbs.
  3. Output the result in Markdown.
  4. Create a "Tailored Summary" section.
  5. Create a "Tailored Experience" section where you list the modified bullet points for each role.

  Candidate Resume Data:
  ${resumeContext}

  Target Job Description:
  ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Failed to tailor resume.";
};

export const generateClarificationQuestions = async (inputs: any): Promise<string[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are a Resume Consultant. Review the raw data provided by a user to build their resume.
  
  PREVIOUS ANALYSIS RECOMMENDATIONS (CRITICAL):
  ${JSON.stringify(inputs.analysisImprovements || [])}

  User Inputs:
  Personal: ${JSON.stringify(inputs.personalInfo)}
  Experience: ${inputs.experienceRaw}
  Projects/Skills: ${inputs.skillsRaw}
  Target Role/JD: ${inputs.strategy === 'Tailored' ? inputs.jobDescription : inputs.predefinedRole}

  CRITICAL INSTRUCTIONS:
  1. **QUESTION 1 MUST BE MANDATORY AND CRITICAL**: Identify the absolute biggest missing piece of information (e.g., missing metrics, missing role dates, or the most important missing keyword from the JD). The first question MUST address this directly.
  2. **Address Analysis Gaps**: Look at the "Previous Analysis Recommendations". If the analysis said "Quantify results", you MUST ask a question like "The analysis suggested quantifying results. Can you provide specific numbers/metrics for your role at [Company]?"
  3. Ambiguity Check: If the user says vague things like "Worked on many projects" or "20+ websites", ask them to "List the top 2-3 most relevant projects with specific technologies used."
  
  Generate exactly 3 short, specific follow-up questions.
  The FIRST question should be the most important one.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: clarificationSchema,
    }
  });

  const text = response.text;
  if (!text) return ["What is your most recent role and key achievement?", "Do you have any specific metrics for your achievements?", "Do you have a portfolio link?"];
  const parsed = JSON.parse(text);
  return parsed.questions || [];
};

export const generateFullResume = async (inputs: any, clarificationAnswers?: any): Promise<any> => {
  const model = "gemini-3-pro-preview";

  const prompt = `You are a professional Resume Writer and Career Coach. 
  Create a complete, structured resume based on the raw information provided by the user below.
  
  PREVIOUS ANALYSIS RECOMMENDATIONS (MUST IMPLEMENT):
  ${JSON.stringify(inputs.analysisImprovements || [])}

  User Inputs:
  - Strategy: ${inputs.strategy}
  - Role Context: ${inputs.strategy === 'Tailored' ? inputs.jobDescription : inputs.predefinedRole}
  - Personal Details: ${JSON.stringify(inputs.personalInfo)}
  - Raw Experience: ${inputs.experienceRaw}
  - Raw Education: ${inputs.educationRaw}
  - Raw Skills & Projects: ${inputs.skillsRaw}
  - Follow-up Answers: ${JSON.stringify(clarificationAnswers || {})}

  STRICT WRITING RULES:
  1. **Apply Recommendations**: You MUST actively implement the "Previous Analysis Recommendations" in the generated content.
  2. **Conciseness is King**: Use clean, concise bullet points for Experience and Projects. 
  3. **No Paragraphs**: Do not use long paragraphs in the experience section. Convert them to scannable bullets.
  4. **Ambiguity Resolution**: Use the details provided in the Follow-up Answers to create specific project entries.
  5. **Action Verbs**: Start every bullet with a strong action verb (e.g., Engineered, Spearheaded, Optimized).
  6. **Recruiter Friendly**: Ensure the layout and content are optimized for a 6-second recruiter scan.

  Tasks:
  1. Parse the raw text into structured JSON.
  2. Write a professional summary.
  3. Format Experience with "Role", "Company", "Duration", and bullet points.
  4. Format Projects (extracting links if available).
  5. Suggest a 'suggestedTemplate', 'suggestedThemeColor', and 'suggestedFont'.
  6. Return a JSON object matching the schema.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeDataSchema,
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate resume.");
  return JSON.parse(text);
}

export const optimizeResumeContent = async (currentResume: string, jobDescription: string): Promise<string> => {
    return "Use tailorResume instead";
};

export const roastMyResume = async (resumeText: string, persona: string = 'hr'): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  let systemInstruction = "";
  
  switch (persona) {
      case 'hr':
          systemInstruction = `You are a 60-year-old, grumpy, traditional HR Manager. 
          You hate creative resumes, gaps in employment, and typos. You are blunt and obsessed with "Professionalism".
          Roast the resume for formatting errors, lack of dates, and vague descriptions.`;
          break;
      case 'ceo':
          systemInstruction = `You are a 25-year-old "Savage" Startup CEO. 
          You speak in short, punchy sentences. You hate corporate buzzwords like "synergy" or "motivated". 
          You only care about ROI, metrics, and speed. Roast the resume for being too wordy or boring.`;
          break;
      case 'friend':
          systemInstruction = `You are a former college friend who is now extremely successful and rich. 
          You are reviewing your old friend's resume. You are supportive but in a very condescending, sarcastic way. 
          Bring up shared past failures if relevant (e.g., "Is this like that time you failed Econ 101?").`;
          break;
      case 'mirror':
          systemInstruction = `You are "The Mirror". Your job is to analyze the QUALITY of the user's resume and ADOPT A PERSONA THAT REFLECTS IT.
          
          RULES FOR REFLECTION:
          1. If the resume has typos/grammar errors -> Your roast must contain typos and bad grammar.
          2. If the resume is vague/generic -> Your roast must be confusingly vague and generic.
          3. If the resume lacks confidence (passive voice) -> Your roast must sound insecure and weak.
          4. If the resume is actually good -> You can be normal, but point out it's "suspiciously good".
          
          Explicitly tell them WHY you are talking this way. e.g., "I'm writing this with no capital letters because you didn't capitalize your job titles."`;
          break;
      default:
          systemInstruction = "You are a ruthless recruiter roasting a resume.";
  }

  const prompt = `Roast this resume based on your persona.
  
  CRITICAL FORMATTING INSTRUCTION: 
  Start every new section or thought with a Markdown Bold Header (e.g., **First Impression:**, **The Experience:**, **Formatting:**). This is mandatory.
  
  Resume:
  ${resumeText}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 1.3, // High creativity
    }
  });

  return response.text || "Your resume is so boring I fell asleep trying to roast it.";
};

export const generateResumeSummary = async (data: Partial<ResumeData>, targetRole: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Write a professional, punchy resume summary (3-4 sentences) for a ${targetRole}.
  Based on these details:
  Experience: ${JSON.stringify(data.experience)}
  Skills: ${data.skills?.join(", ")}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "";
};

export const generateCareerRoadmap = async (data: ResumeData, targetRole: string): Promise<CareerRoadmapResponse | null> => {
  const model = "gemini-3-pro-preview";

  const prompt = `You are an expert Career Coach and Technical Mentor.
  
  User Profile:
  - Current Skills: ${data.skills.join(", ") || "None listed"}
  - Current Experience Levels: ${data.experience.map(e => e.role).join(", ") || "None listed"}

  Target Role: ${targetRole}

  Task:
  Create a comprehensive, step-by-step career roadmap for this user to achieve the Target Role.
  Return structured JSON data only.
  
  Requirements:
  1. Break the roadmap into 3-4 clear phases (e.g., Foundations, Advanced, Mastery).
  2. For each phase, provide 3-5 specific "Task" items that are actionable (e.g., "Build a REST API").
  3. For each phase, provide 2-3 "Resources" which are real links or search queries for courses/docs.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: roadmapSchema,
    }
  });

  const text = response.text;
  if (!text) return null;
  return JSON.parse(text) as CareerRoadmapResponse;
};

export const generateCoverLetter = async (data: ResumeData, jobDescription: string): Promise<string> => {
  const model = "gemini-3-pro-preview";

  const resumeContext = `
  Name: ${data.fullName}
  Email: ${data.email}
  Phone: ${data.phone}
  Current Summary: ${data.summary}
  Experience: ${JSON.stringify(data.experience)}
  Projects: ${JSON.stringify(data.projects)}
  Skills: ${data.skills.join(", ")}
  Achievements: ${data.achievements.join(", ")}
  `;

  const prompt = `Write a compelling, professional cover letter for the following candidate applying to the job described below.
  
  Candidate Details:
  ${resumeContext}

  Job Description:
  ${jobDescription}

  Guidelines:
  1. Standard business letter format (without the street address header unless you have it, just start with Date and Salutation).
  2. Use a professional but enthusiastic tone.
  3. SPECIFICALLY mention how the candidate's experience/projects match the requirements in the JD.
  4. Do not make up facts. Use the provided resume data.
  5. Keep it concise (approx 300-400 words).
  6. Return ONLY the body of the letter (including salutation and sign-off). Do not wrap in markdown code blocks.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Failed to generate cover letter.";
};