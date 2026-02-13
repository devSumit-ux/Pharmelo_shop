import React from 'react';
import { Pill } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center font-sans">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-100/50 rounded-full blur-[80px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-ping"></div>
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-blue-900/10 flex items-center justify-center border border-slate-50 relative z-10 animate-[bounce_2s_infinite]">
            <Pill className="h-12 w-12 text-blue-600 -rotate-12" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 animate-fade-in">
          Pharmelo
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
          Pharmacy Network
        </p>

        {/* Loading Bar */}
        <div className="mt-12 w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;