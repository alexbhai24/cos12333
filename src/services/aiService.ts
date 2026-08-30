export interface AIServiceParams {
  message: string;
  mode: string;
  attachment?: {
    data: string; // base64
    mimeType: string;
    filename?: string;
  };
  history?: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  conversationId: string;
  assistantContext: {
    currentRoute: string;
    permittedContent?: { title: string; type: string; id: string; category?: string }[];
  };
}

export interface AIResponse {
  answer: string;
  citations?: { title: string; url: string }[];
  modeSwitchedTo?: string;
  error?: string;
}

// ─── Visual Request Detector (Only for Study & Learn) ─────────────────────────
export function detectVisualIntent(msg: string): { isVisual: boolean; kind: 'flowchart' | 'diagram' | 'image' | 'notes' | 'infographic' | 'none' } {
  const lower = msg.toLowerCase();
  
  if (
    lower.includes('generate a flowchart') || 
    lower.includes('generate flowchart') || 
    lower.includes('make a flowchart') || 
    lower.includes('create a flowchart') || 
    lower.includes('draw a flowchart') ||
    lower.includes('show a flowchart') ||
    lower.includes('flowchart of') ||
    lower.includes('flowchart for')
  ) {
    return { isVisual: true, kind: 'flowchart' };
  }

  if (
    lower.includes('generate a diagram') || 
    lower.includes('generate diagram') || 
    lower.includes('make a diagram') || 
    lower.includes('create a diagram') || 
    lower.includes('draw a diagram') ||
    lower.includes('show a diagram') ||
    lower.includes('diagram of') ||
    lower.includes('diagram for')
  ) {
    return { isVisual: true, kind: 'diagram' };
  }

  if (
    lower.includes('generate an image') || 
    lower.includes('generate image') || 
    lower.includes('generate photo') || 
    lower.includes('generate a photo') || 
    lower.includes('generate picture') ||
    lower.includes('generate a picture') ||
    lower.includes('create an image') ||
    lower.includes('draw an image') ||
    lower.includes('image showing') ||
    lower.includes('photo showing') ||
    lower.includes('picture showing')
  ) {
    return { isVisual: true, kind: 'image' };
  }

  if (
    lower.includes('make visual notes') || 
    lower.includes('generate visual notes') || 
    lower.includes('create visual notes') || 
    lower.includes('visual notes') || 
    lower.includes('generate notes')
  ) {
    return { isVisual: true, kind: 'notes' };
  }

  if (
    lower.includes('create an infographic') || 
    lower.includes('generate an infographic') || 
    lower.includes('make an infographic') || 
    lower.includes('generate infographic')
  ) {
    return { isVisual: true, kind: 'infographic' };
  }

  return { isVisual: false, kind: 'none' };
}

