import React from 'react';
import { TrendingUp, Shield, Users, Store, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Owners: React.FC = () => {
  return (
    <div className="pt-32 pb-16 animate-fade-in bg-slate-50">
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
         {/* Background Blobs for Owners Page */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
         
         <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">For Pharmacy Owners</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
              Drive digital traffic to your <span className="text-blue-600">Physical Store</span>.
            </h1>
            <p className="text-slate-500 text-xl md:text-2xl mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Pharmelo connects you with local customers searching for medicine right now. 
              Let them order ahead, so you can pack it during downtime and serve them instantly when they arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-form" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/30">
                Partner with Pharmelo
              </Link>
              <Link to="/documentation" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md">
                View Documentation
              </Link>
            </div>
         </div>
      </section>

      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Users, 
                  title: "New Customers", 
                  desc: "Customers check Pharmelo before leaving home. Be the store they choose because they know you have the stock.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                { 
                  icon: Store, 
                  title: "Reduce Congestion", 
                  desc: "Pre-packed orders mean customers spend seconds at the counter, not minutes. Serve more people in less time.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                },
                { 
                  icon: TrendingUp, 
                  title: "Increase Basket Size", 
                  desc: "When customers come to pick up, they often buy more. Drive footfall that converts into real revenue.",
                  color: "text-cyan-600",
                  bg: "bg-cyan-50"
                }
              ].map((item, idx) => (
                <div key={idx} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)] transition-all duration-300">
                   <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                     <item.icon className={`h-7 w-7 ${item.color}`} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                   <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
      
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-16 shadow-lg shadow-blue-900/5">
           <div className="flex-1">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Simple Onboarding Process</h2>
             <ul className="space-y-8">
                {[
                  "Submit your Pharmacy License for verification.",
                  "Sync your inventory via our simple POS integration.",
                  "Start receiving pickup orders instantly."
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-6">
                     <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-lg shadow-sm">
                       {i + 1}
                     </div>
                     <p className="text-slate-700 text-lg font-medium pt-1">{step}</p>
                  </li>
                ))}
             </ul>
           </div>
           
           <div className="flex-1 w-full max-w-md relative">
              {/* Decorative Card */}
              <div className="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 rounded-full">
                         <Shield className="h-6 w-6 text-emerald-600" />
                       </div>
                       <div>
                         <div className="text-slate-900 font-bold text-lg">Verification</div>
                         <div className="text-slate-400 text-xs">Pharmelo Partner Program</div>
                       </div>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">ACTIVE</div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                          <span>License Check</span>
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                          <span>Inventory Sync</span>
                          <span className="text-emerald-600">98%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[98%] rounded-full"></div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-slate-400 text-sm">Your store is live on Pharmelo</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Owners;