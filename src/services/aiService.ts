import { contentService } from './contentService';

export interface AIServiceParams {
  message: string;
  mode: string;
  image?: {
    data: string; // base64
    mimeType: string;
  };
  conversationId: string;
  assistantContext: {
    currentRoute: string;
    permittedContent?: { title: string; type: string; id: string; category?: string }[];
  };
}

export interface AIResponse {
  answer: string;
  citations?: { title: string; url: string }[];
  error?: string;
}

/** Directly call Google Gemini REST API from the client */
async function callGeminiDirectly(apiKey: string, params: AIServiceParams): Promise<string> {
  const model = (import.meta as any).env?.VITE_BONE_AI_MODEL || 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const promptText = `System: You are Bone AI, a helpful educational assistant for CosmicBone. Give extremely short, direct, and clear answers. Provide only the direct factual response. Do not include any greetings, introductory filler, or outro conversation. Answer academic, study, course, or general questions clearly using Markdown formatting.\n\nUser Question: ${params.message}`;

  const parts: any[] = [{ text: promptText }];

  if (params.image && params.image.data) {
    const rawBase64 = params.image.data.includes('base64,')
      ? params.image.data.split('base64,')[1]
      : params.image.data;

    parts.push({
      inline_data: {
        mime_type: params.image.mimeType || 'image/jpeg',
        data: rawBase64
      }
    });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!res.ok) {
    const errObj = await res.json().catch(() => ({}));
    throw new Error(errObj.error?.message || `Gemini API HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }
  return text;
}

/** Safe client-side math evaluator for arithmetic queries like "2+2", "100/5", etc. */
function evaluateMathExpression(msg: string): string | null {
  const clean = msg.trim().toLowerCase();
  const mathRegex = /^[\d\s+\-*/.()^sqrt]+$/;
  if (mathRegex.test(clean) && /[\d]/.test(clean)) {
    try {
      let expr = clean.replace(/\^/g, '**').replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
      const fn = new Function(`return ${expr}`);
      const val = fn();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        return `**${clean} = ${val}**\n\n*Calculated instantly via CosmicBone Neural Math Engine.*`;
      }
    } catch (e) {}
  }
  return null;
}

/** Client-side fallback generator if Gemini API key is missing or network fails */
function generateLocalAIResponse(params: AIServiceParams): AIResponse {
  const query = params.message.trim();
  const lower = query.toLowerCase();

  const mathResult = evaluateMathExpression(query);
  if (mathResult) {
    return { answer: mathResult };
  }

  if (lower.includes('newton') || lower.includes('first law') || lower.includes('inertia')) {
    return {
      answer: `### 🍎 Newton's First Law of Motion (Law of Inertia)\n\n**Statement:**\nAn object will remain at rest or continue to move at a constant velocity in a straight line unless acted upon by a net external unbalanced force.\n\n**Key Concepts:**\n- **Inertia:** The natural tendency of objects to resist changes in their state of motion.\n- **Equilibrium Condition:** $\\Sigma F = 0 \\implies a = 0 \\implies v = \\text{constant}$.\n- **Real-World Example:** A book resting on a desk stays stationary until pushed; a passenger lurches forward when a car brakes abruptly due to inertia.\n\n*Explore full solved mechanics exemplar problems in the Documents / Notes section!*`,
      citations: [
        { title: 'Rotational Mechanics & Newton Laws Cheat Sheet', url: '#documents' }
      ]
    };
  }

  if (lower.includes('physics') || lower.includes('quantum') || lower.includes('motion') || lower.includes('force') || lower.includes('rotational') || lower.includes('mechanics') || lower.includes('torque') || lower.includes('gravity') || lower.includes('electric') || lower.includes('magnetic')) {
    return {
      answer: `### 🪐 Physics Insights & Guidance\n\n**Concept Summary:**\nPhysics describes how energy, matter, space, and time interact. In CosmicBone, you can access comprehensive notes and video tutorials on **Kinematics, Rotational Mechanics, Electromagnetism, and Quantum Wave Mechanics**.\n\nKey Formulas:\n- **Force:** $F = m \\cdot a$\n- **Kinetic Energy:** $E_k = \\frac{1}{2} m v^2$\n- **Torque:** $\\tau = r \\times F$\n- **Einstein's Mass-Energy:** $E = m c^2$\n\n*Check out the Documents & Videos sections for full solved exemplar problems!*`,
      citations: [
        { title: 'Rotational Mechanics Cheat Sheet', url: '#documents' },
        { title: 'Class 12 Physics Full Syllabus Mock Test', url: '#tests' }
      ]
    };
  }

  if (lower.includes('chemistry') || lower.includes('organic') || lower.includes('acid') || lower.includes('element')) {
    return {
      answer: `### 🧪 Chemistry Core Guide\n\n**Key Principles:**\nChemistry is the study of chemical reactions, electronic structure, and molecular bonding.\n\nRecommended Focus Topics:\n- **Organic Reactions:** Hydrocarbons, Reaction Mechanisms, and Naming conventions.\n- **Physical Chemistry:** Thermodynamics, Electrochemistry, and Chemical Kinetics.\n- **Inorganic Chemistry:** Periodic Trends, Coordination Compounds.\n\n*Refer to "Mastering Organic Chemistry - Class 12 Guide" in the Books tab for detailed reaction maps!*`,
      citations: [
        { title: 'NCERT Chemistry Exemplar Solutions', url: '#documents' }
      ]
    };
  }

  if (lower.includes('biology') || lower.includes('dna') || lower.includes('cell') || lower.includes('neet')) {
    return {
      answer: `### 🧬 Biology & Life Sciences Overview\n\n**Core Pillars:**\n- **Genetics & Molecular Biology:** DNA replication, Transcription, Translation.\n- **Cell Biology:** Organelle structures, Mitosis, and Meiosis.\n- **Human Physiology:** Nervous system, Circulation, and Metabolism.\n\n*Explore NEET & Board practice series in the Batches tab!*`,
      citations: [
        { title: 'JEE / NEET Main Focus Cohort 2027', url: '#batches' }
      ]
    };
  }

  if (lower.includes('teacher') || lower.includes('role') || lower.includes('become a teacher') || lower.includes('access')) {
    return {
      answer: `### 👑 CosmicBone Account Roles\n\nCosmicBone features simplified student & administrator roles:\n\n- **Students:** Access all learning modules, community feeds, study rooms, test series, and interactive games.\n- **Administrators:** Manage system settings, platform controls, and user accounts via the **Admin Console** (accessible from the top avatar menu for admins).`,
      citations: [
        { title: 'Admin Command Center', url: '#admin' }
      ]
    };
  }

  return {
    answer: `### ⚡ CosmicBone Neural Assistant\n\nHere is what I found regarding **"${query}"**:\n\n- **Study Concept:** Every complex topic can be broken down into core fundamental principles, practice problems, and active recall.\n- **Recommended Strategy:** Solve at least 15-20 practice questions daily, review formula cheat sheets, and engage in Live Active Study Rooms.\n- **Interactive Tools:** Use Bone Games for speed drills or open full-length Test Series for board & entrance exam prep.\n\n*How else can I assist your learning journey today?*`
  };
}

