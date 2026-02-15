import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import WaitlistModal from './WaitlistModal';

const { Link } = ReactRouterDOM as any;

// Utility component for animated counting
const Counter = ({ from = 0, to, duration = 2500 }: { from?: number; to: number; duration?: number }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(from + (to - from) * ease);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);
  
  // Initialize with 0 to wait for Real DB data
  const [stats, setStats] = useState({
    partners: 0,
    waitlist: 0
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Call the Secure RPC function
        const { data, error } = await supabase.rpc('get_landing_stats');
        
        if (!error && data) {
           setStats({
              partners: data.partners,
              waitlist: data.waitlist
           });
        } else {
           console.error("RPC Error (Run db_schema.sql):", error);
           // If RPC fails (e.g., function missing), we fallback to 0 to indicate issue
           // or you can set a hardcoded fallback here if preferred.
           setStats({ partners: 0, waitlist: 0 });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Realtime Subscriptions
    // Note: For 'anon' users, INSERT events might be filtered by RLS policies if SELECT is not allowed.
    // However, the counts will update on page refresh via the RPC.
    const channel = supabase
      .channel('public:landing-stats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'waitlist_users' },
        (payload) => {
           // Optimistic update
           setStats(prev => ({ ...prev, waitlist: prev.waitlist + 1 }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'early_partners' },
        (payload) => {
           // Optimistic update
           setStats(prev => ({ ...prev, partners: prev.partners + 1 }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center justify-center bg-slate-50">
      {/* Background Glows with Parallax - Blue/Indigo tones on White */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-blue-200/40 rounded-full blur-[100px] transition-transform duration-100 ease-out will-change-transform mix-blend-multiply"
          style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-200/40 rounded-full blur-[100px] transition-transform duration-100 ease-out will-change-transform mix-blend-multiply"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        />
        <div 
          className="absolute top-[40%] left-[40%] w-[20rem] h-[20rem] bg-cyan-100/60 rounded-full blur-[80px] transition-transform duration-300 ease-out will-change-transform mix-blend-multiply"
          style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -10}px)` }}
        />
      </div>

      {/* Floating Notifications - Visual Candy */}
      <div className="absolute top-[30%] right-[8%] hidden lg:block animate-[bounce_3s_infinite] z-20">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-blue-500/10 border border-green-100 flex items-center gap-4 max-w-xs transform hover:scale-105 transition-transform">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
               <CheckCircle2 className="text-green-600 h-6 w-6" />
            </div>
            <div>
               <div className="font-bold text-slate-900 leading-tight">Order Ready</div>
               <div className="text-xs text-slate-500 font-medium">Ready for pickup in 2 mins</div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in hover:border-blue-300 transition-colors cursor-default">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Launching in Solan: March End</span>
        </div>

        {/* Animated Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1] md:leading-[1.1]">
          Your Pharmacy. <br className="hidden md:block" />
          <div className="block md:inline-flex items-center justify-center gap-4 mt-2 md:mt-0">
             <span className="text-slate-400 font-bold">Is Now</span>
             <div className="word-slider-container h-[1.1em] text-left align-top">
                <div className="word-slider-wrapper">
                  <span className="word-slider-item bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Instant.</span>
                  <span className="word-slider-item bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Digital.</span>
                  <span className="word-slider-item bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Wait-free.</span>
                  <span className="word-slider-item bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Instant.</span>
                </div>
             </div>
          </div>
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Stop waiting in lines. Join the waitlist for the new way to order medicines. 
          <span className="text-slate-900 font-medium"> Coming first to Solan.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
          <button 
            onClick={() => setShowWaitlist(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.6)] flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">Join Waitlist <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <Link 
            to="/owners" 
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-lg transition-all duration-300 border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/50 hover:-translate-y-1 flex items-center gap-2"
          >
            Partner Login
          </Link>
        </div>

        {/* Stats / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left border-t border-slate-200 pt-12">
           <div className="flex flex-col items-center md:items-start p-4">
              <h4 className="text-3xl font-bold text-slate-900 mb-1">
                <Counter from={15} to={0} /> 
                <span className="text-sm text-blue-600 font-bold uppercase tracking-wider ml-1">min</span>
              </h4>
              <p className="text-slate-500 text-sm font-medium">Wait Time</p>
           </div>
           <div className="flex flex-col items-center md:items-start p-4 border-l border-slate-200">
              <h4 className="text-3xl font-bold text-slate-900 mb-1">
                <Counter from={0} to={100} />
                <span className="text-sm text-blue-600 font-bold ml-0.5">%</span>
              </h4>
              <p className="text-slate-500 text-sm font-medium">Real Inventory</p>
           </div>
           <div className="flex flex-col items-center md:items-start p-4 border-l border-slate-200">
              <h4 className="text-3xl font-bold text-slate-900 mb-1 h-9 flex items-center">
                {loading ? (
                   <span className="h-8 w-16 bg-slate-200 animate-pulse rounded block" />
                ) : (
                   <div className="animate-fade-in flex items-center">
                      <Counter from={0} to={stats.partners} />
                      <span className="text-sm text-blue-600 font-bold ml-0.5">+</span>
                   </div>
                )}
              </h4>
              <p className="text-slate-500 text-sm font-medium">Early Partners</p>
           </div>
           <div className="flex flex-col items-center md:items-start p-4 border-l border-slate-200">
              <h4 className="text-3xl font-bold text-slate-900 mb-1 h-9 flex items-center">
                {loading ? (
                   <span className="h-8 w-16 bg-slate-200 animate-pulse rounded block" />
                ) : (
                   <div className="animate-fade-in flex items-center">
                      <Counter from={0} to={stats.waitlist} />
                      <span className="text-sm text-blue-600 font-bold ml-0.5">+</span>
                   </div>
                )}
              </h4>
              <p className="text-slate-500 text-sm font-medium">Waitlist Users</p>
           </div>
        </div>
      </div>

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        type="waitlist"
      />
    </section>
  );
};

export default Hero;