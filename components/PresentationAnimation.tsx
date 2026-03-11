
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Camera, 
  Send, 
  Bell, 
  CheckCheck, 
  Pill, 
  User,
  Smartphone,
  Bot,
  Sparkles
} from 'lucide-react';

const PresentationAnimation: React.FC = () => {
  const [step, setStep] = useState(0);

  // Animation sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 5000); // 5 seconds per step (30s total for 6 steps)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 blur-[100px] pointer-events-none" />

      {/* Connection Bridge Line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        
        {/* Connection Beam Animation */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              key="connection-beam"
              initial={{ x: "-20%", y: "-10%", opacity: 0, scale: 0 }}
              animate={{ 
                x: ["-20%", "20%"], 
                y: ["-10%", "-10%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.5, 0.5]
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-blue-400 flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Syncing Data</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Phone: WhatsApp AI Chat */}
        <div className="flex flex-col items-center">
          <p className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-xs">User: WhatsApp AI</p>
          <div className="w-[280px] h-[560px] bg-slate-800 rounded-[3rem] border-[6px] border-slate-700 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-20" />
            
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] p-4 pt-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Pharmelo AI</p>
                <p className="text-white/60 text-[10px]">online</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 space-y-3 h-[400px] overflow-hidden bg-[#E5DDD5]">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div 
                    key="chat-prescription"
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-[#DCF8C6] p-2 rounded-lg self-end ml-auto max-w-[80%] shadow-sm text-xs"
                  >
                    <div className="bg-slate-200 h-24 w-full rounded mb-1 flex items-center justify-center">
                      <Camera className="text-slate-400" />
                    </div>
                    <p>Sending prescription photo...</p>
                  </motion.div>
                )}

                {step >= 2 && (
                  <motion.div 
                    key="chat-ai-processing"
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-white p-2 rounded-lg mr-auto max-w-[80%] shadow-sm text-xs relative overflow-hidden"
                  >
                    {step === 2 && (
                      <motion.div 
                        key="ai-scan-line"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"
                      />
                    )}
                    <p className="flex items-center gap-1 text-blue-600 font-bold mb-1">
                      <Sparkles size={12} /> AI Processing...
                    </p>
                    <p>Scanning handwritten notes. Found: Paracetamol 500mg, Amoxicillin...</p>
                  </motion.div>
                )}

                {step >= 5 && (
                  <motion.div 
                    key="chat-confirmed"
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-white p-2 rounded-lg mr-auto max-w-[80%] shadow-sm text-xs"
                  >
                    <p>Order Confirmed! Pharmacy is preparing your medicines. ✅</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full p-3 bg-slate-100 flex items-center gap-2">
              <div className="flex-grow bg-white rounded-full h-10 px-4 flex items-center text-slate-400 text-xs">
                Type a message...
              </div>
              <div className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center text-white">
                <Send size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Phone: Pharmelo Partner App */}
        <div className="flex flex-col items-center">
          <p className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">Partner: Pharmelo App</p>
          <div className="w-[280px] h-[560px] bg-white rounded-[3rem] border-[6px] border-slate-200 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-2xl z-20" />
            
            {/* App Header */}
            <div className="p-6 pt-10 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Pill className="text-white w-4 h-4" />
                </div>
                <p className="font-black text-slate-900 text-sm italic">PHARMELO</p>
              </div>
              <User className="text-slate-400 w-5 h-5" />
            </div>

            {/* App Content */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Active Orders</h4>
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
              </div>

              <AnimatePresence>
                {step >= 3 ? (
                  <motion.div 
                    key="order-card"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute top-0 left-0 w-full h-1 bg-blue-400"
                    />
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] text-blue-600 font-bold uppercase">New Order #882</p>
                        <p className="text-xs font-bold text-slate-900">Customer: Rahul S.</p>
                      </div>
                      <Bell className="text-blue-600 w-4 h-4 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Paracetamol 500mg</span>
                        <span>x2</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Amoxicillin</span>
                        <span>x1</span>
                      </div>
                    </div>
                    
                    {step >= 4 && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full mt-3 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg"
                      >
                        Accept & Prepare
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="waiting-placeholder"
                    className="h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-xs"
                  >
                    Waiting for orders...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Today's Sales</p>
                  <p className="text-sm font-black text-slate-900">₹4,250</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Customers</p>
                  <p className="text-sm font-black text-slate-900">12</p>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 w-full h-16 border-t flex items-center justify-around px-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Smartphone className="text-blue-600 w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <MessageSquare className="text-slate-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Hand Animation Overlay */}
        <motion.div 
          animate={{ 
            x: step === 1 ? [-100, 0] : step === 4 ? [400, 300] : -500,
            y: step === 1 ? [600, 450] : step === 4 ? [600, 400] : 600,
            opacity: (step === 1 || step === 4) ? 1 : 0
          }}
          transition={{ duration: 0.8, type: "spring" }}
          className="absolute z-50 pointer-events-none"
        >
          <div className="w-24 h-48 bg-[#E6B9A6] rounded-t-full shadow-2xl relative border-x-4 border-t-4 border-[#D4A38F]">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#D4A38F] rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Step Description */}
      <div className="mt-12 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h3 className="text-xl md:text-2xl font-black text-white italic">
              {step === 0 && "Ready to order?"}
              {step === 1 && "User sends prescription via WhatsApp"}
              {step === 2 && "Pharmelo AI scans & digitizes the order"}
              {step === 3 && "Order instantly appears in Pharmacy App"}
              {step === 4 && "Pharmacist accepts & starts preparing"}
              {step === 5 && "User gets a confirmation message"}
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {step === 0 && "See how Pharmelo bridges the gap between users and local shops."}
              {step === 1 && "No new apps to download. Just use the WhatsApp you already love."}
              {step === 2 && "Our AI understands handwritten prescriptions with high accuracy."}
              {step === 3 && "Real-time notifications ensure zero delays in healthcare."}
              {step === 4 && "Streamlined workflow for shop owners to manage digital sales."}
              {step === 5 && "A seamless, fast, and reliable experience for everyone."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PresentationAnimation;
