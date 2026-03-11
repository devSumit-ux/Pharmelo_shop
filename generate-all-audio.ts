import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY found.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

function createWavBuffer(pcmData: Uint8Array, sampleRate: number = 24000): Buffer {
  const buffer = Buffer.alloc(44 + pcmData.length);
  
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + pcmData.length, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // 1 channel
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(pcmData.length, 40);

  Buffer.from(pcmData).copy(buffer, 44);

  return buffer;
}

const pages = [
  {
    id: "home",
    prompt: "Welcome to Pharmelo! Yaar, local pharmacies se medicine lena ab super easy hai. Just WhatsApp us and relax. Scroll down to explore our features!"
  },
  {
    id: "presentation",
    prompt: "Hey guys! Welcome to Pharmelo. Yaar, aaj kal medicine order karna aur un handwritten prescriptions ko samajhna kitna stressful hai na? Isiliye humne banaya hai Pharmelo. Yeh dekho hamara dual-phone ecosystem kaise kaam karta hai. Step one, aap bas WhatsApp par apne prescription ki photo bhejo. Step two, hamara smart AI usko read karke medicines aur doctor details nikal lega. Step three, aapka order turant Consumer App mein sync ho jayega. Step four, local pharmacy partner ko unke app par order mil jayega. Step five, wo order accept karke prepare karna shuru kar denge. Aur finally, step six, aapko WhatsApp par confirmation mil jayegi. Hai na super chill? No new apps needed, just simple, smart healthcare!"
  },
  {
    id: "about",
    prompt: "Hey! Hum hain Pharmelo team. Humara mission hai Solan aur baaki cities mein healthcare ko accessible aur simple banana. Meet the team and see our vision!"
  },
  {
    id: "roadmap",
    prompt: "Yeh hai hamara master plan! Dekho hum aage kya kya features laane wale hain. The future of healthcare is right here."
  },
  {
    id: "shop-owner-demo",
    prompt: "Welcome shop owners! Dekhiye Pharmelo partner app kaise aapki sales aur inventory ko manage karne mein help karta hai. Super easy aur efficient!"
  },
  {
    id: "survey",
    prompt: "Yaar, aapka feedback hamare liye bahut important hai. Please yeh chhota sa survey fill kardo taaki hum Pharmelo ko aur better bana sakein."
  },
  {
    id: "partner",
    prompt: "Pharmelo ke saath partner banna chahte ho? Great choice! Bas yeh form fill kardo aur humari team aapse jaldi connect karegi."
  }
];

async function generateAll() {
  const audioDir = path.join(process.cwd(), 'public', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  for (const page of pages) {
    console.log(`Generating audio for ${page.id}...`);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: page.prompt }] }],
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
        const pcmData = Buffer.from(base64Audio, 'base64');
        const wavBuffer = createWavBuffer(pcmData, 24000);
        fs.writeFileSync(path.join(audioDir, `${page.id}.wav`), wavBuffer);
        console.log(`✅ Saved ${page.id}.wav`);
      } else {
        console.error(`❌ Failed to generate audio for ${page.id}: No data`);
      }
    } catch (e) {
      console.error(`❌ Error generating audio for ${page.id}:`, e);
    }
  }
}

generateAll();
