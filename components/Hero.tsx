import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import WaitlistModal from './WaitlistModal';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-40 left-0 w-[300px] h-[300px] bg-indigo-50/50 rounded-full blur-[100px] -z-10" 
        />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-8 hover:border-blue-200 transition-colors cursor-default">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Launching in Solan: April End</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Smart Pharmacy <br className="hidden md:block" />
          <span className="text-blue-600 inline-block">
            & Doctor Booking in Solan
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A smart healthcare platform to pre-order medicines, skip the queue, and book doctor appointments effortlessly. Home delivery available from select partner shops.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/survey">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
            >
              Participate in Survey <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
          <Link to="/feedback">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Give Feedback
            </motion.button>
          </Link>
        </motion.div>

        {/* Simple Stats */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-8 md:gap-16 border-t border-slate-100 pt-8"
        >
           <div className="text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                className="text-3xl font-bold text-slate-900"
              >
                {stats.waitlist}+
              </motion.div>
              <div className="text-sm text-slate-500 font-medium">Waitlist Users</div>
           </div>
           <div className="text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                className="text-3xl font-bold text-slate-900"
              >
                {stats.partners}+
              </motion.div>
              <div className="text-sm text-slate-500 font-medium">Early Partners</div>
           </div>
           <div className="text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                className="text-3xl font-bold text-slate-900"
              >
                0 min
              </motion.div>
              <div className="text-sm text-slate-500 font-medium">Wait Time</div>
           </div>
        </motion.div>
      </motion.div>

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        type="waitlist"
      />
    </section>
  );
};

export default Hero;
