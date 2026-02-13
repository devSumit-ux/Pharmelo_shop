import React, { useState } from 'react';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
import HowItWorks from '../components/HowItWorks';
import FeaturesGrid from '../components/FeaturesGrid';
import WaitlistModal from '../components/WaitlistModal';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarHeart, Users } from 'lucide-react';

const Home: React.FC = () => {
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'waitlist' | 'community'}>({
    isOpen: false,
    type: 'waitlist'
  });

  const openModal = (type: 'waitlist' | 'community') => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return (
    <div className="animate-fade-in bg-white">
      {/* Hidden SEO Heading structure to help crawlers understand page hierarchy without affecting visual design */}
      <h1 className="sr-only">Pharmelo: Online Medicine Order & Pickup in Solan, Himachal Pradesh</h1>
      
      <Hero />
      <Mission />
      <HowItWorks />
      <FeaturesGrid />
      
      {/* Saturday Community Section */}
      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl shadow-indigo-600/20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
                <CalendarHeart className="h-4 w-4 text-indigo-200" />
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">New Initiative in Solan</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Join the Saturday Community.
              </h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-xl">
                Healthcare in Himachal isn't just about medicine; it's about people. Join our weekly newsletter where we share health tips, local community stories, and exclusive Pharmelo updates every Saturday.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => openModal('community')}
                  className="px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-lg transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  Join Community <Users className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Visual Representation */}
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">P</div>
                    <div>
                       <div className="font-bold">Pharmelo Weekly</div>
                       <div className="text-xs text-indigo-200">Saturday Edition</div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                    <div className="h-2 w-full bg-white/20 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-white/20 rounded-full"></div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-indigo-200">
                    <span>Read by 2,000+ locals</span>
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-indigo-600"></div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to experience the future?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join thousands of users in Solan who are switching to Pharmelo for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
               onClick={() => openModal('waitlist')}
               className="px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
             >
               Join Waitlist <ArrowRight className="h-5 w-5" />
             </button>
             <Link to="/owners" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-lg transition-all border border-slate-200 shadow-sm">
               Are you a Pharmacy?
             </Link>
          </div>
        </div>
      </section>

      {/* Global Modal Instance */}
      <WaitlistModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        type={modalState.type}
      />
    </div>
  );
};

export default Home;