import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { getStoredAudio, storeAudio } from '../services/audioService';
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

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

const pagePrompts: Record<string, string> = {
  '/': "Welcome to Pharmelo! Yaar, local pharmacies se medicine lena ab super easy hai. Just WhatsApp us and relax. Scroll down to explore our features!",
  '/about': "Hey! Hum hain Pharmelo team. Humara mission hai Solan aur baaki cities mein healthcare ko accessible aur simple banana. Meet the team and see our vision!",
  '/roadmap': "Yeh hai hamara master plan! Dekho hum aage kya kya features laane wale hain. The future of healthcare is right here.",
  '/shop-owner-demo': "Welcome shop owners! Dekhiye Pharmelo partner app kaise aapki sales aur inventory ko manage karne mein help karta hai. Super easy aur efficient!",
  '/survey': "Yaar, aapka feedback hamare liye bahut important hai. Please yeh chhota sa survey fill kardo taaki hum Pharmelo ko aur better bana sakein.",
  '/partner': "Pharmelo ke saath partner banna chahte ho? Great choice! Bas yeh form fill kardo aur humari team aapse jaldi connect karegi."
};

const GlobalAudioPlayer: React.FC = () => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Stop audio and revoke URL when route changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    const loadAudioForPage = async () => {
      const prompt = pagePrompts[location.pathname];
      if (!prompt) {
        setCurrentAudioUrl(null);
        return;
      }

      setIsLoading(true);
      const cacheKey = `pharmelo_audio_${location.pathname}`;
      
      try {
        // 1. Check for cached audio (IndexedDB + Supabase)
        let base64Audio = await getStoredAudio(cacheKey);

        // 2. If not cached, generate it
        if (!base64Audio) {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
          if (!apiKey) {
            console.error("GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your environment.");
            setIsLoading(false);
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
        console.error("Failed to load/generate audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudioForPage();
    
    // Cleanup on unmount
    return () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [location.pathname]);

  // Autoplay logic
  useEffect(() => {
    if (currentAudioUrl && autoPlayEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Silently handle autoplay rejection to prevent console warnings
        setAutoPlayEnabled(false);
      });
    }
  }, [currentAudioUrl, autoPlayEnabled]);

  const togglePlay = () => {
    if (!audioRef.current || !currentAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setAutoPlayEnabled(false); // User manually paused, disable autoplay
    } else {
      audioRef.current.play().catch(() => {
        // Silently handle playback failure
      });
      setAutoPlayEnabled(true); // User manually played, enable autoplay for future pages
    }
  };

  if (!pagePrompts[location.pathname]) {
    return null; // Don't show player on pages without prompts
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {currentAudioUrl && (
        <audio 
          ref={audioRef} 
          src={currentAudioUrl} 
          onEnded={() => setIsPlaying(false)} 
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
      <button
        onClick={togglePlay}
        disabled={isLoading || !currentAudioUrl}
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
            {isLoading ? 'Loading Voice...' : isPlaying ? 'Playing Explanation' : 'Play Explanation'}
            {isPlaying && <Sparkles className="w-3 h-3 text-yellow-300" />}
          </span>
          <span className={`text-[10px] font-medium ${isPlaying ? 'text-blue-100' : 'text-slate-500'}`}>
            {autoPlayEnabled ? 'Auto-play ON' : 'Auto-play OFF'} • AI Voice
          </span>
        </div>
        
        {!isLoading && (
          autoPlayEnabled ? <Volume2 className={`w-4 h-4 ml-2 ${isPlaying ? 'text-blue-200' : 'text-slate-400'}`} /> : <VolumeX className="w-4 h-4 ml-2 text-slate-400" />
        )}
      </button>
    </div>
  );
};

export default GlobalAudioPlayer;
