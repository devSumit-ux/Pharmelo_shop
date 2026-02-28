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
            {isTerms ? (
              <>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Effective Date: March 2026</p>
                <p>
                  Welcome to Pharmelo. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Pharmelo Technologies ("Pharmelo", "we", "us") governing your access to and use of the Pharmelo platform, website, and mobile application. By accessing or using our platform, you explicitly agree to be bound by these Terms.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Nature of the Platform & Safe Harbor</h3>
                <p>
                  Pharmelo operates strictly as a technology intermediary as defined under Section 2(1)(w) of the Information Technology Act, 2000. We provide a digital platform connecting users with independent, licensed pharmacies and registered medical practitioners. <strong>Pharmelo is NOT a pharmacy, medical clinic, or healthcare provider.</strong> We do not manufacture, stock, dispense, or prescribe medicines. We are entitled to safe harbor protection under Section 79 of the Information Technology Act, 2000, and are not liable for third-party information, data, or communication links made available or hosted by us.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Prescription Medication Policy</h3>
                <p>
                  In strict compliance with the Drugs and Cosmetics Act, 1940, and the Drugs and Cosmetics Rules, 1945, the purchase of Schedule H, H1, and X drugs requires a valid prescription from a Registered Medical Practitioner. By uploading a prescription, you legally declare that it is authentic, valid, and has not been tampered with. The dispensing partner pharmacy reserves the absolute and unquestionable right to reject any order if the prescription is deemed invalid, expired, or fraudulent.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Teleconsultation Services</h3>
                <p>
                  Any teleconsultation services facilitated through Pharmelo are governed by the Telemedicine Practice Guidelines, 2020. Doctors listed on the platform are independent professionals. Pharmelo assumes absolutely no responsibility or liability for the medical advice, diagnosis, treatment, or any medical negligence provided by the practitioner. The doctor-patient relationship is strictly between you and the respective medical practitioner.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. User Obligations & Prohibited Conduct</h3>
                <p>
                  You must be at least 18 years of age to use this platform. You agree not to use the platform for any unlawful purpose, including but not limited to: procuring restricted drugs without lawful authorization, impersonation, submitting forged documents, or distributing malware. Any breach of this clause will result in immediate termination of your account and potential legal action.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. DISCLAIMER OF WARRANTIES & LIMITATION OF LIABILITY</h3>
                <p className="uppercase text-sm font-bold text-slate-700 bg-slate-100 p-4 rounded-xl border border-slate-200">
                  The platform and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. To the maximum extent permitted by applicable law, Pharmelo expressly disclaims all liability for any direct, indirect, incidental, consequential, special, or punitive damages arising out of your use of the platform. This includes, but is not limited to, medical complications, adverse drug reactions, misdiagnosis, or errors made by dispensing pharmacies or consulting doctors. In no event shall Pharmelo's total aggregate liability to you for all damages, losses, and causes of action exceed INR 1,000 (Indian Rupees One Thousand).
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Indemnification</h3>
                <p>
                  You agree to unconditionally indemnify, defend, and hold harmless Pharmelo, its founders, officers, employees, and affiliates from and against any and all claims, liabilities, damages, losses, costs, or expenses (including reasonable attorney's fees) arising directly or indirectly from your violation of these Terms, submission of fraudulent prescriptions, or any misuse of the platform.
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Governing Law and Exclusive Jurisdiction</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes, claims, or legal proceedings arising out of or in connection with these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the competent courts situated in Solan, Himachal Pradesh, and the Hon'ble High Court of Himachal Pradesh at Shimla.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Effective Date: March 2026</p>
                <p>
                  Pharmelo Technologies ("Pharmelo", "we", "us") is deeply committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines our practices regarding the collection, use, storage, and protection of your data in strict compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
                </p>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h3>
                <p>To provide our services, we collect the following categories of data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, phone number, email address, and delivery address.</li>
                  <li><strong>Sensitive Personal Data or Information (SPDI):</strong> Medical records, prescriptions, health conditions, consultation history, and payment transaction details.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Lawful Purpose of Data Collection</h3>
                <p>Your data is collected strictly for lawful purposes directly connected to our services, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Facilitating the verification and fulfillment of medicine orders by licensed partner pharmacies.</li>
                  <li>Connecting you with registered medical practitioners for teleconsultations.</li>
                  <li>Maintaining your digital health records for your personal convenience and continuity of care.</li>
                  <li>Complying with statutory record-keeping requirements under Indian pharmaceutical laws.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing and Disclosure</h3>
                <p>
                  <strong>We do not sell, rent, or trade your personal data to third-party advertisers.</strong> Your data is shared strictly on a need-to-know basis with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Partner Pharmacies:</strong> To legally verify prescriptions and dispense your orders.</li>
                  <li><strong>Medical Practitioners:</strong> To facilitate your requested medical consultations.</li>
                  <li><strong>Law Enforcement & Legal Authorities:</strong> We reserve the right to disclose your information when legally mandated by court orders, government requests, or to protect Pharmelo against fraud, illegal activities, or imminent harm.</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Security & Retention</h3>
                <p>
                  We implement robust, industry-standard security measures, including encryption and secure server hosting, to protect your SPDI against unauthorized access, alteration, or disclosure. We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as mandated by applicable Indian laws (e.g., pharmacy and medical record-keeping requirements).
                </p>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. User Rights & Consent</h3>
                <p>
                  By using Pharmelo, you provide explicit consent to the collection and processing of your data as described herein. You have the right to access, correct, or request the deletion of your personal data stored on our platform, subject to legal retention obligations. You may withdraw your consent at any time; however, doing so will limit or terminate our ability to provide you with our services.
                </p>

                <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Grievance Redressal</h3>
                <p>
                  In accordance with the Information Technology Act, 2000, and applicable data protection laws, if you have any grievances regarding data privacy or security, please contact our Grievance Officer immediately.
                </p>
              </>
            )}
            
            <div className="mt-12 pt-8 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 text-base">Legal Contact & Grievance Officer</h4>
                <p className="text-slate-600 text-sm">
                  For legal inquiries, notices, or privacy grievances, please contact our legal team at <a href="mailto:pharmeloshop@gmail.com" className="text-blue-600 hover:underline font-medium">pharmeloshop@gmail.com</a>.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;