// ─── Mode Instructions Builder ────────────────────────────────────────────────
function getSystemPromptForMode(mode: string, userMessage: string = ''): string {
  const base = `You are Bone AI, an intelligent educational assistant on the CosmicBone EdTech platform helping students excel in STEM, JEE, NEET, and board exams. Always format answers clearly using GitHub-flavored Markdown. For mathematical formulas, use clean LaTeX or clean text.`;

  switch (mode) {
    case 'Smart':
      return `${base}
MODE: SMART
- Give a fast, direct, and concise answer.
- Focus on the most important information first.
- Use bullet points where appropriate.
- Visual generation is disabled in this mode. Do not generate diagrams or images.
- Avoid unnecessary introductory fluff or long essays unless requested.`;

    case 'Think Deeper':
      return `${base}
MODE: THINK DEEPER
- Analyze the problem with rigorous logic, precision, and step-by-step reasoning.
- Structure your answer clearly with:
  1. **Direct Conclusion / Summary**
  2. **Detailed Step-by-Step Analysis / Proof / Derivation**
  3. **Key Concepts & Assumptions**
  4. **Practical Example / Edge Case**
- Visual generation is disabled in this mode. Prefer accuracy and depth over brevity.`;

    case 'Study & Learn': {
      const visual = detectVisualIntent(userMessage);

      if (visual.kind === 'flowchart' || visual.kind === 'diagram') {
        return `${base}
MODE: STUDY & LEARN (Interactive Flowchart & Diagram Mode)
- The user has explicitly asked for a FLOWCHART or DIAGRAM.
- You MUST generate a complete, 100% valid Mermaid diagram enclosed in \`\`\`mermaid ... \`\`\` code block (e.g. \`graph TD\` or \`flowchart TD\` with descriptive nodes, clear transitions, and subgraphs).
- Do NOT use special symbols like quotes or brackets inside raw node labels. Use clean syntax like \`A[Step 1: Description] --> B[Step 2: Description]\`.
- After the Mermaid diagram, provide a detailed step-by-step explanation of each phase, key formulas/takeaways, and common student mistakes.`;
      }

      if (visual.kind === 'notes' || visual.kind === 'infographic') {
        return `${base}
MODE: STUDY & LEARN (Visual Notes & Infographic Mode)
- The user has explicitly asked for VISUAL NOTES or an INFOGRAPHIC.
- Provide comprehensive visual structured notes containing:
  1. An interactive Mermaid concept hierarchy or process map enclosed in \`\`\`mermaid ... \`\`\`.
  2. Structured summary tables and categorized callout boxes with emojis.
  3. Core formulas, principles, and definitions.
  4. **📌 Quick Revision Checklist** at the end.`;
      }

      if (visual.kind === 'image') {
        return `${base}
MODE: STUDY & LEARN (Educational Visual Image Generation)
- The user has explicitly asked for an IMAGE or PHOTO.
- You MUST generate an educational illustration image by embedding it using standard Markdown image syntax:
  \`![<Descriptive Title>](https://image.pollinations.ai/prompt/<safe_detailed_educational_english_prompt>?width=1024&height=640&nologo=true)\`
  (Format the prompt with descriptive textbook keywords like "scientific textbook illustration, detailed biological structure, labeled diagram style, 8k resolution, educational, clean background").
- After the image, provide an in-depth educational explanation of all the components, functions, and key exam concepts shown in the image.`;
      }

      // Normal study question without explicit visual request
      return `${base}
MODE: STUDY & LEARN (Personal Tutor)
- Act as an encouraging, expert private tutor.
- The user asked a standard study question. Do NOT generate images or flowcharts.
- Explain the core concept from the ground up so the student truly understands the "why".
- Provide the step-by-step solution / method.
- Highlight **Common Pitfalls / Mistakes** students usually make on this topic.
- End with a **📌 Quick Revision Summary** (3 to 5 key bullet points).`;
    }

    case 'Google Search':
      return `${base}
MODE: GOOGLE SEARCH (Web-Grounded)
- You have been provided with real-time web search excerpts.
- Synthesize the information accurately based on the facts provided.
- Cite relevant sources with [Source Name] where appropriate.
- Visual generation is disabled in this mode.
- If information is uncertain, clearly state so.`;

    default:
      return base;
  }
}

