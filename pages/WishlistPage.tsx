import React from 'react';
import WishlistFeature from '../components/WishlistFeature';

const WishlistPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen animate-fade-in bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-16 px-4 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Live Preview</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">Interactive Demo</h1>
         <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
           Try out the core feature of Pharmelo. Build a list and see how we categorize and track availability in real-time.
         </p>
      </div>
      <WishlistFeature />
    </div>
  );
};

export default WishlistPage;