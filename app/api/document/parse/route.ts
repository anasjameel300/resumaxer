import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// We'll import dynamically to avoid issues with standard imports if it needs certain globals.
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Need to set up a dummy worker for completely server-side Node execution
// Otherwise it tries to fetch the worker file over standard HTTP/DOM methods.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const userName = formData.get('userName') as string || '';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        if (!userName) {
            return NextResponse.json({ error: 'User name is required for verification' }, { status: 400 });
        }

        let extractedText = '';

        // Extract Text based on File Type
        if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);

            // Using modern pdfjs-dist 
            const loadingTask = pdfjsLib.getDocument({
                data,
                useSystemFonts: true,
                disableFontFace: true, // Prevent attempting to fetch fonts
                standardFontDataUrl: 'node_modules/pdfjs-dist/standard_fonts/',
            });
            const pdfDocument = await loadingTask.promise;

            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                extractedText += pageText + '\n';
            }
        } else if (file.type === 'text/plain') {
            extractedText = await file.text();
        } else {
            return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 });
        }

        // Clean and prepare text
        extractedText = extractedText.replace(/\s+/g, ' ').trim();
        if (!extractedText) {
            return NextResponse.json({ error: 'Could not extract any sensible text from the document.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const prompt = `
You are an expert ATS and HR analyzer. I will provide you with the extracted text of a document (e.g., Resume, CV, Certificate, or Academic Transcript) uploaded by a user named "${userName}".

**TASK 1: OWNERSHIP VERIFICATION**
Analyze the document to determine who it belongs to.
1. If the document explicitly belongs to someone else (a different name is clearly the primary subject), you MUST reject it.
2. If the document has NO clear name (e.g., a generic certificate, a vague transcript, or oddly formatted file), flag it as requiring confirmation.
3. If the document clearly belongs to "${userName}" (or a reasonable variation/nickname), it is a success.

**TASK 2: BROADER EXTRACTION**
If the document is NOT rejected, analyze the text and extract notable professional or academic milestones. Go beyond just academic achievements. Look for:
- Specific, measurable impacts (e.g., "Scaled API to 10k users")
- Leadership or management roles
- Key technical and soft skills demonstrated
- Standout projects and open-source contributions
- Any other significant professional contributions useful for drafting a resume later.

**OUTPUT FORMAT**
Output ONLY raw JSON. Do not include markdown formatting like \`\`\`json.
Your JSON must strictly match this structure:

{
  "status": "SUCCESS" | "REJECTED" | "REQUIRES_CONFIRMATION",
  "reason": "If REJECTED, explain why (e.g., 'Document belongs to John Doe, not ${userName}'). If REQUIRES_CONFIRMATION, explain why (e.g., 'No name found on the document'). If SUCCESS, leave empty.",
  "achievements": [
    {
      "title": "Short, powerful title summarizing the achievement (e.g., '1st Place Hackathon', 'Built scalable API', 'Demonstrated Leadership')",
      "description": "Detailed description emphasizing impact, metrics, skills used, and what was achieved.",
      "date": "Extracted date (e.g., '2023', 'Oct 2022' or 'Present'. Use 'N/A' if unfindable)",
      "category": "One of: 'Award', 'Project', 'Education', 'Certification', 'Experience', 'Skill', 'Leadership', 'Contribution'"
    }
  ]
}

**CRITICAL RULE FOR "REQUIRES_CONFIRMATION":**
Even if the status is "REQUIRES_CONFIRMATION", you MUST still extract and populate the "achievements" array so the user can be asked "Do you want to proceed?" and the data is already available without another API call. If "REJECTED", the "achievements" array should be empty [].

Document Text:
${extractedText.substring(0, 30000)}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Find JSON object in the text (to make it robust against Gemini slipping markdown in)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("Failed to parse response:", responseText);
            throw new Error('Failed to parse AI response into structured JSON.');
        }

        let parsedResponse = JSON.parse(jsonMatch[0]);

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error('Document parsing error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during document processing.' },
            { status: 500 }
        );
    }
}
