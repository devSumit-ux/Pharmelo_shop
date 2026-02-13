import React, { useState, useEffect } from 'react';
import { Pill, Menu, X, ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppConfig } from '../context/AppContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'For Owners', href: '/owners' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Live Demo', href: '/wishlist' },
  { label: 'Community', href: '/feedback' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { config } = useAppConfig();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'glass-nav py-3 bg-white/90' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 group relative z-50" onClick={() => setIsOpen(false)}>
              {config.logo_url ? (
                  <img src={config.logo_url} alt={config.app_name} className="h-10 w-auto object-contain" />
              ) : (
                  <>
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                        <Pill className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        {config.app_name}
                    </span>
                  </>
              )}
            </NavLink>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors hover:text-blue-600 ${
                      isActive ? 'text-blue-600' : 'text-slate-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/wishlist" className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold transition-all text-sm shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 flex items-center gap-1 group">
                Try Beta <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 relative z-50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay & Content */}
        <div 
          className={`md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl z-40 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
        }`}>
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `block text-lg font-medium px-4 py-2 rounded-xl transition-colors ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2 px-4">
              <NavLink to="/wishlist" className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                Get Early Access
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;