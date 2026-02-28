import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const imageUrl = "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTc0ZGMyNDcwLTRlNzEtMTFlZi04MGUwLTg5MTBmNjk1YjZkZS5qcGc=";
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64, mimeType: "image/jpeg" } },
            { text: "List the exact drugs and dosages written in this prescription." }
          ]
        }
      ]
    });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}
run();
