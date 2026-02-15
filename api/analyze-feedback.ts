
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { feedback, role } = await request.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      // Return Mock Data if API Key is missing (prevents crash)
      return new Response(JSON.stringify({
        analysis: "AI Key missing. This is a simulated analysis based on your input.",
        sentiment: feedback.toLowerCase().includes('bad') ? 'constructive' : 'positive',
        strategicAction: "Manual review recommended. Add API_KEY to Vercel env vars to enable real AI."
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze the following feedback from a ${role} for a pharmacy pickup app called Pharmelo.
      Feedback: "${feedback}"
      Return a JSON object with: analysis, sentiment ('positive', 'neutral', 'constructive'), and strategicAction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return new Response(response.text(), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      analysis: "AI Service Temporarily Unavailable", 
      sentiment: "neutral", 
      strategicAction: "Manual review required." 
    }), { status: 200 });
  }
}
