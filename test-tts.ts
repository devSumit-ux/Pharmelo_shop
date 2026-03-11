import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function test() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: "Hello world" }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  console.log("MimeType:", part?.inlineData?.mimeType);
}

test();
