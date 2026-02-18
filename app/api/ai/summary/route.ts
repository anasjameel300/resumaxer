import { NextRequest, NextResponse } from 'next/server';
import { genAI, FAST_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, targetRole } = await req.json();

        const systemPrompt = `Write a professional, punchy resume summary (3-4 sentences) for a "${targetRole}". 
    Based on the provided details (Experience and Skills Data).
    Do not use "I" statements if possible, or keep them minimal. Focus on achievements and value proposition.
    `;

        const model = genAI.getGenerativeModel({
            model: FAST_MODEL,
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(JSON.stringify(resumeData).substring(0, 5000));
        const responseContent = result.response.text();

        return NextResponse.json({ summary: responseContent });

    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
