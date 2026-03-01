import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// We'll import dynamically to avoid issues with standard imports if it needs certain globals.
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// Need to set up a dummy worker for completely server-side Node execution
// Otherwise it tries to fetch the worker file over standard HTTP/DOM methods.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

        // Prepare Prompt for Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an expert ATS and HR analyzer. I will provide you with the extracted text of a user's document (e.g., Resume, CV, Certificate, or Academic Transcript). 
Your task is to analyze this text and extract notable professional or academic milestones into structured achievements.

Output ONLY a raw JSON array of objects. Do not include markdown formatting like \`\`\`json.
Each object MUST strictly adhere to this format:
{
  "title": "Short, powerful title summarizing the achievement (e.g., '1st Place Hackathon', 'Built scalable API')",
  "description": "Detailed description of what was achieved, highlighting impact and metrics where available.",
  "date": "Extracted date (e.g., '2023', 'Oct 2022' or 'Present' if ongoing. Use 'N/A' if unfindable.)",
  "category": "One of: 'Award', 'Project', 'Education', 'Certification', 'Experience'"
}

Document Text:
${extractedText.substring(0, 30000)}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Find JSON array in the text (to make it robust against Gemini slipping markdown in)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            console.error("Failed to parse response:", responseText);
            throw new Error('Failed to parse AI response into structured JSON.');
        }

        let achievements = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ achievements });

    } catch (error: any) {
        console.error('Document parsing error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during document processing.' },
            { status: 500 }
        );
    }
}
