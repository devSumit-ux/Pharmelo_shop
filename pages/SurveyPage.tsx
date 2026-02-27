import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft, ClipboardList, User, Stethoscope, Store } from 'lucide-react';

type SurveyType = 'patient' | 'pharmacist' | 'doctor' | null;

const SurveyPage: React.FC = () => {
  const [surveyType, setSurveyType] = useState<SurveyType>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const surveys = {
    patient: {
      title: "Patient Survey",
      questions: [
        { id: 'q1', type: 'choice', text: "How do you currently order medicines?", options: ["Local Pharmacy (Walk-in)", "Phone Call", "Online Apps", "Through Doctor"] },
        { id: 'q2', type: 'choice', text: "Have you faced issues reading handwritten prescriptions?", options: ["Frequently", "Sometimes", "Rarely", "Never"] },
        { id: 'q3', type: 'choice', text: "Do you often forget to refill your medicines?", options: ["Yes, often", "Occasionally", "No, I'm regular"] },
        { id: 'q4', type: 'choice', text: "Which ordering method would you prefer?", options: ["WhatsApp (Text/Voice/Photo)", "Directly through the App", "Both", "I prefer walk-in"] },
        { id: 'q5', type: 'choice', text: "Would auto-refill reminders be useful for you?", options: ["Yes, definitely", "Maybe", "No"] }
      ]
    },
    pharmacist: {
      title: "Pharmacist Survey",
      questions: [
        { id: 'p1', type: 'choice', text: "What is your biggest challenge with prescriptions?", options: ["Handwriting clarity", "Fake prescriptions", "Inventory matching", "Customer wait times"] },
        { id: 'p2', type: 'choice', text: "How much time is wasted clarifying prescriptions daily?", options: ["Less than 30 mins", "30-60 mins", "1-2 hours", "More than 2 hours"] },
        { id: 'p3', type: 'choice', text: "What are your main inventory challenges?", options: ["Overstocking", "Out of stock items", "Expiry management", "Supplier delays"] },
        { id: 'p4', type: 'choice', text: "Would an AI-assisted prescription reader help your workflow?", options: ["Yes, a lot", "Somewhat", "Not sure", "No"] }
      ]
    },
    doctor: {
      title: "Doctor Survey",
      questions: [
        { id: 'd1', type: 'choice', text: "What prescription errors do you face most often?", options: ["Wrong dosage dispensed", "Medicine substitution", "Patient lost prescription", "Pharmacy calls for clarity"] },
        { id: 'd2', type: 'choice', text: "Are you interested in digital follow-ups with patients?", options: ["Very interested", "Somewhat interested", "Not interested"] },
        { id: 'd3', type: 'choice', text: "What is your opinion on AI-assisted healthcare systems?", options: ["Positive", "Neutral", "Skeptical", "Negative"] }
      ]
    }
  };

  const currentSurvey = surveyType ? surveys[surveyType] : null;
  const progress = currentSurvey ? ((step + 1) / currentSurvey.questions.length) * 100 : 0;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentSurvey && step < currentSurvey.questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Survey Completed!</h2>
          <p className="text-slate-500 mb-8">Your feedback is invaluable and will help us build a better Pharmelo. We respect your privacy and all data is anonymous.</p>
          <button 
            onClick={() => { setSurveyType(null); setStep(0); setIsSubmitted(false); setAnswers({}); }}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {!surveyType ? (
          <div className="animate-fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Participate in our Survey</h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Help us validate the Pharmelo concept. Choose your role to begin the survey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'patient', title: 'Patient', icon: User, color: 'blue', desc: 'For those who order medicines for themselves or family.' },
                { id: 'pharmacist', title: 'Pharmacist', icon: Store, color: 'emerald', desc: 'For pharmacy owners and staff managing daily operations.' },
                { id: 'doctor', title: 'Doctor', icon: Stethoscope, color: 'indigo', desc: 'For healthcare professionals and clinic staff.' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSurveyType(role.id as SurveyType)}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${role.color}-50 text-${role.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <role.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{role.desc}</p>
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                    Start Survey <ArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <button 
              onClick={() => setSurveyType(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Change Role
            </button>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-600"
                />
              </div>

              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-bold text-slate-900">{currentSurvey?.title}</h2>
                <span className="text-sm font-bold text-slate-400">Step {step + 1} of {currentSurvey?.questions.length}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
                    {currentSurvey?.questions[step].text}
                  </h3>

                  <div className="space-y-4">
                    {currentSurvey?.questions[step].options.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentSurvey.questions[step].id, option)}
                        className="w-full p-5 rounded-2xl border border-slate-200 text-left font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all flex justify-between items-center group"
                      >
                        {option}
                        <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