// ─── NVIDIA NIM API (Llama 3.1 70B & Llama 3.2 Vision) ────────────────────────
async function callNvidia(apiKey: string, params: AIServiceParams, customSystemPrompt?: string): Promise<string> {
  const isImageAttachment = Boolean(params.attachment?.data && params.attachment.mimeType?.startsWith('image/'));
  // Use vision model if image is attached, else standard 70B text reasoning model
  const model = isImageAttachment 
    ? 'meta/llama-3.2-11b-vision-instruct' 
    : ((import.meta as any).env?.VITE_NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct');
  
  const systemPrompt = customSystemPrompt || getSystemPromptForMode(params.mode, params.message);

  let userContent: any = params.message;
  if (isImageAttachment && params.attachment?.data) {
    const dataUrl = params.attachment.data.startsWith('data:') 
      ? params.attachment.data 
      : `data:${params.attachment.mimeType || 'image/jpeg'};base64,${params.attachment.data}`;
    
    userContent = [
      { type: 'text', text: params.message || 'Please analyze and explain this image in detail.' },
      { type: 'image_url', image_url: { url: dataUrl } }
    ];
  }

  // Construct conversation message history
  const messagesPayload: any[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (params.history && params.history.length > 0) {
    // Include last 8 conversational turns for active context memory
    params.history.slice(-8).forEach((item) => {
      if (item.content && item.content !== '...') {
        messagesPayload.push({
          role: item.role === 'user' ? 'user' : 'assistant',
          content: item.content,
        });
      }
    });
  }

  messagesPayload.push({ role: 'user', content: userContent });

  const payload = {
    model,
    messages: messagesPayload,
    max_tokens: 1500,
    temperature: params.mode === 'Think Deeper' ? 0.2 : 0.7,
  };

  // Try Vite proxy first in browser to prevent CORS latency, fallback to direct API
  const isBrowser = typeof window !== 'undefined';
  const endpoints = isBrowser
    ? ['/api-nvidia/v1/chat/completions', 'https://integrate.api.nvidia.com/v1/chat/completions']
    : ['https://integrate.api.nvidia.com/v1/chat/completions'];

  let lastError: any = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `NVIDIA error ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e: any) {
      lastError = e;
      console.warn(`[aiService] Failed calling NVIDIA via ${endpoint}:`, e.message);
    }
  }

  throw lastError || new Error('NVIDIA API call failed');
}

// ─── Gemini Direct API ────────────────────────────────────────────────────────
async function callGemini(apiKey: string, params: AIServiceParams): Promise<string> {
  const model = (import.meta as any).env?.VITE_BONE_AI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const systemPrompt = getSystemPromptForMode(params.mode, params.message);

  const parts: any[] = [{ text: `${systemPrompt}\n\nUser Question: ${params.message}` }];

  if (params.attachment?.data) {
    const rawBase64 = params.attachment.data.includes('base64,')
      ? params.attachment.data.split('base64,')[1]
      : params.attachment.data;
    parts.push({
      inline_data: {
        mime_type: params.attachment.mimeType || 'image/jpeg',
        data: rawBase64,
      },
    });
    if (params.attachment.filename) {
      parts.push({ text: `[Attached file: ${params.attachment.filename}]` });
    }
  }

  const body: any = { contents: [{ parts }] };
  if (params.mode === 'Google Search') {
    body.tools = [{ googleSearch: {} }];
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errObj = await res.json().catch(() => ({}));
    throw new Error(errObj.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');
  return text;
}

// ─── Real-Time Web Search (Wikipedia + DuckDuckGo) ───────────────────────────
async function performWebSearch(query: string): Promise<{ summary: string; citations: { title: string; url: string }[] }> {
  const citations: { title: string; url: string }[] = [];
  let summary = '';

  // 1. Query Wikipedia Search API (Free, Instant, CORS-enabled with origin=*)
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
    const res = await fetch(wikiUrl);
    if (res.ok) {
      const data = await res.json();
      const results: any[] = data.query?.search || [];
      if (results.length > 0) {
        const topResults = results.slice(0, 3);
        summary += `Web Search Findings for "${query}":\n\n`;
        topResults.forEach((item, idx) => {
          const cleanSnippet = (item.snippet || '').replace(/<[^>]+>/g, '');
          summary += `[${idx + 1}] **${item.title}**: ${cleanSnippet}...\n`;
          citations.push({
            title: `Wikipedia: ${item.title}`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
          });
        });
      }
    }
  } catch (e) {
    console.warn('[aiService] Wikipedia search error:', e);
  }

  // 2. Query DuckDuckGo Instant Answer
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(ddgUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.AbstractText) {
        summary += `\n**Encyclopedia Overview**: ${data.AbstractText}\n`;
        if (data.AbstractURL) {
          citations.push({
            title: data.AbstractSource || 'DuckDuckGo Knowledge',
            url: data.AbstractURL,
          });
        }
      }
    }
  } catch (e) {
    console.warn('[aiService] DuckDuckGo search error:', e);
  }

  return { summary, citations };
}

// ─── Math Expression Solver ───────────────────────────────────────────────────
function evaluateMath(msg: string): string | null {
  const clean = msg.trim().toLowerCase();
  if (/^[\d\s+\-*/.()^sqrt]+$/.test(clean) && /[\d]/.test(clean)) {
    try {
      const expr = clean.replace(/\^/g, '**').replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
      const val = new Function(`return ${expr}`)();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        return `**${clean} = ${val}**\n\n*Calculated via CosmicBone Neural Math Engine.*`;
      }
    } catch {}
  }
  return null;
}

// ─── Key Validator ────────────────────────────────────────────────────────────
const isValidKey = (k?: string) =>
  Boolean(k && k.trim().length > 10 && !k.startsWith('YOUR_'));

// ─── Main AI Dispatcher ───────────────────────────────────────────────────────
export const aiService = {
  async sendMessage(params: AIServiceParams): Promise<AIResponse> {
    const env = (import.meta as any).env ?? {};

    const geminiKey: string | undefined = env.VITE_GEMINI_API_KEY;
    const nvidiaKey: string | undefined = env.VITE_NVIDIA_API_KEY;

    // Fast path: pure mathematical calculations
    const mathResult = evaluateMath(params.message);
    if (mathResult && !params.attachment) {
      return { answer: mathResult };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1. GOOGLE SEARCH MODE
    // ──────────────────────────────────────────────────────────────────────────
    if (params.mode === 'Google Search') {
      try {
        const searchData = await performWebSearch(params.message);

        // If we have an AI model (NVIDIA or Gemini), ask it to write a comprehensive answer using the web results
        if (isValidKey(nvidiaKey)) {
          const webPrompt = `You are Bone AI in Google Search mode. Use the following web search data to give an accurate, detailed, and nicely formatted answer with sources:\n\n${searchData.summary || 'No direct web snippet found. Use your authoritative knowledge to answer accurately.'}`;
          const aiAnswer = await callNvidia(nvidiaKey!, params, webPrompt);
          return { answer: aiAnswer, citations: searchData.citations };
        }

        if (isValidKey(geminiKey) && geminiKey!.startsWith('AIza')) {
          const aiAnswer = await callGemini(geminiKey!, params);
          return { answer: aiAnswer, citations: searchData.citations };
        }

        // If no AI key is available, present the direct web search summary
        if (searchData.summary) {
          return {
            answer: `### 🌐 Web Search Results for "${params.message}"\n\n${searchData.summary}\n\n*Click on any citation below to explore the official sources.*`,
            citations: searchData.citations,
          };
        }
      } catch (err: any) {
        console.warn('[aiService] Web Search mode error:', err.message);
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. STANDARD MODES (Smart, Think Deeper, Study & Learn)
    // ──────────────────────────────────────────────────────────────────────────

    // Priority 1: NVIDIA NIM (Llama 3.1 70B - verified working key)
    if (isValidKey(nvidiaKey)) {
      try {
        const answer = await callNvidia(nvidiaKey!, params);
        return { answer };
      } catch (err: any) {
        console.warn('[aiService] NVIDIA NIM failed, trying next provider:', err.message);
      }
    }

    // Priority 2: Gemini API (if valid AI Studio key is provided)
    if (isValidKey(geminiKey) && geminiKey!.startsWith('AIza')) {
      try {
        const answer = await callGemini(geminiKey!, params);
        return { answer };
      } catch (err: any) {
        console.warn('[aiService] Gemini API error:', err.message);
      }
    }

    // Priority 3: Fallback web search for knowledge lookup
    try {
      const searchData = await performWebSearch(params.message);
      if (searchData.summary) {
        return {
          answer: `### 💡 Information on "${params.message}"\n\n${searchData.summary}`,
          citations: searchData.citations,
        };
      }
    } catch {}

    // Priority 4: Friendly error message
    return {
      answer: `### ⚠️ Connection Notice\n\nI couldn't reach the AI model servers right now. Please check that your network allows connections to the AI API, or try again in a few moments.`,
    };
  },
};
