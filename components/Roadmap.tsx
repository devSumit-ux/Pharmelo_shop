import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mountain, Building2, Train, AlertCircle, FileCheck, Shield, Clock, Zap, Calendar } from 'lucide-react';

const phases = [
  {
    id: 'solan',
    city: 'Solan',
    status: 'LAUNCHING MARCH END',
    icon: MapPin,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    desc: 'The pilot city. We go live here by the end of March. Join the waitlist to be the first to skip the line.'
  },
  {
    id: 'hp',
    city: 'Himachal Pradesh',
    status: 'PHASE 2',
    icon: Mountain,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    desc: 'Connecting hill stations. Perfect for travelers who need medicines urgently while on winding roads.'
  },
  {
    id: 'delhi',
    city: 'Delhi NCR',
    status: 'PHASE 3',
    icon: Building2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    desc: 'Bringing speed to the capital. Skip the long metro-city queues and pre-book before you reach.'
  },
  {
    id: 'east',
    city: 'Kolkata & Bihar',
    status: 'PHASE 4',
    icon: Train,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    desc: 'Serving high-density areas where waiting lines are the longest. Reliable healthcare access for everyone.'
  }
];

const Roadmap: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id && !visibleItems.includes(id)) {
              setVisibleItems((prev) => [...prev, id]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = document.querySelectorAll('.roadmap-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="roadmap">
      {/* Background Track */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Launch Timeline</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
             The Road to <span className="text-emerald-600">Pharmelo</span>.
           </h2>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto">
             We are currently in the pre-launch phase. Join the waitlist to get notified when we launch in your city.
           </p>
        </div>

        {/* Timeline */}
        <div className="space-y-12 md:space-y-24 relative">
          {phases.map((phase, index) => (
            <div 
              key={phase.id}
              data-id={phase.id}
              className={`roadmap-item flex flex-col md:flex-row items-center gap-8 md:gap-0 transition-all duration-1000 transform ${
                visibleItems.includes(phase.id) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Content Side */}
              <div className={`flex-1 text-center ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3 ${phase.bg} ${phase.color}`}>
                  {phase.status}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">{phase.city}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{phase.desc}</p>
              </div>

              {/* Center Marker */}
              <div className="relative flex-shrink-0 z-10">
                <div className={`w-16 h-16 rounded-full bg-white border-4 ${phase.border} shadow-xl flex items-center justify-center relative`}>
                   <phase.icon className={`h-8 w-8 ${phase.color}`} />
                   {phase.id === 'solan' && (
                     <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                     </span>
                   )}
                </div>
              </div>

              {/* Spacer Side */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>

        {/* Feature Spotlight: Urgent & Verification */}
        <div className="mt-32 bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-6">
                   Travel Smart. <br/>
                   <span className="text-blue-600">Mark it Urgent.</span>
                 </h3>
                 <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                   Traveling through Himachal? Don't let a headache stop you. 
                   Book your meds on the go, mark them as <strong>"Urgent"</strong>, 
                   and the shop owner will prioritize packing your order with precision before you even reach the counter.
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 border border-red-100">
                       <Zap className="h-6 w-6 text-red-500 mt-1" />
                       <div>
                          <h4 className="font-bold text-slate-900">Urgent Packing Priority</h4>
                          <p className="text-sm text-slate-600">Shop owners get a loud alert for urgent traveler orders.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                       <Shield className="h-6 w-6 text-blue-500 mt-1" />
                       <div>
                          <h4 className="font-bold text-slate-900">Mandatory Verification</h4>
                          <p className="text-sm text-slate-600">Upload your prescription ("Dawa ka purja"). We cross-verify every request for safety.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* UI Mockup for Urgent Flow */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-400 uppercase">Upload Prescription</span>
                       <FileCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="h-24 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs flex-col gap-2">
                       <span>Tap to upload "Dawa ka Purja"</span>
                    </div>
                 </div>
                 
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="bg-red-100 p-2 rounded-full text-red-600">
                          <AlertCircle className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="font-bold text-slate-900 text-sm">Mark as Urgent</div>
                          <div className="text-[10px] text-slate-500">I am traveling / Emergency</div>
                       </div>
                    </div>
                    <div className="w-12 h-6 bg-red-500 rounded-full relative cursor-pointer">
                       <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm" />
                    </div>
                 </div>

                 <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                       <Clock className="h-3 w-3" />
                       <span>Pack time: ~2 mins</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;