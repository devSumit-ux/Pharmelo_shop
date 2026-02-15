import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pill, Twitter, Instagram, Linkedin, Mail, X, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppConfig } from '../context/AppContext';

const Footer: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { config } = useAppConfig();

  // Helper to handle clicks on empty social links
  const handleSocialClick = (e: React.MouseEvent, url: string) => {
    if (!url || url === '#' || url === '') {
      e.preventDefault();
      setShowComingSoon(true);
    }
  };

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
               {config.logo_url ? (
                   <img src={config.logo_url} alt={config.app_name} className="h-8 w-auto object-contain brightness-0 invert" />
               ) : (
                   <>
                       <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                          <Pill className="h-5 w-5 text-white" />
                       </div>
                       <span className="text-xl font-bold text-white">{config.app_name}</span>
                   </>
               )}
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bridging the gap between local pharmacies and modern convenience. Order ahead, skip the line, and stay healthy.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">For Consumers</Link></li>
              <li><Link to="/owners" className="hover:text-blue-400 transition-colors">For Pharmacies</Link></li>
              <li><Link to="/wishlist" className="hover:text-blue-400 transition-colors">Live Demo</Link></li>
              <li><Link to="/feedback" className="hover:text-blue-400 transition-colors">Feedback Loop</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors opacity-50">Admin</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
             <div className="flex space-x-4 mb-6">
                <a 
                  href={config.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => handleSocialClick(e, config.twitter_url)} 
                  className="text-slate-400 hover:text-white transition-colors" 
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href={config.instagram_url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => handleSocialClick(e, config.instagram_url)} 
                  className="text-slate-400 hover:text-white transition-colors" 
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href={config.linkedin_url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => handleSocialClick(e, config.linkedin_url)} 
                  className="text-slate-400 hover:text-white transition-colors" 
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
             </div>
             <a href={`mailto:${config.contact_email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                <span>{config.contact_email}</span>
             </a>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} {config.app_name} Technologies Inc. Founded by Sumit Gupta.
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowComingSoon(false)}
          />
          <div className="relative bg-white rounded-t-[2rem] md:rounded-3xl p-8 w-full md:w-96 md:max-w-md text-center shadow-2xl animate-slide-up mx-0 md:mx-4">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-[40px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2" />

             <button 
               onClick={() => setShowComingSoon(false)}
               className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
             >
               <X size={20} />
             </button>
             
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
               <Rocket size={32} />
             </div>
             
             <h3 className="text-xl font-bold text-slate-900 mb-2">Launching Soon!</h3>
             <p className="text-slate-500 mb-8 text-sm leading-relaxed">
               We are currently crafting our social media presence. Follow us for updates once we go live in Solan!
             </p>
             
             <button 
               onClick={() => setShowComingSoon(false)}
               className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
             >
               Got it
             </button>
          </div>
        </div>,
        document.body
      )}
    </footer>
  );
};

export default Footer;