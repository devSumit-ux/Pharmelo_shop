
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Scan, Bell, Calendar, FileText, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureValidation: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Proposed <span className="text-blue-600">Features</span>
          </h2>
          <p className="text-lg text-slate-600">
            We are researching these core features. Which ones would change your life?
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: MessageSquare, title: "Hybrid Ordering", desc: "Order via WhatsApp (text, voice, or photo) or directly through the Pharmelo App." },
            { icon: Scan, title: "AI Prescription Reader", desc: "Instantly digitize handwritten prescriptions to avoid errors and confusion." },
            { icon: Bell, title: "Auto-Refill & Reminders", desc: "Never run out of chronic medicines with automated refill alerts and reservations." },
            { icon: Calendar, title: "Doctor Slot Booking", desc: "Book appointments with local doctors and clinics directly through the app." },
            { icon: FileText, title: "Digital Health Records", desc: "Keep all your prescriptions and medical history in one secure, digital place." },
            { icon: Star, title: "Pharmacist Insights", desc: "Get real-time stock availability and expert advice from local pharmacists." },
          ].map((feat, i) => (
            <motion.div 
              key={i} 
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <feat.icon size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{feat.desc}</p>
              <Link to="/survey" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline inline-flex items-center gap-1">
                Rate this feature <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureValidation;
