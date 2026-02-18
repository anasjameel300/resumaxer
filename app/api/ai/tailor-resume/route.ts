import { NextRequest, NextResponse } from 'next/server';
import { genAI, POWER_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { currentResume, jobDescription } = await req.json();

        const systemPrompt = `You are an expert Resume Tailor. I have a candidate's current resume data and a target Job Description.
    Your task is to REWRITE the 'Professional Summary' and 'Work Experience' bullet points to specifically target the Job Description keywords and requirements.
    Rules:
    Do not invent fake experience. Use the existing experience but rephrase it to highlight relevant skills for the JD.
    Use strong action verbs.
    Output the result in Markdown.
    Create a 'Tailored Summary' section.
    Create a 'Tailored Experience' section where you list the modified bullet points for each role.
    `;

        const model = genAI.getGenerativeModel({
            model: POWER_MODEL,
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(`Resume:\n${currentResume}\n\nTarget Job:\n${jobDescription.substring(0, 5000)}`);
        const responseContent = result.response.text();

        return NextResponse.json({ tailoredContent: responseContent });

    } catch (error) {
        console.error('Error tailoring resume:', error);
        return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
    }
}
