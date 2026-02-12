import { NextRequest, NextResponse } from 'next/server';
import { openai, POWER_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, jobDescription } = await req.json();

        const systemPrompt = `Write a compelling, professional cover letter for the following candidate applying to the job described below.
    Guidelines:
    Standard business letter format (without the street address header unless you have it, just start with Date and Salutation).
    Use a professional but enthusiastic tone.
    SPECIFICALLY mention how the candidate's experience/projects match the requirements in the JD.
    Do not make up facts. Use the provided resume data.
    Keep it concise (approx 300-400 words).
    
    Return the result as Markdown text.
    `;

        const completion = await openai.chat.completions.create({
            model: POWER_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Candidate Profile:\n${JSON.stringify(resumeData)}\n\nJob Description:\n${jobDescription.substring(0, 5000)}` }
            ]
        });

        return NextResponse.json({ coverLetter: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error generating cover letter:', error);
        return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
    }
}
