import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { get, set } from 'idb-keyval';

// Helper to wrap raw 16-bit PCM data in a WAV file format
function createWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // 1 channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);

  // Copy PCM data
  new Uint8Array(buffer, 44).set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}

const slidePrompts: Record<string, string> = {
  'intro': "So, what's the problem? Yaar, aaj kal medicine order karna aur un handwritten prescriptions ko samajhna kitna stressful hai na? Lambi lines, dawai na milna, aur chronic patients ke liye no refill reminders. Healthcare feels broken.",
  'what': "Toh hum kya kar rahe hain? We are building the Pharmelo Ecosystem. Ek smart AI prescription reader, WhatsApp aur mobile app se hybrid ordering, real-time stock tracking, aur auto-refill alerts. Sab kuch ek jagah.",
  'demo': "Yeh dekho hamara dual-phone ecosystem kaise kaam karta hai. Step one, WhatsApp par prescription bhejo. Step two, AI read karega. Step three, Consumer App mein sync hoga. Step four, pharmacy ko order milega. Step five, order prepare hoga. Aur step six, aapko WhatsApp par confirmation mil jayegi. Super chill!",
  'why': "Why are we doing this? Hamara mission simple hai. Patients aur caregivers ka time bachana, medication errors ko eliminate karna, aur local pharmacies ko replace kiye bina unhe digitize karna. Healthcare accessible honi chahiye.",
  'think': "Why we think this works? Kyunki WhatsApp toh Solan mein sab use karte hain. AI background mein saara complex kaam karta hai, aur aapko milti hai simplicity. Hum local shops ke saath partner karke local economy ko support kar rahe hain.",
  'help': "Toh aap kaise help kar sakte hain? Join the healthcare revolution! Hamara survey fill kijiye, honest feedback dijiye, local doctors aur pharmacists ko bataiye, aur hamari priority waitlist join kijiye. Let's build this together!"
};

interface PresentationAudioEngineProps {
  currentSlideId: string;
}

const PresentationAudioEngine: React.FC<PresentationAudioEngineProps> = ({ currentSlideId }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      const prompt = slidePrompts[currentSlideId];
      if (!prompt) return;

      const cacheKey = `pharmelo_slide_audio_${currentSlideId}`;
      
      try {
        // 1. Check IndexedDB for cached audio
        const cachedBase64 = await get(cacheKey);
        let base64Audio = cachedBase64;

        // 2. If not cached, generate it
        if (!base64Audio) {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            console.error("VITE_GEMINI_API_KEY is missing");
            return;
          }
          const ai = new GoogleGenAI({ apiKey });
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

          base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio) {
            // Save to IndexedDB for future use
            await set(cacheKey, base64Audio);
          }
        }

        // 3. Convert base64 to Blob URL
        if (base64Audio) {
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const wavBlob = createWavBlob(bytes, 24000);
          const url = URL.createObjectURL(wavBlob);
          
          if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl);
          }
          
          setCurrentAudioUrl(url);
        }
      } catch (error) {
        console.error(`Failed to load/generate audio for slide ${currentSlideId}:`, error);
      }
    };

    loadAndPlayAudio();
    
    // Cleanup on unmount
    return () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [currentSlideId]);

  // Autoplay logic
  useEffect(() => {
    if (currentAudioUrl && audioRef.current) {
      // Play automatically behind the scenes
      audioRef.current.play().catch(e => {
        console.warn("Autoplay prevented by browser. User interaction needed:", e);
      });
    }
  }, [currentAudioUrl]);

  return (
    <audio 
      ref={audioRef} 
      src={currentAudioUrl || undefined} 
      className="hidden" // Invisible player
    />
  );
};

export default PresentationAudioEngine;
