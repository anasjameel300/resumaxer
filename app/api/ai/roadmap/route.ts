import { NextRequest, NextResponse } from 'next/server';
import { genAI, POWER_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, targetRole } = await req.json();

        const systemPrompt = `You are an expert Career Coach and Technical Mentor.
    Task: Create a comprehensive, step-by-step career roadmap for this user to achieve the Target Role. Return structured JSON data only.
    Requirements:
    Break the roadmap into 3-4 clear phases (e.g., Foundations, Advanced, Mastery).
    For each phase, provide 3-5 specific 'Task' items that are actionable (e.g., 'Build a REST API').
    For each phase, provide 2-3 'Resources' which are real links or search queries for courses/docs.
    
    Return ONLY valid JSON matching this structure:
    
    interface CareerRoadmapResponse {
      currentStatus: string; // Brief assessment of where they are now
      gapAnalysis: string; // Detailed analysis of missing skills/experience
      phases: {
          title: string; // e.g. "Phase 1: Foundation"
          duration: string; // e.g. "1-2 Months"
          goal: string; // High-level objective
          steps: {
              id: string; // unique short id
              task: string;
              description: string;
          }[];
          resources: {
              title: string;
              type: "Course" | "Article" | "Book" | "Tool";
              url?: string; // Optional
          }[];
      }[];
    }
    `;

        const userMessage = `Current Profile: ${JSON.stringify(resumeData).substring(0, 5000)}
    Target Role: ${targetRole}`;

        const model = genAI.getGenerativeModel({
            model: POWER_MODEL,
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const result = await model.generateContent(userMessage);
        const responseContent = result.response.text();

        if (!responseContent) {
            throw new Error("Empty response from AI");
        }

        return NextResponse.json(JSON.parse(responseContent));

    } catch (error) {
        console.error('Error generating roadmap:', error);
        return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }
}
