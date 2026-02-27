
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  User, 
  Stethoscope, 
  Store, 
  Heart,
  Send,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

type UserRole = 'Patient' | 'Pharmacist' | 'Doctor' | 'Caregiver' | null;

interface SurveyData {
  role: UserRole;
  responses: Record<string, any>;
  email?: string;
  name?: string;
  notifyMe: boolean;
}

const Survey: React.FC = () => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', notifyMe: true });

  const roles = [
    { id: 'Patient', icon: User, label: 'Patient', desc: 'General or chronic patient' },
    { id: 'Caregiver', icon: Heart, label: 'Caregiver', desc: 'Family member or helper' },
    { id: 'Pharmacist', icon: Store, label: 'Pharmacist', desc: 'Local pharmacy owner/staff' },
    { id: 'Doctor', icon: Stethoscope, label: 'Doctor', desc: 'Medical professional' },
  ];

  const surveyQuestions: Record<string, any[]> = {
    Patient: [
      { id: 'ordering_method', type: 'choice', question: 'How do you currently order medicines?', options: ['Visit store directly', 'Phone call', 'WhatsApp', 'Online apps', 'Home delivery services'] },
      { id: 'prescription_issues', type: 'choice', question: 'Have you faced issues reading handwritten prescriptions?', options: ['Frequently', 'Sometimes', 'Rarely', 'Never'] },
      { id: 'forget_refills', type: 'choice', question: 'Do you often forget to refill your medicines on time?', options: ['Yes, often', 'Sometimes', 'Rarely', 'No, never'] },
      { id: 'whatsapp_help', type: 'choice', question: 'Would ordering via WhatsApp help you?', options: ['Extremely helpful', 'Somewhat helpful', 'Not really', 'Not at all'] },
      { id: 'autorefill_interest', type: 'choice', question: 'Would auto-refill reminders be useful for you?', options: ['Yes, definitely', 'Maybe', 'No'] },
    ],
    Caregiver: [
        { id: 'ordering_method', type: 'choice', question: 'How do you currently order medicines for your loved ones?', options: ['Visit store directly', 'Phone call', 'WhatsApp', 'Online apps'] },
        { id: 'prescription_issues', type: 'choice', question: 'Do you find it difficult to manage multiple prescriptions?', options: ['Very difficult', 'Somewhat difficult', 'Easy'] },
        { id: 'reminders_needed', type: 'choice', question: 'Would a centralized reminder system for all family members help?', options: ['Yes, absolutely', 'Maybe', 'No'] },
    ],
    Pharmacist: [
      { id: 'handwriting_prob', type: 'choice', question: 'How often do you face problems reading handwritten prescriptions?', options: ['Daily', 'Weekly', 'Rarely'] },
      { id: 'clarification_time', type: 'choice', question: 'How much time is wasted in clarifying prescriptions with doctors/patients?', options: ['Significant time', 'Moderate time', 'Very little'] },
      { id: 'inventory_challenges', type: 'text', question: 'What are your biggest inventory management challenges?' },
      { id: 'ai_interest', type: 'choice', question: 'Would you be interested in an AI-assisted prescription reading tool?', options: ['Very interested', 'Somewhat interested', 'Not interested'] },
    ],
    Doctor: [
      { id: 'prescription_errors', type: 'choice', question: 'How often do you hear about patients making errors due to prescription misunderstanding?', options: ['Often', 'Sometimes', 'Rarely'] },
      { id: 'digital_followup', type: 'choice', question: 'Would you be interested in a platform for digital follow-ups with patients?', options: ['Yes', 'Maybe', 'No'] },
      { id: 'ai_opinion', type: 'text', question: 'What is your opinion on AI-assisted healthcare systems?' },
    ]
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(1);
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    const currentQuestions = surveyQuestions[role as string] || [];
    if (step <= currentQuestions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // Move to feature validation or contact
    }
  };

  const prevStep = () => {
    setStep(Math.max(0, step - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert([{
          role,
          responses,
          contact_info: contactInfo,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting survey:', err);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestions = role ? (surveyQuestions[role] || []) : [];
  const totalSteps = currentQuestions.length + 3; // Role + Questions + Feature Validation + Contact

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Indicator */}
        {!submitted && step > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
              <p className="text-slate-500 text-lg mb-8">
                Your feedback is invaluable in helping us build the future of healthcare with Pharmelo.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all"
              >
                Back to Home
              </button>
            </motion.div>
          ) : step === 0 ? (
            <motion.div 
              key="role-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Help Us Rebuild <span className="text-blue-600">Healthcare</span>
              </h1>
              <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto">
                Select your role to start the survey. Your insights will help us validate the Pharmelo concept.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id as UserRole)}
                    className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left flex items-start gap-4"
                  >
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <r.icon size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{r.label}</div>
                      <div className="text-sm text-slate-500">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : step <= currentQuestions.length ? (
            <motion.div 
              key={`question-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
              <div className="mb-8">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">{role} Survey</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  {currentQuestions[step - 1].question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestions[step - 1].type === 'choice' ? (
                  currentQuestions[step - 1].options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => handleResponse(currentQuestions[step - 1].id, opt)}
                      className={`w-full p-4 text-left rounded-2xl border transition-all font-medium ${
                        responses[currentQuestions[step - 1].id] === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 min-h-[150px]"
                    placeholder="Type your answer here..."
                    value={responses[currentQuestions[step - 1].id] || ''}
                    onChange={(e) => handleResponse(currentQuestions[step - 1].id, e.target.value)}
                  />
                )}
              </div>

              <div className="flex justify-between mt-12">
                <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={nextStep}
                  disabled={!responses[currentQuestions[step - 1].id]}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ) : step === currentQuestions.length + 1 ? (
            <motion.div 
              key="feature-validation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
              <div className="mb-8">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Feature Validation</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  Rate our proposed features
                </h2>
                <p className="text-slate-500 mt-2">How useful would these features be for you?</p>
              </div>

              <div className="space-y-8">
                {[
                  { id: 'feat_whatsapp', label: 'WhatsApp Medicine Ordering' },
                  { id: 'feat_ai_reader', label: 'AI Prescription Reader' },
                  { id: 'feat_refills', label: 'Auto-Refill & Reminders' },
                  { id: 'feat_booking', label: 'Doctor Appointment Booking' },
                  { id: 'feat_records', label: 'Digital Health Records' },
                ].map((feat) => (
                  <div key={feat.id}>
                    <div className="font-bold text-slate-800 mb-3">{feat.label}</div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleResponse(feat.id, rating)}
                          className={`w-10 h-10 rounded-xl border font-bold transition-all ${
                            responses[feat.id] === rating
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-300'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-12">
                <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={nextStep}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
              <div className="mb-8">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Final Step</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                  Stay in the loop
                </h2>
                <p className="text-slate-500 mt-2">Optional: Leave your contact to be notified when we launch.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500"
                    placeholder="Your Name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email / Phone (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500"
                    placeholder="email@example.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={contactInfo.notifyMe}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, notifyMe: e.target.checked }))}
                  />
                  <span className="text-sm font-medium text-slate-700">Notify me when Pharmelo launches</span>
                </label>
              </div>

              {/* Trust & Ethics Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 text-blue-700 font-bold mb-2">
                  <ShieldCheck size={20} />
                  <span>Trust & Ethics</span>
                </div>
                <p className="text-sm text-blue-600 leading-relaxed">
                  No personal data will be misused. Survey data is anonymous and used only for research & product improvement. We follow strict healthcare compliance standards.
                </p>
              </div>

              <div className="flex justify-between mt-12">
                <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  Submit Survey
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey;
