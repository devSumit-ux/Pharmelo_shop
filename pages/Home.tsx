
import React, { useState } from 'react';
import Hero from '../components/Hero';
import AboutPharmelo from '../components/AboutPharmelo';
import FeatureValidation from '../components/FeatureValidation';
import TrustSection from '../components/TrustSection';
import ContactSurvey from '../components/ContactSurvey';
import WaitlistModal from '../components/WaitlistModal';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'waitlist' | 'community'}>({
    isOpen: false,
    type: 'waitlist'
  });

  const openModal = (type: 'waitlist' | 'community') => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  return (
    <div className="animate-fade-in bg-white">
      {/* Hidden SEO Heading structure to help crawlers understand page hierarchy without affecting visual design */}
      <h1 className="sr-only">Pharmelo: Online Medicine Order & Pickup in Solan, Himachal Pradesh. Founded by Sumit Gupta.</h1>
      
      <Hero />
      <AboutPharmelo />
      <FeatureValidation />
      <TrustSection />
      <ContactSurvey onOpenModal={openModal} />
      
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Help Us Build the Future
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Your feedback today will shape the healthcare ecosystem of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/survey" className="px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
               Take the Survey
             </Link>
          </div>
        </div>
      </section>

      {/* Global Modal Instance */}
      <WaitlistModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        type={modalState.type}
      />
    </div>
  );
};

export default Home;
