import { NextRequest, NextResponse } from 'next/server';
import { openai, FAST_MODEL } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const { resumeText } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
        }

        const systemPrompt = `Parse the following resume text into structured raw data blocks. The goal is to pre-fill a resume builder wizard.
    Requirements:
    Extract 'personalInfo' (Name, email, phone, location, linkedin).
    Extract 'experienceRaw' as a single block of text containing all work history details. Keep the original formatting if possible.
    Extract 'educationRaw' as a single block of text containing all education details.
    Extract 'skillsRaw' as a single block of text containing skills, projects, and certifications.
    
    Return ONLY valid JSON matching this exact structure:
    
    {
      "personalInfo": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string"
      },
      "experienceRaw": "string",
      "educationRaw": "string",
      "skillsRaw": "string"
    }
    
    If a field is not found, use an empty string. Do not invent data.`;

        const completion = await openai.chat.completions.create({
            model: FAST_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: resumeText.substring(0, 15000) }
            ],
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0].message.content;
        if (!responseContent) {
            throw new Error("Empty response from AI");
        }

        return NextResponse.json(JSON.parse(responseContent));
    } catch (error) {
        console.error('Error parsing resume:', error);
        return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
    }
}
