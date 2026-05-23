import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const QuestionSchema = z.object({
  question: z.string().min(5),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  marks: z.number().positive(),
  bloomLevel: z.string().optional(),
});

export const SectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema),
});

export const PaperSchema = z.object({
  title: z.string(),
  class: z.string().optional(),
  subject: z.string().optional(),
  sections: z.array(SectionSchema),
});

export type GeneratedPaperData = z.infer<typeof PaperSchema>;

const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });
const getGenAIClient = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function extractJSON(text: string): any {
  try {
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start === -1 || end === -1) throw new Error('No JSON object found');
    
    cleaned = cleaned.substring(start, end + 1);
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON Extraction/Parse failed:', err);
    throw new Error('Malformed AI response');
  }
}

async function callGroq(prompt: string): Promise<any> {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });
  return extractJSON(completion.choices[0]?.message?.content || '');
}

async function callGemini(prompt: string): Promise<any> {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return extractJSON(response.text());
}

export const generateQuestionPaper = async (promptData: any): Promise<GeneratedPaperData> => {
  const prompt = `
Generate a professional, academic question paper strictly in JSON format.
Context:
Title: ${promptData.title}
Target Marks: ${promptData.totalMarks}
Target Questions: ${promptData.totalQuestions}
Instructions: ${promptData.instructions || 'None'}
Question Types:
${promptData.questionTypes.map((q: any) => `- ${q.type}: ${q.count} questions, ${q.marks} marks each`).join('\n')}

Rules:
1. Output MUST be valid JSON.
2. Follow this structure:
{
  "title": "string",
  "class": "string",
  "subject": "string",
  "sections": [
    {
      "title": "string",
      "instruction": "string",
      "questions": [
        { "question": "string", "difficulty": "Easy|Moderate|Challenging", "marks": number, "bloomLevel": "string" }
      ]
    }
  ]
}
`;

  const providers = [
    { name: 'Groq', fn: callGroq },
    { name: 'Gemini', fn: callGemini },
  ];

  for (const provider of providers) {
    let retries = 0;
    const maxRetries = 2;

    while (retries < maxRetries) {
      try {
        console.log(`[AI] Attempting ${provider.name} (Retry: ${retries})`);
        const rawResult = await provider.fn(prompt);
        const validated = PaperSchema.parse(rawResult);
        console.log(`[AI] ${provider.name} Successful`);
        return validated;
      } catch (error) {
        retries++;
        console.error(`[AI] ${provider.name} failed:`, (error as Error).message);
        if (retries >= maxRetries) {
          console.warn(`[AI] ${provider.name} exhausted retries.`);
        } else {
          await new Promise(res => setTimeout(res, 500 * Math.pow(2, retries)));
        }
      }
    }
  }

  console.warn('[AI] All providers failed. Using mock fallback.');
  return {
    title: promptData.title,
    class: 'N/A',
    subject: 'N/A',
    sections: [
      {
        title: 'Section A',
        instruction: 'Automated Fallback - All providers were unavailable.',
        questions: [
          {
            question: 'Identify the primary components of an atom.',
            difficulty: 'Easy',
            marks: promptData.questionTypes[0]?.marks || 2,
            bloomLevel: 'Knowledge'
          }
        ]
      }
    ]
  };
};
