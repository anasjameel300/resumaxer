import { NextRequest, NextResponse } from 'next/server';
import { openai, POWER_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, clarificationAnswers } = await req.json();

        const systemPrompt = `You are a professional Resume Writer and Career Coach. Create a complete, structured resume based on the raw information provided by the user below.
    STRICT WRITING RULES:
    Apply Recommendations: You MUST actively implement the 'Previous Analysis Recommendations' in the generated content.
    Conciseness is King: Use clean, concise bullet points for Experience and Projects.
    No Paragraphs: Do not use long paragraphs in the experience section. Convert them to scannable bullets.
    Ambiguity Resolution: Use the details provided in the Follow-up Answers to create specific project entries.
    Action Verbs: Start every bullet with a strong action verb (e.g., Engineered, Spearheaded, Optimized).
    Recruiter Friendly: Ensure the layout and content are optimized for a 6-second recruiter scan.
    
    Return the result as a Markdown string with clear sections (Summary, Experience, Education, Skills, etc.).
    `;

        const userMessage = `Raw Data: ${JSON.stringify(resumeData)}
    Clarification Answers: ${JSON.stringify(clarificationAnswers)}`;

        const completion = await openai.chat.completions.create({
            model: POWER_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage.substring(0, 15000) }
            ]
        });

        return NextResponse.json({ resume: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error generating full resume:', error);
        return NextResponse.json({ error: 'Failed to generate full resume' }, { status: 500 });
    }
}
