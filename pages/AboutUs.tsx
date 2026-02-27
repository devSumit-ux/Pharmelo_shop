
import React from 'react';
import { Pill, GraduationCap, Target, Heart, ArrowRight, History, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
             <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Vision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Reimagining <span className="text-blue-600">Healthcare</span> <br />
            One Prescription at a Time.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Pharmelo is more than an app—it's a research-driven initiative to solve the real-world problems of medicine ordering and prescription handling.
          </p>
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 text-red-600 font-bold mb-4">
                <AlertCircle size={24} />
                <h2 className="text-2xl font-bold">The Problem</h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Current medicine ordering systems are fragmented. Patients face long queues, pharmacists struggle with illegible prescriptions, and chronic patients often forget their refills.
              </p>
              <ul className="space-y-3">
                {[
                  "Handwritten prescriptions are hard to read and prone to error.",
                  "Calling multiple pharmacies to check stock is time-consuming.",
                  "No reliable system for auto-refill reminders for chronic meds.",
                  "Fragmented health records across different providers."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 text-blue-600 font-bold mb-4">
                <Zap size={24} />
                <h2 className="text-2xl font-bold">The Pharmelo Difference</h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                We bridge the gap using AI and hyper-local networking. Pharmelo isn't just a delivery app; it's a smart ecosystem.
              </p>
              <ul className="space-y-3">
                {[
                  "AI-assisted prescription reading for higher accuracy.",
                  "Real-time inventory sync with local pharmacies.",
                  "WhatsApp-integrated ordering for maximum simplicity.",
                  "Smart auto-refills that reserve your meds in advance."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why We Are Different</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Trustworthy & Anonymous</h4>
                  <p className="text-slate-500 text-sm">Your data is used only for research and product improvement. We prioritize patient privacy above all.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Community Focused</h4>
                  <p className="text-slate-500 text-sm">Built by students and healthcare professionals to serve local communities, starting with Solan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Research Driven</h4>
                  <p className="text-slate-500 text-sm">Every feature is validated through extensive surveys with patients, doctors, and pharmacists.</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/survey" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all">
                Participate in Our Research <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Meet the Founder
                 </h2>
                 <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Pharmelo was founded by <strong>Sumit Gupta</strong>, a Pharmacy student at <strong>Shoolini University</strong>.
                 </p>
                 <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    After seeing patients wait in long lines for simple medicines, Sumit started this project to help the local community. The goal is simple: use technology to make pharmacy visits faster and easier for everyone in Solan.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:sumit@pharmelo.com" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                        Contact Sumit
                    </a>
                 </div>
             </div>
             
             <div className="flex-1 w-full max-w-xs flex justify-center">
                <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                    <div className="text-center">
                        <span className="text-4xl block mb-2">👨‍⚕️</span>
                        <div className="font-bold text-slate-900">Sumit Gupta</div>
                        <div className="text-xs text-slate-500">Shoolini University</div>
                    </div>
                </div>
             </div>
         </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Target size={28} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
               <p className="text-slate-500 leading-relaxed">
                  To digitize every local pharmacy in Himachal Pradesh, empowering small business owners with modern tools while providing patients with an instant, transparent, and wait-free experience.
               </p>
            </div>
            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Heart size={28} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Why We Exist</h3>
               <p className="text-slate-500 leading-relaxed">
                  Healthcare is personal. We believe technology shouldn't replace the local pharmacist but strengthen the bond between them and the community. Pharmelo keeps the business local.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutUs;
