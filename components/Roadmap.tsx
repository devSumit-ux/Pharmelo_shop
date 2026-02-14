import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mountain, Building2, Train, AlertCircle, FileCheck, Shield, Clock, Zap, Calendar, Check, Milestone } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { RoadmapPhase } from '../types';

// Map string keys to actual components
const ICON_MAP: Record<string, any> = {
  MapPin, Mountain, Building2, Train, Milestone, Calendar
};

const Roadmap: React.FC = () => {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPhases();
    
    // Realtime subscription for immediate updates from Admin
    const channel = supabase
      .channel('roadmap-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_phases' }, () => {
        fetchPhases();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPhases = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmap_phases')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) setPhases(data as RoadmapPhase[]);
      if (error) console.error("Error fetching roadmap:", error);
    } catch (e) {
      console.error(e);
    }
  };

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
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    const items = document.querySelectorAll('.roadmap-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [phases]);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        <div className="text-center mb-20 animate-fade-in">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Launch Timeline</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
             The Road to <span className="text-emerald-600">Pharmelo</span>.
           </h2>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
             We are building the future of pharmacy pickup. Follow our journey as we expand city by city.
           </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Line - Desktop */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block rounded-full" />
          
          {/* Central Line - Mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 block md:hidden rounded-full" />

          <div className="space-y-16 md:space-y-32 relative pt-8">
            {phases.map((phase, index) => {
              const IconComponent = ICON_MAP[phase.icon_key] || MapPin;
              const isVisible = visibleItems.includes(phase.id);
              const isCompleted = phase.status === 'completed';
              const isActive = phase.status === 'active';
              
              return (
                <div 
                  key={phase.id}
                  data-id={phase.id}
                  className={`roadmap-item relative flex flex-col md:flex-row items-center gap-8 md:gap-0 transition-all duration-1000 ease-out transform ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-20 scale-95'
                  } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Side */}
                  <div className={`flex-1 w-full pl-20 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3 uppercase shadow-sm transition-colors duration-500
                        ${isCompleted ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                        ${isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                        ${phase.status === 'upcoming' ? 'bg-slate-100 text-slate-500 border border-slate-200' : ''}
                    `}>
                      {isCompleted && <Check size={12} />}
                      {phase.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                      {phase.date_display || phase.subtitle}
                    </div>
                    
                    <h3 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900'}`}>
                        {phase.title}
                    </h3>
                    <p className={`font-medium leading-relaxed transition-colors duration-500 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                        {phase.description}
                    </p>
                  </div>

                  {/* Center Marker */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex-shrink-0 z-20">
                    <div className={`
                        w-16 h-16 rounded-full border-[4px] flex items-center justify-center relative shadow-2xl transition-all duration-700
                        ${isCompleted ? 'bg-green-500 border-green-100 scale-90' : ''}
                        ${isActive ? 'bg-white border-emerald-500 scale-110' : ''}
                        ${phase.status === 'upcoming' ? 'bg-white border-slate-200' : ''}
                    `}>
                       <IconComponent className={`
                           h-7 w-7 transition-all duration-500
                           ${isCompleted ? 'text-white' : ''}
                           ${isActive ? 'text-emerald-600' : ''}
                           ${phase.status === 'upcoming' ? 'text-slate-300' : ''}
                       `} />
                       
                       {/* Active Pulse Ring */}
                       {isActive && (
                         <span className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-ping"></span>
                       )}
                    </div>
                  </div>

                  {/* Spacer Side (for layout balance) */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Spotlight: Urgent & Verification */}
        <div className="mt-32 bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden transform transition-all hover:shadow-blue-900/10 duration-500">
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
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 hover:scale-[1.02] transition-transform">
                       <Zap className="h-6 w-6 text-red-500 mt-1" />
                       <div>
                          <h4 className="font-bold text-slate-900">Urgent Packing Priority</h4>
                          <p className="text-sm text-slate-600">Shop owners get a loud alert for urgent traveler orders.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:scale-[1.02] transition-transform">
                       <Shield className="h-6 w-6 text-blue-500 mt-1" />
                       <div>
                          <h4 className="font-bold text-slate-900">Mandatory Verification</h4>
                          <p className="text-sm text-slate-600">Upload your prescription ("Dawa ka purja"). We cross-verify every request for safety.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* UI Mockup for Urgent Flow */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 rotate-1 hover:rotate-0 transition-transform duration-500">
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