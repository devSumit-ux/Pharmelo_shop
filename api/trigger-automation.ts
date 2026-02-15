
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Fallback keys from client-side config to ensure demo works without Vercel Env Vars
const FALLBACK_SB_URL = 'https://egcmmspwptftbcjrfock.supabase.co';
const FALLBACK_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnY21tc3B3cHRmdGJjanJmb2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjg4MzUsImV4cCI6MjA4NTg0NDgzNX0.BxQjbvhgOcE53_VoyllrFUzFgTXNaoSLR7d5dN-xA44';

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const apiKey = process.env.API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || FALLBACK_SB_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || FALLBACK_SB_KEY;

    // Initialize Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Fetch Real-time Stats for Context
    const { count: waitlistCount } = await supabase.from('waitlist_users').select('*', { count: 'exact', head: true });
    
    let emailContent;

    // 4. Generate Content (Use AI if key exists, else Mock)
    if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
          Write a short, exciting update email for Pharmelo users.
          Context: We just hit ${waitlistCount || 100} users.
          Output JSON: { "subject": "string", "body": "string" }
        `;
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        emailContent = JSON.parse(aiResponse.text() || '{}');
    } else {
        // MOCK FALLBACK
        emailContent = {
            subject: `Pharmelo Weekly: We hit ${waitlistCount || 100} Users! 🚀`,
            body: "This is an automated update. Our community is growing fast. Thank you for being an early supporter!"
        };
    }

    // 5. Log Campaign
    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert([{
        subject: emailContent.subject || "Weekly Update",
        content: emailContent.body || "Update content...",
        recipient_count: (waitlistCount || 0),
        status: 'sent',
        sent_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({
      success: true,
      message: apiKey ? 'Automation Executed with AI' : 'Automation Executed (Mock Mode - No API_KEY)',
      campaign: data,
      generated_content: emailContent
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Automation Failed:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Unknown Error'
    }), { status: 500 });
  }
}
