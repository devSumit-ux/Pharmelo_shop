import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import WaitlistModal from './WaitlistModal';

const Hero: React.FC = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [stats, setStats] = useState({ partners: 12, waitlist: 148 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_landing_stats');
        if (!error && data) {
           setStats({
              partners: data.partners || 12,
              waitlist: data.waitlist || 148
           });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-8">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Launching in Solan: March End</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Reimagining Medicine <br className="hidden md:block" />
          <span className="text-blue-600">Ordering & Healthcare</span>
        </h1>

        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A smart digital pharmacy ecosystem featuring AI prescription reading, 
          WhatsApp ordering, and auto-refill reminders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            to="/survey"
            className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            Participate in Survey <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/feedback" 
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Give Feedback
          </Link>
        </div>

        {/* Simple Stats */}
        <div className="flex justify-center gap-8 md:gap-16 border-t border-slate-100 pt-8">
           <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.waitlist}+</div>
              <div className="text-sm text-slate-500 font-medium">Waitlist Users</div>
           </div>
           <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.partners}+</div>
              <div className="text-sm text-slate-500 font-medium">Early Partners</div>
           </div>
           <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">0 min</div>
              <div className="text-sm text-slate-500 font-medium">Wait Time</div>
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
