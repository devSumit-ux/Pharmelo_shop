
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={32} className="text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold">Privacy & Ethics First</h2>
          </div>
          <div className="space-y-4 text-blue-100 text-lg leading-relaxed">
            <p>“No personal data will be misused. Survey data is anonymous and used only for research & product improvement.”</p>
            <p>We are committed to building a platform that respects the sanctity of healthcare data. Our research follows strict ethical guidelines to ensure your feedback remains confidential.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
