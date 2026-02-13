import React, { useState } from 'react';
import { Book, Code, FileCheck, Settings, Menu, X, ChevronRight, Terminal, LayoutDashboard, ShoppingBag, Package, AlertTriangle, Clock, Shield } from 'lucide-react';

const SECTIONS = [
  { id: 'intro', title: 'Introduction', icon: Book },
  { id: 'onboarding', title: 'Onboarding & Verification', icon: FileCheck },
  { id: 'inventory', title: 'Inventory Management', icon: LayoutDashboard },
  { id: 'pos-integration', title: 'POS Integration', icon: Terminal },
  { id: 'order-flow', title: 'Order Fulfillment', icon: ShoppingBag },
  { id: 'settings', title: 'Store Settings', icon: Settings },
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Pharmelo Partner Documentation</h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                Welcome to the Pharmelo Partner Hub. This documentation is designed to help pharmacy owners, managers, and developers integrate their stores with the Pharmelo network.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">For Owners</h3>
                <p className="text-slate-600 mb-4">Learn how to manage your store profile, verify your license, and view payout reports.</p>
                <button onClick={() => setActiveSection('onboarding')} className="text-blue-600 font-bold text-sm flex items-center hover:underline">
                  Start Onboarding <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">For Developers</h3>
                <p className="text-slate-600 mb-4">Technical guides for integrating existing POS systems via our Inventory API.</p>
                <button onClick={() => setActiveSection('pos-integration')} className="text-indigo-600 font-bold text-sm flex items-center hover:underline">
                  View API Reference <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'onboarding':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 text-blue-600 mb-4 font-bold uppercase text-xs tracking-wider">
                   <FileCheck className="h-4 w-4" /> Verification
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Onboarding Process</h1>
                <p className="text-lg text-slate-500">
                  To ensure patient safety, every pharmacy on Pharmelo must undergo a strict verification process.
                </p>
             </div>
             
             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Required Documents</h3>
                <ul className="space-y-3">
                   {['Valid Drug License (Form 20/21)', 'GST Registration Certificate', 'PAN Card of the Owner', 'Cancelled Cheque (for payouts)'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                         <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                         <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                   ))}
                </ul>
             </div>

             <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="font-bold text-amber-800 mb-2">Important Note</h4>
                <p className="text-amber-700 text-sm">
                   Verification typically takes 24-48 hours. You will receive an email notification once your store is live.
                </p>
             </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-8 animate-fade-in">
             {/* Header */}
             <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 text-emerald-600 mb-4 font-bold uppercase text-xs tracking-wider">
                   <LayoutDashboard className="h-4 w-4" /> Partner Dashboard
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Inventory Management</h1>
                <p className="text-lg text-slate-500">
                  Keep your stock levels accurate to prevent cancellations and build customer trust.
                </p>
             </div>

             {/* Features Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                   <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                     <Package className="h-5 w-5" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Batch Tracking</h3>
                   <p className="text-slate-500 text-sm">
                     Track medicine expiry dates by batch. Pharmelo automatically hides batches expiring within 30 days.
                   </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                   <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                     <AlertTriangle className="h-5 w-5" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Low Stock Alerts</h3>
                   <p className="text-slate-500 text-sm">
                     Get notified when fast-moving items drop below your set threshold (e.g., 10 units).
                   </p>
                </div>
             </div>

             {/* Manual Update Guide */}
             <div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Updating Stock Manually</h3>
               <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-sm overflow-x-auto shadow-xl">
                  <p className="mb-2 text-slate-500">// Example: Updating stock via the Partner App</p>
                  <div className="space-y-1">
                    <p>1. Open <span className="text-white">"My Inventory"</span> tab.</p>
                    <p>2. Scan barcode or search <span className="text-green-400">"Dolo 650"</span>.</p>
                    <p>3. Tap <span className="text-blue-400">"Update Stock"</span>.</p>
                    <p>4. Enter new quantity: <span className="text-yellow-400">500</span>.</p>
                    <p>5. Save.</p>
                  </div>
               </div>
             </div>
          </div>
        );
      case 'pos-integration':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 text-indigo-600 mb-4 font-bold uppercase text-xs tracking-wider">
                   <Terminal className="h-4 w-4" /> Developer Guide
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">POS Integration</h1>
                <p className="text-lg text-slate-500">
                  Sync your local inventory with Pharmelo in real-time using our Inventory API.
                </p>
             </div>

             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Upload Inventory</h3>
                <p className="text-slate-600">
                   Send a POST request to <code>/api/v1/inventory/sync</code> with your current stock levels.
                </p>
                
                <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-xl">
                   <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <pre className="text-blue-300 font-mono text-sm">
{`// POST https://api.pharmelo.com/v1/inventory/sync
{
  "store_id": "store_882190",
  "items": [
    {
      "sku": "PARA-500",
      "name": "Paracetamol 500mg",
      "qty": 150,
      "price": 25.00
    },
    {
      "sku": "VIT-C-100",
      "name": "Vitamin C Chewable",
      "qty": 45,
      "price": 40.00
    }
  ]
}`}
                   </pre>
                </div>
             </div>
          </div>
        );
      case 'order-flow':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 text-purple-600 mb-4 font-bold uppercase text-xs tracking-wider">
                   <ShoppingBag className="h-4 w-4" /> Operations
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Order Fulfillment</h1>
                <p className="text-lg text-slate-500">
                  Understand the lifecycle of a Pharmelo order from "New" to "Picked Up".
                </p>
             </div>

             {/* Status Flow */}
             <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-8">
                   <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center text-blue-600 z-10">1</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">New Order Received</h3>
                      <p className="text-slate-600 mb-3">You receive a loud notification on the partner tablet/phone. The order is marked <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">PENDING</span>.</p>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-center gap-3">
                         <Clock className="h-4 w-4" />
                         <span>Target Time: Accept within 60 seconds.</span>
                      </div>
                   </div>

                   <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-amber-100 border-4 border-white shadow-sm flex items-center justify-center text-amber-600 z-10">2</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Packing</h3>
                      <p className="text-slate-600">Pack the items in a bag. Staple the generated invoice/slip to the bag.</p>
                   </div>

                   <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center text-emerald-600 z-10">3</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for Pickup</h3>
                      <p className="text-slate-600 mb-3">Mark the order as <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">READY</span>. The customer is notified to come to the store.</p>
                   </div>

                   <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center text-slate-600 z-10">4</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Handover</h3>
                      <p className="text-slate-600">Scan the customer's QR code at the counter to complete the order.</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 text-slate-500 mb-4 font-bold uppercase text-xs tracking-wider">
                   <Settings className="h-4 w-4" /> Configuration
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Store Settings</h1>
                <p className="text-lg text-slate-500">
                  Manage your store's visibility, operating hours, and team access.
                </p>
             </div>

             <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                         <Clock className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-slate-900 mb-2">Operating Hours</h3>
                         <p className="text-slate-500 text-sm mb-4">
                           Set your open and close times. Orders placed outside these hours will be scheduled for the next day.
                         </p>
                         <div className="grid grid-cols-2 gap-4 max-w-sm">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                               <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Open</span>
                               <span className="font-mono font-bold text-slate-900">09:00 AM</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                               <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Close</span>
                               <span className="font-mono font-bold text-slate-900">10:00 PM</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                         <Shield className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-slate-900 mb-2">Staff Access Control</h3>
                         <p className="text-slate-500 text-sm mb-4">
                           Grant specific permissions to your staff.
                         </p>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                               <span className="text-sm font-medium text-slate-700">Manager (Full Access)</span>
                               <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                               <span className="text-sm font-medium text-slate-700">Counter Staff (Orders Only)</span>
                               <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Settings className="h-8 w-8 text-slate-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Section Under Construction</h3>
             <p className="text-slate-500">We are currently writing the documentation for this section.</p>
          </div>
        );
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out pt-24 pb-10 overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
         <div className="px-6 mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Table of Contents</h2>
            <nav className="space-y-1">
               {SECTIONS.map((section) => (
                 <button
                   key={section.id}
                   onClick={() => { setActiveSection(section.id); setIsSidebarOpen(false); window.scrollTo(0,0); }}
                   className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                     activeSection === section.id 
                       ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                       : 'text-slate-600 hover:bg-slate-200/50'
                   }`}
                 >
                   <section.icon className={`h-4 w-4 ${activeSection === section.id ? 'text-white' : 'text-slate-400'}`} />
                   {section.title}
                 </button>
               ))}
            </nav>
         </div>
         
         <div className="px-6 mt-auto">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <h4 className="font-bold text-blue-900 text-sm mb-1">Need Help?</h4>
               <p className="text-blue-700 text-xs mb-3">Contact our partner support team.</p>
               <a 
                 href="mailto:support@pharmelo.com" 
                 className="text-center block text-xs bg-blue-600 text-white px-3 py-2 rounded-lg font-bold w-full hover:bg-blue-700 transition-colors"
               >
                 Contact Support
               </a>
            </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen">
         <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default Documentation;