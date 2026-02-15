import React, { useState } from 'react';
import { Building2, User, Phone, Mail, FileText, MapPin, Loader2, CheckCircle2, ArrowRight, ShieldCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const SERVICES = [
  "Prescription Refills",
  "OTC Sales",
  "Specialty Medications",
  "Home Delivery",
  "Vaccinations"
];

const PartnerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    ownerName: '',
    email: '',
    phone: '',
    licenseNo: '',
    address: '',
    services: [] as string[]
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const { error } = await supabase
        .from('early_partners')
        .insert([{
          pharmacy_name: formData.pharmacyName,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          license_no: formData.licenseNo,
          address: formData.address,
          services: formData.services
        }]);

      if (error) throw error;

      setStatus('success');
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit application. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4 animate-fade-in">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 max-w-2xl w-full text-center border border-slate-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Application Received</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Thank you for partnering with Pharmelo. Our verification team will review your pharmacy license details and contact you at <span className="font-bold text-slate-900">{formData.email}</span> within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-colors">
              Back to Home
            </Link>
            <Link to="/documentation" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">
              Read Documentation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side - Value Prop */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Join Network</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Grow your pharmacy business with Pharmelo.
              </h1>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                Join the fastest-growing digital pharmacy network. We handle the technology so you can focus on patient care and filling orders.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Verified Partner Badge", desc: "Gain trust instantly with our verification seal." },
                  { title: "Zero Commission Trial", desc: "Keep 100% of your revenue for the first 3 months." },
                  { title: "Smart Inventory Sync", desc: "Connect your existing POS in less than 10 minutes." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="bg-blue-50 p-3 rounded-xl h-fit">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
               {/* Decorative background blob */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -z-0 pointer-events-none opacity-60" />

               <h2 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">Pharmacy Details</h2>
               
               {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium relative z-10">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    {errorMessage}
                  </div>
               )}

               <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Pharmacy Name</label>
                   <div className="relative">
                     <Building2 className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                     <input 
                        required
                        name="pharmacyName"
                        value={formData.pharmacyName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        placeholder="e.g. City Care Chemists"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Owner Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                        <input 
                            required
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                        <input 
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                     <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        placeholder="partner@pharmacy.com"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Pharmacy License Number</label>
                   <div className="relative">
                     <FileText className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                     <input 
                        required
                        name="licenseNo"
                        value={formData.licenseNo}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        placeholder="e.g. DL-12345/2023"
                     />
                   </div>
                   <p className="text-xs text-slate-400 ml-1">We will verify this against official records.</p>
                 </div>

                 <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-700 ml-1">Primary Services</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {SERVICES.map((service) => (
                       <label key={service} className={`
                         flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all relative overflow-hidden
                         ${formData.services.includes(service) 
                           ? 'bg-blue-50 border-blue-200 shadow-sm' 
                           : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}
                       `}>
                         <div className={`
                           w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
                           ${formData.services.includes(service) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}
                         `}>
                           {formData.services.includes(service) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                         </div>
                         <input 
                           type="checkbox" 
                           className="hidden"
                           checked={formData.services.includes(service)}
                           onChange={() => handleServiceChange(service)}
                         />
                         <span className={`text-sm font-medium ${formData.services.includes(service) ? 'text-blue-900' : 'text-slate-600'}`}>
                           {service}
                         </span>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 ml-1">Full Address</label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
                     <textarea 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                        placeholder="Shop No, Street, City, State, Pincode"
                     />
                   </div>
                 </div>

                 <div className="pt-4">
                   <button 
                     type="submit" 
                     disabled={status === 'submitting'}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {status === 'submitting' ? (
                       <>
                         <Loader2 className="animate-spin h-5 w-5" /> Submitting...
                       </>
                     ) : (
                       <>
                         Submit Application <ArrowRight className="h-5 w-5" />
                       </>
                     )}
                   </button>
                   <p className="text-center text-xs text-slate-400 mt-4">
                     By submitting, you agree to Pharmelo's <a href="#" className="text-blue-600 hover:underline">Partner Terms</a>.
                   </p>
                 </div>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;