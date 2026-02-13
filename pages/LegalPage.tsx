import React from 'react';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isTerms = type === 'terms';
  const title = isTerms ? "Terms of Service" : "Privacy Policy";
  const icon = isTerms ? FileText : Lock;
  const colorClass = isTerms ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50';

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 ${isTerms ? 'bg-blue-400' : 'bg-emerald-400'}`} />

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 relative z-10">
            <div className={`p-4 rounded-2xl w-fit ${colorClass}`}>
              {React.createElement(icon, { size: 32 })}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
              <p className="text-slate-500 font-medium">Last Updated: March 2024</p>
            </div>
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none relative z-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 mb-10">
               <div className="flex items-center gap-3 mb-3">
                   <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                   <h2 className="text-lg font-bold text-slate-900 m-0">Coming Soon</h2>
               </div>
               <p className="text-slate-600 m-0 text-sm md:text-base leading-relaxed">
                 We are currently finalizing our official {title.toLowerCase()} in preparation for our launch in Solan. The full legal document will be available here shortly.
               </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">Summary of {isTerms ? 'Terms' : 'Privacy Practices'}</h3>
            <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
              {isTerms ? (
                <>
                    <p>
                        <strong>1. Platform Nature:</strong> Pharmelo acts as a technology intermediary connecting consumers with licensed local pharmacies. We do not stock, sell, or dispense medicines directly.
                    </p>
                    <p>
                        <strong>2. User Responsibility:</strong> Users are responsible for providing valid prescriptions where required by law. The dispensing pharmacy reserves the right to verify prescriptions before fulfilling orders.
                    </p>
                    <p>
                        <strong>3. Order Pickup:</strong> Pharmelo facilitates "Order Ahead". Users are expected to pick up their confirmed orders within the pharmacy's operating hours.
                    </p>
                </>
              ) : (
                <>
                    <p>
                        <strong>1. Data Collection:</strong> We collect only essential information required to fulfill your orders, such as your name, phone number, and prescription images (where applicable).
                    </p>
                    <p>
                        <strong>2. Data Usage:</strong> Your data is shared strictly with the pharmacy fulfilling your order. We do not sell your personal health information to advertisers or third parties.
                    </p>
                    <p>
                        <strong>3. Security:</strong> We employ industry-standard encryption to protect your data during transmission and storage.
                    </p>
                </>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base">Questions?</h4>
                <p className="text-slate-500 text-sm">
                  Please contact our legal team at <a href="mailto:support@pharmelo.com" className="text-blue-600 hover:underline">support@pharmelo.com</a>.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;