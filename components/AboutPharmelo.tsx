
import React from 'react';
import { AlertCircle, Zap, CheckCircle2 } from 'lucide-react';

const AboutPharmelo: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            What is <span className="text-blue-600">Pharmelo?</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Current medicine ordering systems are broken. Long queues, illegible prescriptions, and stock uncertainties make healthcare stressful. Pharmelo is a smart ecosystem built to solve these real-world problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">The Problem</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Fragmented ordering, handwritten prescription errors, and lack of refill reminders lead to poor health outcomes.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">How It's Different</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We use AI to read prescriptions and offer hybrid ordering via WhatsApp (voice/text/photo) or directly through our App for maximum convenience.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Goal</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              To validate these concepts through your feedback and build a platform that truly serves patients, doctors, and pharmacists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPharmelo;
