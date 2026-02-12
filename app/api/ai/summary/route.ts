import { NextRequest, NextResponse } from 'next/server';
import { openai, FAST_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, targetRole } = await req.json();

        const systemPrompt = `Write a professional, punchy resume summary (3-4 sentences) for a "${targetRole}". 
    Based on the provided details (Experience and Skills Data).
    Do not use "I" statements if possible, or keep them minimal. Focus on achievements and value proposition.
    `;

        const completion = await openai.chat.completions.create({
            model: FAST_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(resumeData).substring(0, 5000) }
            ]
        });

        return NextResponse.json({ summary: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
