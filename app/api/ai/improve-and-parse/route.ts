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

    const { resumeText, improvements, answers } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const systemPrompt = `You are an elite executive resume writer.
Your job is to completely rewrite and optimize the provided resume.
The user's original resume has flaws (noted in the improvements list). The user also provided answers to clarifying questions to provide missing metrics/details.

Instructions:
1. Incorporate the user's answers to add hard metrics, business outcomes, and specific context.
2. Fix all issues mentioned in the improvements list (e.g., weak action verbs, bad formatting, missing keywords).
3. Rewrite the experience bullets to be highly impactful, quantified, and ATS-optimized (e.g., "Led team" -> "Directed cross-functional team of 10 engineers, increasing delivery speed by 40%").
4. Parse the final rewritten resume into structured data arrays to directly pre-fill a resume builder.

Return ONLY valid JSON matching this exact structure:

{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "summary": "string",
  "experience": [
    { "role": "string", "company": "string", "duration": "string", "details": "string (bullet points separated by \\n)" }
  ],
  "education": [
    { "degree": "string", "school": "string", "year": "string" }
  ],
  "skills": ["string", "string"],
  "projects": [
    { "title": "string", "technologies": "string", "details": "string", "link": "string" }
  ],
  "languages": [
    { "language": "string", "proficiency": "string" }
  ],
  "socialLinks": [
    { "platform": "string", "url": "string" }
  ]
}

If a field is not found, use an empty string or empty array. The JSON output MUST contain the fully rewritten and optimized text.`;

    const model = genAI.getGenerativeModel({
      model: FAST_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const promptParam = `Original Resume:
${resumeText}

Improvements to Make:
${(improvements || []).join('\n')}

User's Additional Details (Answers to questions):
${Object.entries(answers || {}).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Write the optimized resume and return it in the specified JSON structure.`;

    const result = await model.generateContent(promptParam);
    const responseContent = result.response.text();

    return NextResponse.json(JSON.parse(responseContent));
  } catch (error) {
    console.error('Error improving and parsing resume:', error);
    return NextResponse.json({ error: 'Failed to improve and parse resume' }, { status: 500 });
  }
}
