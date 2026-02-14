
import { UserRole } from "../types";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabaseClient";

// Helper to initialize Gemini Client dynamically
const getAiClient = async (): Promise<GoogleGenAI | null> => {
  try {
    // 1. Try to fetch from Supabase Config
    const { data } = await supabase
      .from('app_config')
      .select('gemini_api_key')
      .limit(1)
      .single();

    if (data?.gemini_api_key) {
      return new GoogleGenAI({ apiKey: data.gemini_api_key });
    }
  } catch (e) {
    console.error("Failed to fetch Gemini API Key from DB", e);
  }

  // 2. Return null or throw if no key is found. 
  // The caller handles the fallback.
  console.warn("Gemini API Key missing in app_config table.");
  return null;
};

export const analyzeFeedback = async (
  feedback: string,
  role: UserRole
): Promise<{ analysis: string; sentiment: string; strategicAction: string }> => {
  
  try {
    const ai = await getAiClient();
    
    if (!ai) {
        throw new Error("AI Client not initialized (Missing Key)");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
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

  try {
    const ai = await getAiClient();
    if (!ai) throw new Error("Missing API Key");

    const prompt = `
      You are a Product Manager for Pharmelo. Analyze these ${feedbacks.length} user feedback submissions:
      ${feedbacks.map((f, i) => `(${i+1}) ${f}`).join('\n')}

      Provide a strategic summary in JSON format with:
      1. "top_themes": Array of 3 strings (main topics).
      2. "sentiment_breakdown": Object with percentages for positive, neutral, negative.
      3. "executive_summary": A 2-sentence summary of what users want.
      4. "recommended_features": Array of 3 specific features to build next.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
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
  try {
    const ai = await getAiClient();
    if (!ai) throw new Error("Missing API Key");

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
