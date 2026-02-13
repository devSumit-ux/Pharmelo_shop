import React, { useState } from 'react';
import { UserRole } from '../types';
import { analyzeFeedback } from '../services/geminiService';
import { supabase } from '../services/supabaseClient'; // Import Supabase
import { Sparkles, Store, User, Loader2, Send, MessageSquarePlus, HelpCircle, CheckCircle2, ClipboardList, PenLine, AlertCircle } from 'lucide-react';

const FeedbackLoop: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [mode, setMode] = useState<'text' | 'survey'>('survey'); // Default to survey as requested
  
  // Text Mode State
  const [input, setInput] = useState('');
  
  // Survey Mode State
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [surveyComment, setSurveyComment] = useState('');
  
  // Shared State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: string; sentiment: string; strategicAction: string } | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'saved'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- QUESTIONS DATA ---
  const surveyQuestions = {
    [UserRole.CONSUMER]: [
      {
        id: 'wait_time',
        question: "How long do you typically wait at a pharmacy?",
        options: ["0-5 mins", "5-15 mins", "15+ mins", "I leave if it's crowded"]
      },
      {
        id: 'priority',
        question: "What matters most to you?",
        options: ["Speed of Pickup", "Medicine Availability", "Lower Price", "Pharmacist Advice"]
      },
      {
        id: 'digital_usage',
        question: "Have you bought medicines online before?",
        options: ["Yes, regularly", "Yes, once or twice", "No, never"]
      }
    ],
    [UserRole.SHOP_OWNER]: [
      {
        id: 'daily_customers',
        question: "Average daily footfall in your shop?",
        options: ["Less than 50", "50 - 100", "100 - 300", "300+"]
      },
      {
        id: 'inventory_system',
        question: "How do you currently track inventory?",
        options: ["Pen & Paper", "Excel / Sheets", "POS Software", "Memory"]
      },
      {
        id: 'pain_point',
        question: "Biggest challenge in running the shop?",
        options: ["Inventory Expiring", "Staff Management", "Competition", "Customer Queues"]
      }
    ]
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      // 1. Save to Supabase
      const { error } = await supabase
        .from('feedback_submissions')
        .insert([
            { role: role, content: input }
        ]);
      
      if (error) throw error;
      
      setSubmitStatus('saved');

      // 2. Generate AI Analysis (Value add for the user)
      const data = await analyzeFeedback(input, role);
      setResult(data);
      
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setErrorMessage(err.message || "Failed to save note. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if at least one answer is selected
    if (Object.keys(surveyAnswers).length === 0) return;

    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      // Save Survey to Supabase with the additional comment
      const { error } = await supabase
        .from('survey_responses')
        .insert([
            { 
              role: role, 
              answers: {
                  ...surveyAnswers,
                  additional_comments: surveyComment
              } 
            }
        ]);
      
      if (error) throw error;
      
      setSubmitStatus('saved');
      setSurveyAnswers({}); // Clear after submit
      setSurveyComment(''); // Clear comment
      
      // Optional: We could show a specific "Thank you" for surveys
      
    } catch (err: any) {
      console.error("Error submitting survey:", err);
      setErrorMessage(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyChange = (questionId: string, option: string) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const prompts = role === UserRole.CONSUMER ? [
      "What feature would make you use Pharmelo daily?",
      "Did you face any issues finding a pharmacy?",
      "How was your experience with the wait time?",
      "Is the app navigation easy to understand?"
  ] : [
      "What part of the dashboard takes the most time?",
      "Are the order notifications clear enough?",
      "How can we improve the inventory sync?",
      "What tools would help you sell more?"
  ];

  return (
    <section id="feedback" className="pb-24 relative overflow-hidden">
      {/* Subtle Background Blob */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                   <MessageSquarePlus size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Community Feedback</h3>
                   <p className="text-xs text-slate-500">Help us shape the future of Pharmelo.</p>
                </div>
             </div>
             
             {/* Role Toggles */}
             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => { setRole(UserRole.CONSUMER); setResult(null); setInput(''); setSurveyAnswers({}); setSurveyComment(''); setSubmitStatus('idle'); setErrorMessage(null); }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${
                    role === UserRole.CONSUMER 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <User className="h-3 w-3" /> Consumer
                </button>
                <button
                  onClick={() => { setRole(UserRole.SHOP_OWNER); setResult(null); setInput(''); setSurveyAnswers({}); setSurveyComment(''); setSubmitStatus('idle'); setErrorMessage(null); }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${
                    role === UserRole.SHOP_OWNER 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Store className="h-3 w-3" /> Shop Owner
                </button>
             </div>
          </div>

          <div className="p-8 md:p-12">
            
            {/* Mode Switcher */}
            <div className="flex gap-6 mb-8 border-b border-slate-100 pb-1">
               <button 
                  onClick={() => { setMode('survey'); setErrorMessage(null); }}
                  className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${mode === 'survey' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <ClipboardList size={16} />
                  Quick Survey
                  {mode === 'survey' && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
               </button>
               <button 
                  onClick={() => { setMode('text'); setErrorMessage(null); }}
                  className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${mode === 'text' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <PenLine size={16} />
                  Write Note
                  {mode === 'text' && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
               </button>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-fade-in">
                <AlertCircle size={18} className="flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            {mode === 'survey' ? (
              // --- MCQ SURVEY MODE ---
              <form onSubmit={handleSurveySubmit} className="animate-fade-in">
                 <div className="space-y-8 mb-8">
                    {surveyQuestions[role].map((q, index) => (
                       <div key={q.id} className="space-y-3">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                             <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                             {q.question}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                             {q.options.map((opt) => (
                                <label key={opt} className={`
                                   flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-50
                                   ${surveyAnswers[q.id] === opt ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-200'}
                                `}>
                                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${surveyAnswers[q.id] === opt ? 'border-blue-600' : 'border-slate-300'}`}>
                                      {surveyAnswers[q.id] === opt && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                   </div>
                                   <input 
                                      type="radio" 
                                      name={q.id} 
                                      value={opt} 
                                      checked={surveyAnswers[q.id] === opt}
                                      onChange={() => handleSurveyChange(q.id, opt)}
                                      className="hidden"
                                   />
                                   <span className={`text-sm font-medium ${surveyAnswers[q.id] === opt ? 'text-blue-900' : 'text-slate-600'}`}>{opt}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 {/* Additional Text Area */}
                 <div className="pt-4 border-t border-slate-50">
                    <label className="block text-sm font-bold text-slate-900 mb-3">
                        Any other thoughts? <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                        value={surveyComment}
                        onChange={(e) => setSurveyComment(e.target.value)}
                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-sm"
                        placeholder="Elaborate on your answers or share new ideas..."
                    />
                 </div>
                 
                 <div className="flex items-center justify-end gap-4 pt-4">
                    {submitStatus === 'saved' && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100 animate-fade-in flex items-center gap-2">
                            <CheckCircle2 size={14} /> Response Recorded
                        </span>
                    )}
                    <button
                      type="submit"
                      disabled={Object.keys(surveyAnswers).length === 0 || loading}
                      className="bg-slate-900 text-white py-3 px-6 rounded-xl hover:bg-blue-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2 font-bold text-sm"
                    >
                      {loading ? (
                          <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                          </>
                      ) : (
                          <>
                              Submit Survey <Send className="h-4 w-4" />
                          </>
                      )}
                    </button>
                 </div>
              </form>

            ) : (
              // --- TEXT INPUT MODE ---
              <form onSubmit={handleTextSubmit} className="relative animate-fade-in">
                <label className="block text-xl font-bold text-slate-900 mb-2">
                  {role === UserRole.CONSUMER 
                    ? "What can we improve for you?" 
                    : "How can we make running your shop easier?"}
                </label>
                <p className="text-slate-500 text-sm mb-6">
                  {role === UserRole.CONSUMER 
                    ? "Feature requests, complaints, or ideas – we read everything."
                    : "Inventory issues, dashboard improvements, or POS integrations."}
                </p>

                {/* Interactive Prompts */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                      <HelpCircle size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tap to answer</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {prompts.map((prompt, i) => (
                      <button
                          key={i}
                          type="button"
                          onClick={() => setInput(prev => prev ? prev + "\n\n" + prompt + " " : prompt + " ")}
                          className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-left"
                      >
                          {prompt}
                      </button>
                      ))}
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="w-full h-40 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-lg leading-relaxed shadow-inner"
                    placeholder={role === UserRole.CONSUMER ? "Type your thoughts here..." : "Tell us what you need..."}
                  />
                  
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">
                    {submitStatus === 'saved' && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 animate-fade-in flex items-center gap-1">
                          Saved to Database <FileCheck size={12} />
                        </span>
                    )}
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2 font-bold px-5 text-sm"
                    >
                      {loading ? (
                          <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                          </>
                      ) : (
                          <>
                              Submit <Send className="h-4 w-4" />
                          </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* AI Analysis Result (Only for Text Mode) */}
            {mode === 'text' && result && (
              <div className="mt-10 animate-fade-in">
                <div className={`rounded-3xl p-8 relative overflow-hidden ${role === UserRole.CONSUMER ? 'bg-blue-50 border border-blue-100' : 'bg-indigo-50 border border-indigo-100'}`}>
                  {/* Decorative background icon */}
                  <Sparkles className={`absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none ${role === UserRole.CONSUMER ? 'text-blue-600' : 'text-indigo-600'}`} />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className={`p-2 rounded-xl ${role === UserRole.CONSUMER ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg leading-none ${role === UserRole.CONSUMER ? 'text-blue-900' : 'text-indigo-900'}`}>
                        Thanks for filing!
                        </h3>
                        <p className={`text-xs mt-1 ${role === UserRole.CONSUMER ? 'text-blue-600/80' : 'text-indigo-600/80'}`}>Here is our immediate take on your suggestion:</p>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Our Understanding</h4>
                       <p className="text-slate-700 leading-relaxed font-medium text-sm">{result.analysis}</p>
                    </div>
                    
                    <div className="bg-white/60 p-4 rounded-2xl border border-white/50">
                       <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Planned Action</h4>
                       <p className="text-slate-900 text-base font-bold leading-relaxed">
                         {result.strategicAction}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple icon component helper
const FileCheck = ({size}: {size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

export default FeedbackLoop;