
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  Zap, 
  Heart, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  Stethoscope,
  PlayCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PresentationAnimation from '../components/PresentationAnimation';
import PresentationAudioPlayer from '../components/PresentationAudioPlayer';

const slides = [
  {
    id: 'intro',
    title: "The Problem",
    subtitle: "Why healthcare feels broken today",
    icon: <AlertCircle className="w-16 h-16 text-red-500" />,
    content: [
      "Long queues at local pharmacies in Solan.",
      "Illegible handwritten prescriptions causing errors.",
      "Uncertainty about medicine stock availability.",
      "Lack of automated refill reminders for chronic patients."
    ],
    bgColor: "bg-red-50"
  },
  {
    id: 'what',
    title: "What we are doing",
    subtitle: "Building the Pharmelo Ecosystem",
    icon: <Zap className="w-16 h-16 text-blue-500" />,
    content: [
      "AI Prescription Reader to digitize handwritten notes.",
      "Hybrid Ordering: WhatsApp (voice/text) + Mobile App.",
      "Real-time stock tracking across local pharmacies.",
      "Auto-refill alerts to ensure you never run out."
    ],
    bgColor: "bg-blue-50"
  },
  {
    id: 'demo',
    title: "How it works",
    subtitle: "Dual-Phone Ecosystem Demo",
    icon: <PlayCircle className="w-16 h-16 text-blue-600" />,
    isAnimation: true,
    bgColor: "bg-slate-50"
  },
  {
    id: 'why',
    title: "Why we are doing this",
    subtitle: "Our Mission & Vision",
    icon: <Heart className="w-16 h-16 text-emerald-500" />,
    content: [
      "To save precious time for patients and caregivers.",
      "To eliminate medication errors through technology.",
      "To digitize local pharmacies without replacing them.",
      "To make healthcare accessible with a single message."
    ],
    bgColor: "bg-emerald-50"
  },
  {
    id: 'think',
    title: "Why we think this works",
    subtitle: "The Pharmelo Advantage",
    icon: <ShieldCheck className="w-16 h-16 text-indigo-500" />,
    content: [
      "WhatsApp is already used by everyone in Solan.",
      "AI handles the complexity, users get simplicity.",
      "We partner with local shops, supporting the local economy.",
      "Launching in Solan first allows for deep local impact."
    ],
    bgColor: "bg-indigo-50"
  },
  {
    id: 'help',
    title: "How you can help",
    subtitle: "Join the Healthcare Revolution",
    icon: <HelpCircle className="w-16 h-16 text-orange-500" />,
    content: [
      "Participate in our survey to validate these features.",
      "Give us honest feedback on the proposed ecosystem.",
      "Spread the word to local doctors and pharmacists.",
      "Join our priority waitlist for the April launch."
    ],
    bgColor: "bg-orange-50"
  }
];

const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const slide = slides[currentSlide];

  const handleAudioEnded = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handleAudioProgress = (p: number) => {
    setProgress(p);
  };

  useEffect(() => {
    if (slide.id === 'demo') {
      // Progress for demo slide is handled by the step count (0-6)
      // We don't need a separate timer here anymore as PresentationAnimation 
      // will call onComplete when finished.
      return;
    }
  }, [slide.id]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-1000 ${slide.bgColor}`}>
      {/* Back Button */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 font-bold hover:bg-white hover:text-blue-600 transition-all shadow-lg border border-slate-100 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Exit Presentation
      </Link>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 z-50">
        <motion.div 
          className="h-full bg-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Manual Navigation Controls */}
      <div className="fixed inset-y-0 left-4 flex items-center z-40">
        <button
          onClick={() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setProgress(0);
          }}
          className="p-4 bg-white/50 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white hover:text-blue-600 transition-all shadow-lg border border-slate-100 group"
          aria-label="Previous Slide"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="fixed inset-y-0 right-4 flex items-center z-40">
        <button
          onClick={() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setProgress(0);
          }}
          className="p-4 bg-white/50 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white hover:text-blue-600 transition-all shadow-lg border border-slate-100 group"
          aria-label="Next Slide"
        >
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentSlide(idx);
              setProgress(0);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'bg-blue-600 w-8' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden ${slide.isAnimation ? 'md:p-8' : 'md:p-16'}`}
        >
          {/* Decorative background icon */}
          <div className="absolute -top-10 -right-10 opacity-5 transform rotate-12">
            {slide.icon}
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-4"
            >
              {slide.icon}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-5xl font-black text-slate-900 mb-2"
            >
              {slide.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-blue-600 font-bold uppercase tracking-widest"
            >
              {slide.subtitle}
            </motion.p>
          </div>

          {slide.isAnimation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <PresentationAnimation onComplete={handleAudioEnded} onProgress={handleAudioProgress} />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slide.content?.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (idx * 0.2) }}
                  className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="mt-1">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {currentSlide === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-12 flex justify-center"
            >
              <Link 
                to="/survey"
                className="px-10 py-4 bg-blue-600 text-white rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-3 group"
              >
                Start Survey <Zap className="w-6 h-6 group-hover:animate-pulse" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-6 text-slate-400 text-xs font-medium uppercase tracking-widest hidden md:block"
      >
        Pharmelo Presentation • Solan Launch 2026
      </motion.div>

      {/* Invisible Slide Audio Player */}
      <PresentationAudioPlayer 
        slideId={slide.id} 
        onEnded={handleAudioEnded}
        onProgress={handleAudioProgress}
      />
    </div>
  );
};

export default PresentationPage;