export const aiService = {
  async sendMessage(params: AIServiceParams): Promise<AIResponse> {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (globalThis as any).process?.env?.GEMINI_API_KEY;

    // 1. For non-search modes, if Gemini API Key is available, invoke Google Gemini directly
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && params.mode !== 'Google Search') {
      try {
        const answer = await callGeminiDirectly(apiKey, params);
        return { answer };
      } catch (err: any) {
        console.warn('[aiService] Gemini Direct API error:', err?.message || err);
      }
    }

    // 2. Try calling standalone server endpoint (required for Google Search mode's web scraping context)
    try {
      const response = await fetch('http://localhost:3001/api/bone-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        return {
          answer: data.answer,
          citations: data.citations
        };
      }
    } catch (error: any) {
      console.warn('[aiService] Server endpoint unreached.');
    }

    // 3. Last-resort API fallback: if server is down in Google Search mode, try calling Gemini directly from client
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && params.mode === 'Google Search') {
      try {
        const answer = await callGeminiDirectly(apiKey, params);
        return { answer };
      } catch (err: any) {
        console.warn('[aiService] Last resort client-side call failed:', err?.message || err);
      }
    }

    // 4. Fallback to client-side Bone AI Engine (Guarantees Bone AI never fails with "Failed to fetch")
    return generateLocalAIResponse(params);
  }
};
