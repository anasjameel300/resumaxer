import { NextRequest, NextResponse } from 'next/server';
import { openai, FAST_MODEL } from '@/lib/openrouter';
import { AtsAnalysis } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { resumeText, jobDescription } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
        }

        const systemPrompt = `You are a strict, objective ATS (Applicant Tracking System) Scanner. Your job is to score resumes consistently based on a fixed rubric.
    SCORING RUBRIC (Follow Strict Scoring):
    Base Score for all categories starts at 50.
    Content Quality: +10 for quantified metrics (numbers, %), +10 for clear results, -10 for vague duties.
    ATS Structure: +10 for standard headings, -20 for tables/columns/graphics that break parsing.
    Job Optimization: +20 if keywords match the JD (or industry standards if no JD), -20 if generic.
    Writing Quality: +10 for active voice, -10 for passive voice or typos.
    Analyze this resume based on 5 categories: Content Quality, ATS & Structure, Job Optimization, Writing Quality, and Application Ready.
    
    You MUST return the response in valid JSON format matching the following structure entirely:

    interface AtsAnalysis {
      overallScore: number; // The average of the 5 categories
      contentQuality: number; 
      atsStructure: number; 
      jobOptimization: number; 
      writingQuality: number; 
      applicationReady: number; // Base this on completeness
      summary: string; // 2-3 sentences summarizing the resume's strength
      improvements: string[]; // List of specific actionable improvements (max 5)
    }

    Perform a strict analysis. Be critical but constructive.
    If a Job Description is provided using that for the 'jobOptimization' score, otherwise score based on general best practices.
    `;

        const userMessage = `Resume Content:
    ${resumeText.substring(0, 10000)}
    
    Job Description:
    ${jobDescription ? jobDescription.substring(0, 5000) : "No specific job description provided."}
    `;

        const completion = await openai.chat.completions.create({
            model: FAST_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0].message.content;

        if (!responseContent) {
            throw new Error("Empty response from AI");
        }

        const analysis: AtsAnalysis = JSON.parse(responseContent);
        return NextResponse.json(analysis);

    } catch (error) {
        console.error('Error in ATS analysis:', error);
        return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
    }
}
