import React from 'react';
import ShopOwnerDemo from '../components/ShopOwnerDemo';

const ShopOwnerDemoPage: React.FC = () => {
  return (
    // We remove standard padding because the demo is a full-screen app simulation
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <ShopOwnerDemo />
    </div>
  );
};

export default ShopOwnerDemoPage;