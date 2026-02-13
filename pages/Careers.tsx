import React from 'react';
import { Briefcase, Rocket, Code, Megaphone, HeartHandshake, ArrowRight } from 'lucide-react';

const Careers: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
             <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">We are hiring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Join the <span className="text-emerald-600">Health Revolution</span>.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Help us build the operating system for India's pharmacies. 
            We are looking for passionate individuals who want to make a real impact in Solan.
          </p>
        </div>

        {/* Culture/Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
             { icon: Rocket, title: "High Impact", desc: "Your work directly affects how thousands of people access healthcare daily." },
             { icon: HeartHandshake, title: "Student-Led", desc: "Founded by students, for the community. We value passion over experience." },
             { icon: Briefcase, title: "Real Ownership", desc: "No red tape. If you have a good idea, you get to build it and own it." }
           ].map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6 text-slate-900">
                   <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Open Positions */}
        <div className="mb-20">
           <h2 className="text-2xl font-bold text-slate-900 mb-8">Open Positions</h2>
           <div className="space-y-4">
              
              {/* Job Card 1 */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <Code size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900">React / Frontend Intern</h3>
                       <div className="flex gap-3 text-sm text-slate-500 mt-1">
                          <span>Remote / Solan</span>
                          <span>•</span>
                          <span>Part-time</span>
                       </div>
                    </div>
                 </div>
                 <a href="mailto:careers@pharmelo.com?subject=Application for React Intern" className="px-6 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    Apply Now
                 </a>
              </div>

              {/* Job Card 2 */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                       <Megaphone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900">Marketing & Outreach</h3>
                       <div className="flex gap-3 text-sm text-slate-500 mt-1">
                          <span>Solan (On-site)</span>
                          <span>•</span>
                          <span>Internship</span>
                       </div>
                    </div>
                 </div>
                 <a href="mailto:careers@pharmelo.com?subject=Application for Marketing Intern" className="px-6 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    Apply Now
                 </a>
              </div>

           </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-slate-900/20">
           <h2 className="text-3xl font-bold mb-4">Don't see your role?</h2>
           <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We are always looking for talented pharmacy students, developers, and designers. 
              Drop us an email and tell us how you can help Pharmelo grow.
           </p>
           <a href="mailto:hello@pharmelo.com" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-colors">
              Email Founder <ArrowRight size={20} />
           </a>
        </div>

      </div>
    </div>
  );
};

export default Careers;