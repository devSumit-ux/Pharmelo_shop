import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getStoredAudio, storeAudio } from '../services/audioService';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';

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

const VoiceMessage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const generateAudio = async () => {
      setIsLoading(true);
      const cacheKey = 'pharmelo_voice_message_main';
      try {
        // 1. Check for cached audio (IndexedDB + Supabase)
        let base64Audio = await getStoredAudio(cacheKey);

        if (!base64Audio) {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
          if (!apiKey) {
            console.error("GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your environment.");
            setIsLoading(false);
            return;
          }
          const ai = new GoogleGenAI({ apiKey });
          const prompt = "Hey guys! Welcome to Pharmelo. Yaar, aaj kal medicine order karna aur un handwritten prescriptions ko samajhna kitna stressful hai na? Isiliye humne banaya hai Pharmelo. Yeh dekho hamara dual-phone ecosystem kaise kaam karta hai. Step one, aap bas WhatsApp par apne prescription ki photo bhejo. Step two, hamara smart AI usko read karke medicines aur doctor details nikal lega. Step three, aapka order turant Consumer App mein sync ho jayega. Step four, local pharmacy partner ko unke app par order mil jayega. Step five, wo order accept karke prepare karna shuru kar denge. Aur finally, step six, aapko WhatsApp par confirmation mil jayegi. Hai na super chill? No new apps needed, just simple, smart healthcare!";
          
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is a female voice
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

        if (base64Audio) {
          // Decode base64 to Uint8Array
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Wrap in WAV and create URL
          const wavBlob = createWavBlob(bytes, 24000);
          const url = URL.createObjectURL(wavBlob);
          setAudioUrl(url);
        }
      } catch (error) {
        console.error("Failed to generate voice message:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateAudio();
    
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)} 
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
      <button
        onClick={togglePlay}
        disabled={isLoading || !audioUrl}
        className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all border border-slate-200/50 backdrop-blur-md ${
          isPlaying 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' 
            : 'bg-white/90 text-slate-800 hover:bg-white shadow-slate-200/50'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        ) : isPlaying ? (
          <div className="relative flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
            <Pause className="w-4 h-4 fill-current" />
            <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full text-blue-600">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        )}
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold flex items-center gap-1">
            {isLoading ? 'Generating Audio...' : isPlaying ? 'Playing Explanation' : 'Play Explanation'}
            {isPlaying && <Sparkles className="w-3 h-3 text-yellow-300" />}
          </span>
          <span className={`text-[10px] font-medium ${isPlaying ? 'text-blue-100' : 'text-slate-500'}`}>
            Hinglish • AI Voice
          </span>
        </div>
        
        {!isLoading && !isPlaying && (
          <Volume2 className="w-4 h-4 ml-2 text-slate-400" />
        )}
      </button>
    </div>
  );
};

export default VoiceMessage;
