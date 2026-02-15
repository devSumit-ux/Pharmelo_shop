import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import * as ReactRouterDOM from 'react-router-dom';
import { Lock, Loader2, AlertCircle, ShieldCheck, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppConfig } from '../context/AppContext';

const { useNavigate, Link } = ReactRouterDOM as any;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { config } = useAppConfig();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Attempt to Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // 2. AUTO-REGISTRATION FALLBACK (For Demo/Setup Convenience)
        // If user doesn't exist, try to create them immediately.
        if (error.message.includes("Invalid login credentials")) {
           console.log("User not found, attempting to create admin account...");
           
           const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
             email,
             password,
           });
           
           if (signUpError) {
             // If signup also fails, throw the original error
             throw error; 
           }
           
           if (signUpData.session) {
             // Signup successful and auto-logged in (Email confirm disabled)
             navigate('/admin/dashboard');
             return;
           } else if (signUpData.user) {
              // Signup successful but waiting for email confirmation
              setError("Admin account created! Please check your email to confirm, or disable 'Confirm Email' in Supabase Auth settings.");
              return;
           }
        }
        
        throw error;
      }
      
      // Successful login
      navigate('/admin/dashboard');

    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold z-20">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/20 transform rotate-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pharmelo Admin</h1>
          <p className="text-slate-400 text-sm">Enter credentials to login or create admin account.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> 
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="admin@pharmelo.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-4 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In / Register'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
           <p className="text-xs text-slate-500 mb-2">First time? Just enter your desired credentials to create the admin account automatically.</p>
           <p className="text-[10px] text-slate-600">Restricted Access • {new Date().getFullYear()} Pharmelo Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;