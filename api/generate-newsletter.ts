
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
       return new Response(JSON.stringify({
         subject: "Pharmelo Community Update 🚀",
         body: `We are growing fast! We now have ${stats.waitlist} users on the waitlist and ${stats.partners} pharmacy partners. (Note: Add API_KEY to Vercel for real AI generation)`
       }), { headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Write a newsletter update for Pharmelo. Users: ${stats.waitlist}, Partners: ${stats.partners}. JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return new Response(response.text(), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
