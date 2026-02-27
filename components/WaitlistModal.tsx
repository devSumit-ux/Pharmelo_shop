import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, CheckCircle2, Loader2, Calendar, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'waitlist' | 'community'; // Reusable for both
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, type }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonSuccess, setButtonSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setStatus('idle');
      setErrorMessage('');
      setButtonSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    setErrorMessage('');
    setButtonSuccess(false);
    
    try {
      const tableName = type === 'community' ? 'saturday_community_members' : 'waitlist_users';
      
      const payload = type === 'community' 
        ? { email } 
        : { email, source: 'website_modal' };

      const { error } = await supabase
        .from(tableName)
        .insert([payload]);

      if (error) {
        // Check for duplicate key error (code 23505 in Postgres)
        if (error.code === '23505') {
          throw new Error("You're already on the list!");
        }
        throw error;
      }

      // Show button success state first
      setButtonSuccess(true);

      // Delay transition to full success screen to allow button animation to play
      setTimeout(() => {
        setStatus('success');
        
        // Then close modal after showing the success screen
        setTimeout(() => {
          onClose();
        }, 2500);
      }, 1000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setButtonSuccess(false);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  const isCommunity = type === 'community';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-t-[2rem] md:rounded-3xl p-8 w-full md:w-[32rem] md:max-w-lg shadow-2xl scale-100 animate-slide-up overflow-hidden mx-0 md:mx-4">
        {/* Decorative background blob */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-50 pointer-events-none ${isCommunity ? 'bg-indigo-400' : 'bg-blue-400'}`} />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8 animate-fade-in">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCommunity ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You're in!</h3>
            <p className="text-slate-500">
              {isCommunity 
                ? "Welcome to the Saturday Community. Keep an eye on your inbox!" 
                : "You've been added to the priority waitlist."}
            </p>
          </div>
        ) : (
          <div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isCommunity ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
              {isCommunity ? <Calendar size={24} /> : <Mail size={24} />}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isCommunity ? 'Join Saturday Community' : 'Join the Waitlist'}
            </h3>
            <p className="text-slate-500 mb-8 leading-relaxed text-sm">
              {isCommunity 
                ? "Get exclusive weekly health tips, community stories, and early access to features every Saturday." 
                : "Medzo is rolling out in phases. Enter your email to get notified when we launch in your area."}
            </p>

            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'submitting' || buttonSuccess}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  buttonSuccess
                    ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                    : isCommunity 
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' 
                        : 'bg-slate-900 hover:bg-blue-600 shadow-slate-900/20'
                }`}
              >
                {buttonSuccess ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <Check className="h-5 w-5" /> Joined!
                  </div>
                ) : status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Joining...
                  </>
                ) : (
                  'Join Now'
                )}
              </button>
            </form>
            <p className="text-xs text-center text-slate-400 mt-4">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WaitlistModal;