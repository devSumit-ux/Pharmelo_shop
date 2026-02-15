
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
      return new Response(JSON.stringify({ error: 'Server misconfigured: Missing API Key' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze the following feedback from a ${role} for a pharmacy pickup app called Pharmelo.
      Feedback: "${feedback}"
      
      Return a JSON object with these keys:
      - analysis: A empathetic summary of their point.
      - sentiment: 'positive', 'neutral', or 'constructive'.
      - strategicAction: A specific feature or business action Pharmelo should take to address this.
      
      Do not format as markdown. Just raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Using a fast, reliable model for backend
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text();
    return new Response(text, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ 
      analysis: "AI Service Temporarily Unavailable", 
      sentiment: "neutral", 
      strategicAction: "Manual review required." 
    }), { status: 200 }); // Fail gracefully
  }
}
