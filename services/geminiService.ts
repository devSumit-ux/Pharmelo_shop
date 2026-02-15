
import { UserRole } from "../types";

// NOTE: We no longer import GoogleGenAI here. 
// We fetch from our own /api endpoints to keep keys secure on Vercel.

export const analyzeFeedback = async (
  feedback: string,
  role: UserRole
): Promise<{ analysis: string; sentiment: string; strategicAction: string }> => {
  
  try {
    const response = await fetch('/api/analyze-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, role })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Analysis Failed:", e);
    // Fallback logic
    const isNegative = feedback.toLowerCase().includes('wait') || feedback.toLowerCase().includes('slow');
    return {
      analysis: "Automated analysis unavailable. Saved for manual review.",
      sentiment: isNegative ? "constructive" : "neutral",
      strategicAction: "Reviewing feedback manually."
    };
  }
};

export const analyzeBatchFeedback = async (feedbacks: string[]) => {
  // For batch, we can reuse the analyze endpoint or create a specific one.
  // For simplicity in this demo, we'll return a placeholder or implement a specific batch endpoint later.
  // Currently disabling client-side batch to prevent massive token usage/key exposure.
  console.log("Batch analysis requested for server");
  return null; 
};

export const generateNewsletter = async (stats: { waitlist: number, partners: number, community: number }) => {
  try {
    const response = await fetch('/api/generate-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
    });

    if (!response.ok) throw new Error("Generation failed");
    return await response.json();
  } catch (e) {
    console.error("Newsletter Gen Error:", e);
    return {
      subject: "Pharmelo Update",
      body: "We are growing fast! (System update in progress)"
    };
  }
};
