import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import WaitlistModal from './WaitlistModal';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Don't show on the Wishlist page (destination) or Partner form
  if (location.pathname === '/wishlist' || location.pathname === '/partner-form') return null;

  const animationClass = isVisible 
    ? "translate-y-0 opacity-100" 
    : "translate-y-full opacity-0 pointer-events-none";

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 py-4 pb-6 sm:pb-4 px-4 md:px-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out transform ${animationClass}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Text Section - Hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">Pharmelo is launching soon.</p>
              <p className="text-slate-500 text-xs font-medium">Be the first to skip the line.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
             <Link 
               to="/roadmap" 
               className="text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors whitespace-nowrap"
             >
               Learn More
             </Link>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 flex items-center gap-2 transform active:scale-95 whitespace-nowrap"
             >
               Join Waitlist <ArrowRight className="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>
      
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="waitlist"
      />
    </>
  );
};

export default StickyCTA;