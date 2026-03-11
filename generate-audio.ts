import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY found.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function generate() {
  const prompt = "Hey guys! Welcome to Pharmelo. Yaar, aaj kal medicine order karna aur un handwritten prescriptions ko samajhna kitna stressful hai na? Isiliye humne banaya hai Pharmelo. Yeh dekho hamara dual-phone ecosystem kaise kaam karta hai. Step one, aap bas WhatsApp par apne prescription ki photo bhejo. Step two, hamara smart AI usko read karke medicines aur doctor details nikal lega. Step three, aapka order turant Consumer App mein sync ho jayega. Step four, local pharmacy partner ko unke app par order mil jayega. Step five, wo order accept karke prepare karna shuru kar denge. Aur finally, step six, aapko WhatsApp par confirmation mil jayegi. Hai na super chill? No new apps needed, just simple, smart healthcare!";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      fs.writeFileSync('public/presentation-audio.wav', Buffer.from(base64Audio, 'base64'));
      console.log('Audio saved successfully to public/presentation-audio.wav!');
    } else {
      console.error('Failed to generate audio: No data');
    }
  } catch (e) {
    console.error("Error generating audio:", e);
  }
}

generate();
