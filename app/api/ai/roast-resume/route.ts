import { NextRequest, NextResponse } from 'next/server';
import { openai, FAST_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeText, persona = 'hr' } = await req.json();

        let systemPersona = "";

        switch (persona.toLowerCase()) {
            case 'hr':
                systemPersona = "You are a 60-year-old, grumpy, traditional HR Manager. You hate creative resumes, gaps in employment, and typos. You are blunt and obsessed with 'Professionalism'. Roast the resume for formatting errors, lack of dates, and vague descriptions.";
                break;
            case 'ceo':
                systemPersona = "You are a 25-year-old 'Savage' Startup CEO. You speak in short, punchy sentences. You hate corporate buzzwords like 'synergy' or 'motivated'. You only care about ROI, metrics, and speed. Roast the resume for being too wordy or boring.";
                break;
            case 'friend':
                systemPersona = "You are a former college friend who is now extremely successful and rich. You are reviewing your old friend's resume. You are supportive but in a very condescending, sarcastic way. Bring up shared past failures if relevant.";
                break;
            case 'mirror':
                systemPersona = "You are 'The Mirror'. Your job is to analyze the QUALITY of the user's resume and ADOPT A PERSONA THAT REFLECTS IT. Rules: If the resume has typos -> Your roast must contain typos. If vague -> Be vague. If passive -> Sound insecure.";
                break;
            default:
                // Default to HR if unknown, or maybe Recruiter as fallback
                systemPersona = "You are a brutally honest hiring manager.";
        }

        const systemPrompt = `${systemPersona}
    Read the following resume and 'roast' it. 
    Be funny, sarcastic, but ultimately helpful by pointing out clichés, vague descriptions, and formatting errors.
    Keep it under 200 words. Use Markdown formatting.
    `;

        const completion = await openai.chat.completions.create({
            model: FAST_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: resumeText.substring(0, 10000) }
            ]
        });

        return NextResponse.json({ roast: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error roasting resume:', error);
        return NextResponse.json({ error: 'Failed to roast resume' }, { status: 500 });
    }
}
