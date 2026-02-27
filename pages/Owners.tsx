
import React from 'react';
import { TrendingUp, Shield, Users, Store, CheckCircle2, Laptop, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Owners: React.FC = () => {
  return (
    <div className="pt-32 pb-16 bg-slate-50">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
           <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">For Pharmacy Owners</span>
         </div>
         <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
           Drive digital traffic to your <span className="text-blue-600">Physical Store</span>.
         </h1>
         <p className="text-slate-500 text-xl mb-10 max-w-3xl mx-auto">
           Pharmelo connects you with local customers searching for medicine right now. 
           Let them order ahead, so you can pack it during downtime and serve them instantly.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/partner-form" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all">
             Partner with Pharmelo
           </Link>
           <Link to="/shop-demo" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-lg transition-all border border-slate-200 flex items-center gap-2 justify-center">
             <Laptop className="h-5 w-5 text-slate-500" /> Try Live Demo
           </Link>
         </div>
      </section>

      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Users, 
                  title: "New Customers", 
                  desc: "Customers check Pharmelo before leaving home. Be the store they choose.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                { 
                  icon: Store, 
                  title: "Reduce Congestion", 
                  desc: "Pre-packed orders mean customers spend seconds at the counter, not minutes.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                },
                { 
                  icon: TrendingUp, 
                  title: "Increase Basket Size", 
                  desc: "When customers come to pick up, they often buy more. Drive footfall.",
                  color: "text-cyan-600",
                  bg: "bg-cyan-50"
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
                   <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-6`}>
                     <item.icon className={`h-6 w-6 ${item.color}`} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
      
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-blue-100">
           <div className="flex-1">
             <h2 className="text-3xl font-bold text-slate-900 mb-6">Simple Onboarding</h2>
             <ul className="space-y-6">
                {[
                  "Submit your Pharmacy License for verification.",
                  "Sync your inventory via our simple POS integration.",
                  "Start receiving pickup orders instantly."
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm">
                       {i + 1}
                     </div>
                     <p className="text-slate-700 font-medium pt-1">{step}</p>
                  </li>
                ))}
             </ul>
             <div className="mt-8 pt-8 border-t border-blue-200">
                <Link to="/documentation" className="flex items-center gap-2 text-blue-700 font-bold hover:gap-3 transition-all">
                   <BookOpen size={20} /> Read Partner Documentation <ArrowRight size={16} />
                </Link>
             </div>
           </div>
           
           <div className="flex-1 w-full max-w-md">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-emerald-50 rounded-full">
                         <Shield className="h-5 w-5 text-emerald-600" />
                       </div>
                       <div>
                         <div className="text-slate-900 font-bold">Verification</div>
                         <div className="text-slate-400 text-xs">Pharmelo Partner Program</div>
                       </div>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">ACTIVE</div>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>License Check</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Inventory Sync</span>
                          <span className="text-emerald-600">98%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[98%] rounded-full"></div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                    <p className="text-slate-400 text-xs">Your store is live on Pharmelo</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Owners;
