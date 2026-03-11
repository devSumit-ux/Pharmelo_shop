
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
  Sparkles,
  FileText,
  Calendar
} from 'lucide-react';

const PRESCRIPTION_IMG = "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTc0ZGMyNDcwLTRlNzEtMTFlZi04MGUwLTg5MTBmNjk1YjZkZS5qcGc=";

const PresentationAnimation: React.FC = () => {
  const [step, setStep] = useState(0);

  // Animation sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 7);
    }, 4500); // 4.5 seconds per step
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 blur-[100px] pointer-events-none" />

      {/* Connection Bridge Line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center justify-items-center">
        
        {/* Connection Beam Animation */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="connection-beam-1"
              initial={{ x: "-50%", y: "-10%", opacity: 0, scale: 0 }}
              animate={{ 
                x: ["-50%", "0%"], 
                y: ["-10%", "-10%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.5, 0.5]
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-blue-400 flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Syncing App</span>
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="connection-beam-2"
              initial={{ x: "0%", y: "-10%", opacity: 0, scale: 0 }}
              animate={{ 
                x: ["0%", "50%"], 
                y: ["-10%", "-10%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.5, 0.5]
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-400 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-indigo-400 flex items-center gap-2">
                  <Sparkles className="text-indigo-500 w-5 h-5" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Sending Order</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone 1: WhatsApp AI Chat */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-green-400 font-bold mb-4 uppercase tracking-widest text-xs">1. Pharmelo AI (WhatsApp)</p>
          <div className="w-full h-[560px] bg-slate-800 rounded-[3rem] border-[6px] border-slate-700 relative overflow-hidden shadow-2xl">
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
            <div className="p-3 space-y-3 h-[420px] overflow-y-auto bg-[#E5DDD5] custom-scrollbar pb-16">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div 
                    key="chat-prescription"
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-[#DCF8C6] p-2 rounded-lg self-end ml-auto max-w-[85%] shadow-sm text-xs"
                  >
                    <div className="bg-slate-200 h-28 w-full rounded mb-1 overflow-hidden relative">
                      <img src={PRESCRIPTION_IMG} alt="Prescription" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <p>Here is my prescription.</p>
                  </motion.div>
                )}

                {step >= 2 && (
                  <motion.div 
                    key="chat-ai-processing"
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-white p-2 rounded-lg mr-auto max-w-[90%] shadow-sm text-xs relative overflow-hidden"
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
                    <p className="mb-1">Found: <strong>CALPOL</strong>, <strong>Delcon</strong>, <strong>Levolin</strong>, <strong>Meftal-p</strong>.</p>
                    <p>I see this is from <strong>Dr. Sharma</strong>. Would you like to order these and book a follow-up appointment?</p>
                  </motion.div>
                )}

                {step >= 3 && (
                  <motion.div 
                    key="chat-user-confirm"
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-[#DCF8C6] p-2 rounded-lg self-end ml-auto max-w-[80%] shadow-sm text-xs"
                  >
                    <p>Yes, order medicines and book appointment.</p>
                  </motion.div>
                )}

                {step >= 6 && (
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
            <div className="absolute bottom-0 w-full p-3 bg-slate-100 flex items-center gap-2 z-10">
              <div className="flex-grow bg-white rounded-full h-10 px-4 flex items-center text-slate-400 text-xs">
                Type a message...
              </div>
              <div className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center text-white shrink-0">
                <Send size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Phone 2: Consumer App */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-xs">2. Consumer App</p>
          <div className="w-full h-[560px] bg-slate-50 rounded-[3rem] border-[6px] border-slate-200 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-2xl z-20" />
            
            {/* App Header */}
            <div className="bg-white p-6 pt-10 flex items-center justify-between border-b border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <User className="text-white w-4 h-4" />
                </div>
                <p className="font-black text-slate-900 text-sm italic">PHARMELO</p>
              </div>
              <Bell className="text-slate-400 w-5 h-5" />
            </div>

            {/* App Content */}
            <div className="p-4 space-y-4 h-[420px] overflow-y-auto custom-scrollbar">
              <h4 className="font-bold text-slate-900">My Health Hub</h4>

              <AnimatePresence>
                {step >= 3 ? (
                  <motion.div 
                    key="consumer-order"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md">ORDER #882</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${step >= 6 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {step >= 6 ? 'CONFIRMED' : 'PROCESSING'}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <img src={PRESCRIPTION_IMG} alt="Prescription" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">Medicines</p>
                        <p className="text-[10px] text-slate-500">• CALPOL, Delcon</p>
                        <p className="text-[10px] text-slate-500">• Levolin, Meftal-p</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-900">Dr. Sharma Appointment</p>
                        <p className="text-[9px] text-slate-500">Requested for tomorrow</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="consumer-empty"
                    className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-2"
                  >
                    <FileText className="w-6 h-6 text-slate-300" />
                    No active orders
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 w-full h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-10">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="text-blue-600 w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <User className="text-slate-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Phone 3: Pharmelo Partner App */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">3. Partner App</p>
          <div className="w-full h-[560px] bg-white rounded-[3rem] border-[6px] border-slate-200 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-2xl z-20" />
            
            {/* App Header */}
            <div className="p-6 pt-10 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Pill className="text-white w-4 h-4" />
                </div>
                <p className="font-black text-slate-900 text-sm italic">PARTNER</p>
              </div>
              <StoreIcon className="text-slate-400 w-5 h-5" />
            </div>

            {/* App Content */}
            <div className="p-4 space-y-4 h-[420px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Active Orders</h4>
                <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
              </div>

              <AnimatePresence>
                {step >= 4 ? (
                  <motion.div 
                    key="partner-order"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-indigo-50 border-2 border-indigo-200 p-3 rounded-2xl relative overflow-hidden"
                  >
                    {step === 4 && (
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute top-0 left-0 w-full h-1 bg-indigo-400"
                      />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase">New Order #882</p>
                        <p className="text-xs font-bold text-slate-900">Customer: Rahul S.</p>
                      </div>
                      <Bell className="text-indigo-600 w-4 h-4 animate-bounce" />
                    </div>
                    
                    <div className="flex gap-2 mb-2">
                      <div className="w-12 h-12 rounded border border-indigo-200 overflow-hidden shrink-0">
                        <img src={PRESCRIPTION_IMG} alt="Prescription" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                          <span>CALPOL, Delcon</span>
                          <span>x1</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                          <span>Levolin, Meftal-p</span>
                          <span>x1</span>
                        </div>
                      </div>
                    </div>
                    
                    {step >= 5 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full mt-2 bg-green-100 text-green-700 text-[10px] font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <CheckCheck size={14} /> Accepted & Preparing
                      </motion.div>
                    ) : (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full mt-2 bg-indigo-600 text-white text-[10px] font-bold py-2 rounded-lg shadow-md hover:bg-indigo-700"
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
            <div className="absolute bottom-0 w-full h-16 border-t border-slate-100 flex items-center justify-around px-4 z-10 bg-white">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <Smartphone className="text-indigo-600 w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <MessageSquare className="text-slate-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

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
              {step === 2 && "Pharmelo AI reads prescription & suggests doctor booking"}
              {step === 3 && "Order instantly syncs to Consumer App"}
              {step === 4 && "Order appears in Partner Pharmacy App"}
              {step === 5 && "Pharmacist accepts & starts preparing"}
              {step === 6 && "User gets a confirmation message"}
            </h3>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              {step === 0 && "See how Pharmelo bridges the gap between users, doctors, and local shops."}
              {step === 1 && "No new apps to download. Just use the WhatsApp you already love."}
              {step === 2 && "Our AI understands handwritten prescriptions and integrates doctor appointments."}
              {step === 3 && "All health records and active orders are securely stored in the Consumer App."}
              {step === 4 && "Real-time notifications ensure zero delays in healthcare for partners."}
              {step === 5 && "Streamlined workflow for shop owners to manage digital sales."}
              {step === 6 && "A seamless, fast, and reliable experience for everyone."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper component for Store icon since it wasn't imported from lucide-react in the original list
const StoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
  </svg>
);

export default PresentationAnimation;
