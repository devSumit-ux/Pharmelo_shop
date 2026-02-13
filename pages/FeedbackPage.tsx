import React from 'react';
import FeedbackLoop from '../components/FeedbackLoop';

const FeedbackPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen animate-fade-in bg-slate-50">
       <div className="py-16 px-4 text-center max-w-7xl mx-auto">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Co-Create Pharmelo</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">Community & Feedback</h1>
         <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
           We are building Pharmelo with you, for you. Use our AI-powered feedback tool to see how we address your specific needs.
         </p>
      </div>
      <FeedbackLoop />
    </div>
  );
};

export default FeedbackPage;