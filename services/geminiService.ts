import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AtsAnalysis, ResumeData } from "../types";

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
      description: "List of 2-3 specific follow-up questions to gather missing critical info (e.g. metrics, links, dates)."
    }
  },
  required: ["questions"]
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

export const analyzeAtsScore = async (resumeText: string, jobDescription?: string): Promise<AtsAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  let prompt = `Analyze this resume based on 5 categories: Content Quality, ATS & Structure, Job Optimization, Writing Quality, and Application Ready.
  Provide a score out of 100 for each, and an overall score.`;

  if (jobDescription) {
    prompt += `\n\nThe user is applying for this specific job. optimizing for keywords is critical:\n${jobDescription}`;
  } else {
    prompt += `\n\nNo specific job description provided. Evaluate against general industry standards.`;
  }

  prompt += `\n\nResume Text:\n${resumeText}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
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
  Identify missing critical information that would strengthen the resume, such as:
  - Missing project links (GitHub, Portfolio) for developers/designers.
  - Missing quantifiable metrics (revenue, percentages) in experience.
  - Missing dates or locations.
  
  User Inputs:
  Personal: ${JSON.stringify(inputs.personalInfo)}
  Experience: ${inputs.experienceRaw}
  Projects/Skills: ${inputs.skillsRaw}
  Target Role/JD: ${inputs.strategy === 'Tailored' ? inputs.jobDescription : inputs.predefinedRole}

  Generate exactly 3 short, specific follow-up questions to ask the user. 
  If the input is comprehensive, ask about "Soft Skills" or "Hobbies" to round it out.
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
  if (!text) return ["Could you provide more details about your latest project?", "Do you have any specific metrics for your achievements?", "Do you have a portfolio link?"];
  const parsed = JSON.parse(text);
  return parsed.questions || [];
};

export const generateFullResume = async (inputs: any, clarificationAnswers?: any): Promise<any> => {
  const model = "gemini-3-pro-preview";

  const prompt = `You are a professional Resume Writer and Career Coach. 
  Create a complete, structured resume based on the raw information provided by the user below.
  
  User Inputs:
  - Strategy: ${inputs.strategy}
  - Role Context: ${inputs.strategy === 'Tailored' ? inputs.jobDescription : inputs.predefinedRole}
  - Personal Details: ${JSON.stringify(inputs.personalInfo)}
  - Raw Experience: ${inputs.experienceRaw}
  - Raw Education: ${inputs.educationRaw}
  - Raw Skills & Projects: ${inputs.skillsRaw}
  - Follow-up Answers: ${JSON.stringify(clarificationAnswers || {})}

  Instructions:
  1. Parse the raw text into structured JSON.
  2. Write a professional summary based on the strategy/role.
  3. Experience: Format as "Role", "Company", "Duration", and bullet points. Polish bullets to be achievement-oriented (Action Verb + Task + Result).
  4. Projects: EXTRACT LINKS if present in raw text or follow-up answers. If a project description is vague, use the context from the role to enhance it professionally (without lying).
  5. Template Selection: Suggest a 'suggestedTemplate' (modern, classic, creative, minimalist, standard, executive, compact, elegant, timeline), 'suggestedThemeColor', and 'suggestedFont' based on the user's role and industry. 
     - e.g. 'creative' for designers, 'executive' for managers, 'modern' for devs.
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

export const roastMyResume = async (resumeText: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Roast this resume. You are a cynical, ruthless, hard-to-please senior recruiter who has seen thousands of terrible resumes. 
  Be funny, mean, but also truthful about the flaws. Make fun of clichés, vague buzzwords, and poor formatting. 
  
  Resume:
  ${resumeText}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: "You are a ruthless recruiter roasting a resume.",
      temperature: 1.2, 
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

export const generateCareerRoadmap = async (data: ResumeData, targetRole: string): Promise<string> => {
  const model = "gemini-3-pro-preview";

  const prompt = `You are an expert Career Coach and Technical Mentor.
  
  User Profile:
  - Current Skills: ${data.skills.join(", ") || "None listed"}
  - Current Experience Levels: ${data.experience.map(e => e.role).join(", ") || "None listed"}

  Target Role: ${targetRole}

  Task:
  Create a comprehensive, step-by-step career roadmap for this user to achieve the Target Role.
  Scour your knowledge base for the best industry practices, modern tech stacks, and learning resources.

  Structure the response in Markdown:
  1. **Gap Analysis**: Briefly explain what they have vs. what they need.
  2. **Phase 1: Foundations (Month 1-2)**: Key concepts to learn.
  3. **Phase 2: Advanced Skills (Month 3-4)**: Frameworks, tools, or deep dives.
  4. **Phase 3: Portfolio & Experience**: Specific project ideas to build to prove these skills.
  5. **Recommended Resources**: List specific names of top-rated courses (Coursera, Udemy), books, or documentation.
  6. **Certifications**: Recommended certifications if applicable.

  Be specific. Don't just say "Learn JS", say "Master ES6+ concepts like Promises and Async/Await".
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Unable to generate roadmap at this time.";
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