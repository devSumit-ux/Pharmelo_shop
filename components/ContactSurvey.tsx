
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ContactSurveyProps {
  onOpenModal: (type: 'waitlist' | 'community') => void;
}

const ContactSurvey: React.FC<ContactSurveyProps> = ({ onOpenModal }) => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
          Get Early Access
        </h2>
        <p className="text-slate-500 text-lg mb-12">
          Be the first to know when Pharmelo launches. Join our community of early adopters.
        </p>
        
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="Your Name (Optional)" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500" />
            <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500">
              <option>Select Your Role</option>
              <option>Patient</option>
              <option>Pharmacist</option>
              <option>Doctor</option>
              <option>Caregiver</option>
            </select>
          </div>
          <input type="email" placeholder="Email or Phone (Optional)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6 focus:outline-none focus:border-blue-500" />
          
          <label className="flex items-center gap-3 mb-8 cursor-pointer justify-center">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600" defaultChecked />
            <span className="text-sm font-medium text-slate-700">Notify me when Pharmelo launches</span>
          </label>

          <button 
            onClick={() => onOpenModal('waitlist')}
            className="w-full sm:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mx-auto"
          >
            Join the Future <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSurvey;
