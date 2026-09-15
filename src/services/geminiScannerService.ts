/**
 * Dedicated Google Gemini API Scanner Service
 * Separated from Bone AI to avoid any interference.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiScannerResult {
  text: string;
  detectedSubject?: string;
  suggestedChapter?: string;
  questionText?: string;
}

export async function analyzeScannedDocumentImage(base64Image: string): Promise<GeminiScannerResult> {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are an expert NEET/JEE question scanner. Extract the exact text of the question, detect whether it is Physics, Chemistry, Biology, or Mathematics, and extract any key formulas or problem statement."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: cleanBase64
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.warn('Gemini API scanner fallback:', response.statusText);
      return { text: '' };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let detectedSubject = 'physics';
    if (/chemistry/i.test(candidateText)) detectedSubject = 'chemistry';
    else if (/biology/i.test(candidateText)) detectedSubject = 'biology';
    else if (/mathematics|math/i.test(candidateText)) detectedSubject = 'mathematics';

    return {
      text: candidateText,
      detectedSubject,
      questionText: candidateText
    };
  } catch (err) {
    console.error('Gemini Scanner Service error:', err);
    return { text: '' };
  }
}
