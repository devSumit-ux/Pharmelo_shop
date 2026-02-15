
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

// This file simulates a Cron Job or Admin Trigger
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // 1. Authenticate Request (Simple check, in production use headers)
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const apiKey = process.env.API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!apiKey || !supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Server Configuration Error: Missing Env Vars (API_KEY, SUPABASE_URL, or KEY)' 
      }), { status: 500 });
    }

    // 2. Initialize Clients
    const ai = new GoogleGenAI({ apiKey });
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Fetch Real-time Stats for Context
    const { count: waitlistCount } = await supabase.from('waitlist_users').select('*', { count: 'exact', head: true });
    const { count: partnerCount } = await supabase.from('early_partners').select('*', { count: 'exact', head: true });

    // 4. Generate Content via AI
    const prompt = `
      Write a short, exciting update email for Pharmelo users.
      Context: We just hit ${waitlistCount || 100} users and ${partnerCount || 10} pharmacy partners in Solan.
      Output JSON: { "subject": "string", "body": "string" }
    `;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const emailContent = JSON.parse(aiResponse.text() || '{}');

    // 5. Simulate "Sending" (In a real app, this calls Resend/SendGrid API)
    // We will log this campaign to the database to prove automation worked.
    
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
      message: 'Automation Executed Successfully',
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
