import React from 'react';
import { Search, CheckCircle2, Store } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Request",
    subtitle: "Step 01",
    desc: "Upload a prescription or search for meds from home.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-slate-100"
  },
  {
    icon: CheckCircle2,
    title: "Reserve",
    subtitle: "Step 02",
    desc: "We confirm stock and reserve it at a nearby store.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-slate-100"
  },
  {
    icon: Store,
    title: "Pickup",
    subtitle: "Step 03",
    desc: "Walk in, show your code, and collect instantly. No waiting.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-slate-100"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase mb-2 text-sm">How It Works</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900">
              Don't wait. Just collect.
            </h3>
          </div>
          <p className="text-slate-500 max-w-sm text-lg">
            Your time is valuable. Skip the counter queue entirely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className={`
              relative p-8 rounded-[2rem] bg-white
              border ${step.border} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
              hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1
              transition-all duration-300
            `}>
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl ${step.bg}`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">{step.subtitle}</span>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;