
import { UserRole } from "../types";
import { GoogleGenAI } from "@google/genai";

// SAFE INITIALIZATION: Wrap in a function or check existence.
// This prevents "API key not found" errors from crashing the entire app on load.
let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (ai) return ai;
  
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI client:", e);
    return null;
  }
};

export const analyzeFeedback = async (
  feedback: string,
  role: UserRole
): Promise<{ analysis: string; sentiment: string; strategicAction: string }> => {
  
  const client = getAI();
  if (!client) {
    return {
      analysis: "AI service unavailable (Missing API Key).",
      sentiment: "neutral",
      strategicAction: "System upgrade required to enable AI analysis."
    };
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: `Analyze the following feedback from a ${role} for a pharmacy pickup app called Pharmelo.
      Feedback: "${feedback}"
      
      Return a JSON object with these keys:
      - analysis: A empathetic summary of their point.
      - sentiment: 'positive', 'neutral', or 'constructive'.
      - strategicAction: A specific feature or business action Pharmelo should take to address this.
      
      Do not format as markdown. Just raw JSON.`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (e) {
    console.error("Gemini API Error", e);
  }

  // Fallback if API fails
  const isNegative = feedback.toLowerCase().includes('wait') || feedback.toLowerCase().includes('slow') || feedback.toLowerCase().includes('stock');
  return {
    analysis: "We received your feedback. Our AI is currently offline, but our team has been notified.",
    sentiment: isNegative ? "constructive" : "neutral",
    strategicAction: "We will review this manually to improve the platform."
  };
};

export const analyzeBatchFeedback = async (feedbacks: string[]) => {
  if (feedbacks.length === 0) return null;
  const client = getAI();
  if (!client) return null;

  try {
    const prompt = `
      You are a Product Manager for Pharmelo. Analyze these ${feedbacks.length} user feedback submissions:
      ${feedbacks.map((f, i) => `(${i+1}) ${f}`).join('\n')}

      Provide a strategic summary in JSON format with:
      1. "top_themes": Array of 3 strings (main topics).
      2. "sentiment_breakdown": Object with percentages for positive, neutral, negative.
      3. "executive_summary": A 2-sentence summary of what users want.
      4. "recommended_features": Array of 3 specific features to build next.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text);
  } catch (e) {
    console.error("Batch Analysis Error", e);
    return null;
  }
};

export const generateNewsletter = async (stats: { waitlist: number, partners: number, community: number }) => {
  const client = getAI();
  if (!client) {
    return {
      subject: "Pharmelo Weekly Update",
      body: "We are growing fast! (AI Generation unavailable)"
    };
  }

  try {
    const prompt = `
      Act as the Communications Director for Pharmelo (a pharmacy pickup startup in Solan).
      Write a weekly update email for our community.
      
      Current Stats:
      - Waitlist Users: ${stats.waitlist}
      - Pharmacy Partners: ${stats.partners}
      - Community Members: ${stats.community}
      
      Requirements:
      1. Subject Line: Catchy and relevant to progress.
      2. Tone: Professional, Transparent, Exciting, but Humble.
      3. Content: 
         - Thank the community for the growth.
         - Mention we are moving closer to the 'Solan Launch' (Phase 1).
         - Highlight that verification of partners is underway.
         - Do NOT invent fake user stories, stick to the aggregate numbers.
      4. Output Format: JSON with 'subject' and 'body' (HTML friendly text).
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text);
  } catch (e) {
    console.error("Newsletter Generation Error", e);
    return {
      subject: "Pharmelo Weekly Update",
      body: "We are growing fast! Thank you for being part of our journey towards instant pharmacy pickup in Solan."
    };
  }
};
