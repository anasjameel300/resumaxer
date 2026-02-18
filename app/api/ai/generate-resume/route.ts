import { NextRequest, NextResponse } from 'next/server';
import { genAI, POWER_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, clarificationAnswers, userContext } = await req.json();

        let systemPrompt = `You are a professional Resume Writer and Career Coach. Create a complete, structured resume based on the raw information provided by the user below.
    STRICT WRITING RULES:
    Apply Recommendations: You MUST actively implement the 'Previous Analysis Recommendations' in the generated content.
    Conciseness is King: Use clean, concise bullet points for Experience and Projects.
    No Paragraphs: Do not use long paragraphs in the experience section. Convert them to scannable bullets.
    Ambiguity Resolution: Use the details provided in the Follow-up Answers to create specific project entries.
    Action Verbs: Start every bullet with a strong action verb (e.g., Engineered, Spearheaded, Optimized).
    Recruiter Friendly: Ensure the layout and content are optimized for a 6-second recruiter scan.
    `;

        // Inject User Context Strategy
        if (userContext) {
            const contextInstructions = [];

            // Goal-based instructions
            if (userContext.goal === 'Job') contextInstructions.push("GOAL: GET HIRED ASAP. Prioritize industry keywords, quantifiable metrics, and impact. Remove fluff.");
            if (userContext.goal === 'Salary') contextInstructions.push("GOAL: MAXIMIZE SALARY. Aggressively highlight revenue impact, leadership, and cost-saving achievements to justify a premium.");
            if (userContext.goal === 'Remote') contextInstructions.push("GOAL: REMOTE WORK. Emphasize self-management, asynchronous communication skills, and remote-friendly tools (e.g. Jira, Slack, Zoom).");
            if (userContext.goal === 'CareerChange') contextInstructions.push("GOAL: CAREER PIVOT. Focus strictly on transferable skills. Frame past experience in terms relevant to the target role.");

            // Identity-based instructions
            if (userContext.identity === 'Student') contextInstructions.push("IDENTITY: STUDENT/GRAD. Focus on academic projects, internships, and rapid learning ability. Highlight potential over experience.");
            if (userContext.identity === 'Executive') contextInstructions.push("IDENTITY: EXECUTIVE. Focus on strategic vision, P&L responsibility, and organizational leadership. Use high-level language.");

            // Skills-based instructions
            if (userContext.skills?.length) {
                contextInstructions.push(`SKILLS: The user has identified these as their core skills: ${userContext.skills.join(', ')}. Incorporate these prominently in the Skills section and weave them naturally into experience bullet points.`);
            }

            systemPrompt += `\n\nSTRATEGIC INSTRUCTIONS:\n${contextInstructions.join('\n')}`;
        }

        systemPrompt += `\n\nReturn the result as a Markdown string with clear sections (Summary, Experience, Education, Skills, etc.).`;

        const userMessage = `Raw Data: ${JSON.stringify(resumeData)}
    Clarification Answers: ${JSON.stringify(clarificationAnswers)}
    User Context: ${JSON.stringify(userContext || {})}`;

        const model = genAI.getGenerativeModel({
            model: POWER_MODEL,
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(userMessage.substring(0, 15000));
        const responseContent = result.response.text();

        return NextResponse.json({ resume: responseContent });

    } catch (error) {
        console.error('Error generating full resume:', error);
        return NextResponse.json({ error: 'Failed to generate full resume' }, { status: 500 });
    }
}
