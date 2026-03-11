import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getStoredAudio, storeAudio } from '../services/audioService';

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
  'intro': "The Problem. Yaar, Solan ki local pharmacies mein lambi lines aur wait karna kitna annoying hai na? Upar se handwritten prescriptions samajh nahi aate jisse errors hote hain. Medicines ka stock hai ya nahi, pata hi nahi chalta. Aur chronic patients ke liye koi auto-refill reminder bhi nahi hai.",
  'what': "What we are doing. Hum bana rahe hain Pharmelo Ecosystem. Isme ek AI Prescription Reader hai jo handwritten notes ko digitize karta hai. Aap WhatsApp ya Mobile App dono se order kar sakte hain. Local pharmacies ka real-time stock track hota hai. Aur auto-refill alerts se aapki medicines kabhi khatam nahi hongi.",
  'why': "Why we are doing this. Hamara mission hai patients aur caregivers ka time bachana. Technology ke through medication errors ko khatam karna. Local pharmacies ko replace nahi, balki unhe digitize karke empower karna. Aur healthcare ko ek single WhatsApp message jitna accessible banana.",
  'think': "Why we think this works. Pharmelo ka advantage yeh hai ki WhatsApp toh Solan mein har koi use karta hai. AI saari complexity handle karta hai, toh aapko milti hai bilkul simplicity. Hum local shops ke saath partner karte hain, jisse local economy support hoti hai. Aur Solan se shuruwat karke hum ek deep local impact create kar rahe hain.",
  'help': "How you can help. Is healthcare revolution mein hamara saath dein. Hamare survey mein participate karein aur apna honest feedback dein. Apne local doctors aur pharmacists ko Pharmelo ke baare mein batayein. Aur April launch ke liye hamari priority waitlist join karein."
};

interface PresentationAudioPlayerProps {
  slideId: string;
  onEnded: () => void;
  onProgress: (progress: number) => void;
}

const PresentationAudioPlayer: React.FC<PresentationAudioPlayerProps> = ({ slideId, onEnded, onProgress }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Fallback timer: if audio doesn't finish in 30 seconds, move anyway
    // (Adjust time as needed based on prompt lengths)
    const fallbackTimer = setTimeout(() => {
      if (!isPlaying) {
        console.warn(`Audio fallback triggered for slide: ${slideId}`);
        onEnded();
      }
    }, 30000); 

    return () => clearTimeout(fallbackTimer);
  }, [slideId, isPlaying, onEnded]);

  useEffect(() => {
    const loadAudioForSlide = async () => {
      const prompt = slidePrompts[slideId];
      if (!prompt) {
        setCurrentAudioUrl(null);
        return;
      }

      const cacheKey = `pharmelo_audio_slide_hinglish_${slideId}`;
      
      try {
        // 1. Check for cached audio (IndexedDB + Supabase)
        let base64Audio = await getStoredAudio(cacheKey);

        // 2. If not cached, generate it
        if (!base64Audio) {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
          if (!apiKey) {
            console.error("GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your environment.");
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

          base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
          
          if (base64Audio) {
            // Save to backend and local cache
            await storeAudio(cacheKey, base64Audio);
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
        console.error("Failed to load/generate audio for slide:", error);
      }
    };

    loadAudioForSlide();
    
    // Cleanup on unmount
    return () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [slideId]);

  // Autoplay logic when audio URL changes
  useEffect(() => {
    if (currentAudioUrl && audioRef.current) {
      // Attempt to autoplay. This is hidden in the background.
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Silently handle autoplay rejection to prevent console warnings
          setIsPlaying(false);
        });
    }
  }, [currentAudioUrl]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    if (audio.duration) {
      onProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  return (
    <div className="hidden">
      {currentAudioUrl && (
        <audio 
          ref={audioRef} 
          src={currentAudioUrl} 
          autoPlay
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};

export default PresentationAudioPlayer;
