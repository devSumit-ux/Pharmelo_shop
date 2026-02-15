
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { stats } = await request.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const ai = new GoogleGenAI({ apiKey });

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
      4. Output Format: JSON with 'subject' and 'body'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return new Response(response.text(), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
