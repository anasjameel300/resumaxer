import { NextRequest, NextResponse } from 'next/server';
import { openai, FAST_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeData } = await req.json();

        const systemPrompt = `You are a Resume Consultant. Review the raw data provided by a user to build their resume.
    CRITICAL INSTRUCTIONS:
    QUESTION 1 MUST BE MANDATORY AND CRITICAL: Identify the absolute biggest missing piece of information (e.g., missing metrics, missing role dates, or the most important missing keyword from the JD). The first question MUST address this directly.
    Address Analysis Gaps: Look at the 'Previous Analysis Recommendations'. If the analysis said 'Quantify results', you MUST ask a question like 'The analysis suggested quantifying results. Can you provide specific numbers/metrics for your role at [Company]?'
    Ambiguity Check: If the user says vague things like 'Worked on many projects' or '20+ websites', ask them to 'List the top 2-3 most relevant projects with specific technologies used.'
    Generate exactly 3 short, specific follow-up questions.
    
    Return a JSON object with a single key "questions" containing an array of 3 strings.
    Example: { "questions": ["Question 1", "Question 2", "Question 3"] }
    `;

        const completion = await openai.chat.completions.create({
            model: FAST_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(resumeData).substring(0, 5000) }
            ],
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0].message.content;
        if (!responseContent) {
            throw new Error("Empty response from AI");
        }
        const parsed = JSON.parse(responseContent);
        return NextResponse.json(parsed.questions || []);

    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }
}
