import { NextRequest, NextResponse } from 'next/server';
import { genAI, FAST_MODEL } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        // Authenticate request
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeText, improvements } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
        }

        const systemPrompt = `You are an expert technical recruiter and resume writer.
An ATS analysis generated some improvement suggestions for the user's resume.
Your goal is to ask 2-3 highly specific, targeted questions to the user to gather the missing information needed to rewrite their resume perfectly.

CRITICAL INSTRUCTION: If the Suggested Improvements do not strictly require asking the user for more information (e.g., they just need better formatting or action verbs), you MUST return an empty array: []

Otherwise, based on the weak points below, write 2 to 3 clarifying questions.

Suggested Improvements:
${improvements.join('\n')}

Ensure the questions are direct, actionable, and focus on extracting hard metrics, business outcomes, or technical specifics.
Return ONLY a valid JSON array of strings. No markdown, no markdown blocks, just the JSON array.
Example of good questions: ["What was the percentage increase in revenue for the Q3 campaign?", "How many users were affected by the performance optimization you led?"]
Example of returning no questions: []`;

        const model = genAI.getGenerativeModel({
            model: FAST_MODEL,
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const result = await model.generateContent("Generate clarifying questions based on the resume and improvements.");
        const responseContent = result.response.text();

        return NextResponse.json(JSON.parse(responseContent));
    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }
}
