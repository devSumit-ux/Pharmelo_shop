import React, { useState } from 'react';
import { MapPin, ShoppingBag, ShieldCheck, Sparkles, RefreshCw, Zap } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: "Hyper-local Network",
    desc: "We help you find the medicine you need at pharmacies right in your neighborhood.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    icon: Zap,
    title: "Real-time Inventory",
    desc: "Stop calling around. See exactly which store has your medicine in stock instantly before you leave home.",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    icon: ShoppingBag,
    title: "Zero-Wait Pickup",
    desc: "Your order is packed before you arrive. Walk past the queue, grab your package, and go.",
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },
  {
    icon: Sparkles,
    title: "AI Health Assistant",
    desc: "Unsure about a generic brand? Our AI suggests safe, cost-effective alternatives instantly.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    icon: RefreshCw,
    title: "Smart Auto-Refills",
    desc: "We'll reserve your monthly meds automatically so they are ready for pickup on your schedule.",
    color: "text-pink-600",
    bg: "bg-pink-50"
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Partners",
    desc: "Every pharmacy on Pharmelo is physically verified and licensed. No fake medicines, ever.",
    color: "text-teal-600",
    bg: "bg-teal-50"
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything you need for <span className="text-blue-600">better health</span>.
          </h2>
          <p className="text-slate-500 text-lg">
            Pharmelo streamlines your pharmacy visits, making healthcare accessible, transparent, and incredibly fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm flex-grow font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;