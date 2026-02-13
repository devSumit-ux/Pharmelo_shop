import React from 'react';
import { Clock, Check, X } from 'lucide-react';

const Mission: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-20 max-w-4xl">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-6 text-sm">Our Mission</h2>
          <p className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            We are killing the <span className="text-slate-300 line-through decoration-blue-500 decoration-4">Queue</span>.
            <br />
            Pharmacy visits should be instant.
          </p>
          <p className="mt-8 text-xl text-slate-500 max-w-2xl leading-relaxed">
            Pharmelo isn't just an app; it's a new operating system for your local pharmacy. 
            We bridge the digital and physical worlds so you never have to guess if your medicine is in stock again.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* The Old Way - Gray Card */}
          <div className="group relative p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5">
            <div className="absolute top-8 right-8 p-3 bg-red-100 rounded-full">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-6">The Old Way</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-slate-400 mt-1" />
                <div>
                  <strong className="block text-slate-700 text-lg">Uncertainty</strong>
                  <span className="text-slate-500">Driving to the shop hoping they have stock.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-slate-400 mt-1" />
                <div>
                  <strong className="block text-slate-700 text-lg">Waiting</strong>
                  <span className="text-slate-500">Standing in line while the pharmacist searches shelves.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-slate-400 mt-1" />
                <div>
                  <strong className="block text-slate-700 text-lg">Confusion</strong>
                  <span className="text-slate-500">Illegible prescriptions and mix-ups at the counter.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* The Pharmelo Way - White Premium Card */}
          <div className="group relative p-10 rounded-[2.5rem] bg-white border border-blue-100 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.25)] transition-shadow">
             <div className="absolute top-8 right-8 p-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
              <Check className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">The Pharmelo Way</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-blue-50 p-1.5 rounded-lg">
                   <Check className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <strong className="block text-slate-900 text-lg">Confirmed Stock</strong>
                  <span className="text-slate-500">See exactly what's on the shelf before you leave home.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-blue-50 p-1.5 rounded-lg">
                   <Check className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <strong className="block text-slate-900 text-lg">Zero Wait</strong>
                  <span className="text-slate-500">Your order is pre-packed. Walk in, show code, walk out.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-blue-50 p-1.5 rounded-lg">
                   <Check className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <strong className="block text-slate-900 text-lg">Smart Substitutes</strong>
                  <span className="text-slate-500">AI suggests cheaper, available alternatives instantly.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;