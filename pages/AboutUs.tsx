
import React from 'react';
import { Pill, GraduationCap, Target, Heart, ArrowRight, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
             <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Born in a Dorm Room. <br />
            Built for <span className="text-blue-600">The Community</span>.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Pharmelo (formerly Medzo) isn't just a tech startup; it's a student initiative to fix the broken pharmacy experience in Solan and beyond.
          </p>
        </div>
      </div>

      {/* Founder Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                 <div className="flex-1">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 font-bold text-sm mb-6">
                        <GraduationCap size={18} />
                        <span>The Founder</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Meet <span className="text-indigo-600">Sumit Gupta</span>
                     </h2>
                     <p className="text-slate-600 text-lg leading-relaxed mb-6">
                        Pharmelo was founded by Sumit Gupta, a visionary <strong>student of Pharmacy currently studying at Shoolini University</strong>. 
                     </p>
                     <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        Observing the daily struggles of patients waiting in long lines and the inefficiencies in local medical shops, Sumit decided to bridge the gap between healthcare education and technology. His mission is to ensure that no patient in Solan has to wait for essential medicines.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:sumit@pharmelo.com" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                            Contact Sumit
                        </a>
                        <Link to="/roadmap" className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                            View Our Roadmap
                        </Link>
                     </div>
                 </div>
                 
                 <div className="flex-1 w-full max-w-sm">
                    <div className="aspect-[4/5] bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <span className="text-3xl font-bold">S</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Sumit Gupta</h3>
                            <p className="text-indigo-600 font-medium text-sm mb-2">Pharmacy Student</p>
                            <div className="inline-block bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
                                Shoolini University
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
      </div>

      {/* From Medzo to Pharmelo - REBRANDING STORY */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg"><History className="text-blue-300" /></div>
                <span className="text-blue-300 font-bold uppercase tracking-widest text-sm">The Evolution</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">From Medzo to Pharmelo</h2>
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
               <p>
                  The journey began as <strong>Medzo</strong>. Sumit Gupta launched Medzo as a pilot project within the Shoolini University campus. The goal was simple: help students find medicines without walking miles to the nearest chemist.
               </p>
               <p>
                  Medzo quickly gained traction, but the vision grew bigger. To serve the entire city of Solan and eventually all of Himachal Pradesh, we evolved.
               </p>
               <p>
                  Today, <strong>Pharmelo</strong> is the realized dream of Medzo—a robust, city-wide network connecting every major pharmacy in Solan. While the name has changed to reflect our speed ("Pharma" + "Velocity"), our core mission remains the same.
               </p>
            </div>
         </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Target size={28} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
               <p className="text-slate-500 leading-relaxed">
                  To digitize every local pharmacy in Himachal Pradesh, empowering small business owners with modern tools while providing patients with an instant, transparent, and wait-free experience.
               </p>
            </div>
            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Heart size={28} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Why We Exist</h3>
               <p className="text-slate-500 leading-relaxed">
                  Healthcare is personal. We believe technology shouldn't replace the local pharmacist but strengthen the bond between them and the community. Pharmelo keeps the business local.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutUs;
