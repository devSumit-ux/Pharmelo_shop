
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Smartphone, 
  CreditCard, Truck, Upload, Settings, Search,
  Menu, X, Plus, Minus, Trash2, ArrowLeft,
  Clock, AlertTriangle, DollarSign, User, Sparkles,
  FileText, Download, CheckCircle, UploadCloud, ChevronDown, MoreHorizontal, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---

const MEDICINES = [
  { id: 1, name: 'Dolo 650mg Tablet', batch: 'DL-2024', exp: '12/2025', stock: 120, mrp: 30, rate: 24, category: 'Fever' },
  { id: 2, name: 'Augmentin 625 Duo', batch: 'AG-9921', exp: '08/2024', stock: 45, mrp: 200, rate: 160, category: 'Antibiotic' },
  { id: 3, name: 'Pan 40 Tablet', batch: 'PN-1102', exp: '10/2025', stock: 300, mrp: 110, rate: 85, category: 'Gastric' },
  { id: 4, name: 'Montair LC', batch: 'ML-5541', exp: '06/2025', stock: 80, mrp: 180, rate: 140, category: 'Allergy' },
  { id: 5, name: 'Shelcal 500', batch: 'SC-2231', exp: '01/2026', stock: 150, mrp: 120, rate: 95, category: 'Supplement' },
  { id: 6, name: 'Ascoril LS Syrup', batch: 'AS-8812', exp: '03/2025', stock: 25, mrp: 115, rate: 90, category: 'Cough' },
  { id: 7, name: 'Volini Gel 30g', batch: 'VL-7741', exp: '11/2026', stock: 60, mrp: 85, rate: 65, category: 'Pain Relief' },
  { id: 8, name: 'Allegra 120mg', batch: 'AL-3321', exp: '09/2025', stock: 10, mrp: 210, rate: 170, category: 'Allergy' },
];

const INITIAL_ORDERS = [
  { id: '#2021', customer: 'Rahul Verma', items: ['Dolo 650mg x2', 'Pan 40 x1'], total: 170, status: 'Pending', time: '10 min ago' },
  { id: '#2022', customer: 'Sneha Gupta', items: ['Volini Gel x1'], total: 85, status: 'Ready', time: '25 min ago' },
  { id: '#2023', customer: 'Amit Kumar', items: ['Augmentin 625 x1', 'Shelcal 500 x1'], total: 320, status: 'Completed', time: '1 hour ago' },
];

const SALES_DATA = [
  { day: 'Mon', value: 4200 },
  { day: 'Tue', value: 3800 },
  { day: 'Wed', value: 6500 },
  { day: 'Thu', value: 4900 },
  { day: 'Fri', value: 8400 },
  { day: 'Sat', value: 10200 },
  { day: 'Sun', value: 12450 }, // Today
];

const PURCHASES = [
  { id: 'PO-9921', supplier: 'Apollo Distributors', date: '12 Feb 2024', items: 15, amount: 12500, status: 'Received' },
  { id: 'PO-9922', supplier: 'Solan Pharma Hub', date: '14 Feb 2024', items: 8, amount: 4200, status: 'Pending' },
  { id: 'PO-9923', supplier: 'Himachal Medicos', date: '10 Feb 2024', items: 45, amount: 35000, status: 'Received' },
];

const SUPPLIERS = [
  { id: 1, name: 'Apollo Distributors', contact: 'Vikram Singh', phone: '+91 98765 11111', email: 'orders@apollo.com', rating: 4.8 },
  { id: 2, name: 'Solan Pharma Hub', contact: 'Anita Sharma', phone: '+91 98765 22222', email: 'solanpharma@gmail.com', rating: 4.5 },
  { id: 3, name: 'Himachal Medicos', contact: 'Rajeev Kumar', phone: '+91 98765 33333', email: 'sales@himachalmed.com', rating: 4.2 },
];

const IMPORT_HISTORY = [
  { id: 1, filename: 'inventory_update_feb.csv', date: '14 Feb 2024, 10:00 AM', records: 450, status: 'Success' },
  { id: 2, filename: 'new_stock_jan.xlsx', date: '01 Jan 2024, 09:30 AM', records: 120, status: 'Success' },
];

type Tab = 'dashboard' | 'pos' | 'inventory' | 'orders' | 'purchases' | 'suppliers' | 'import' | 'settings' | 'documents';

const SalesChart = () => {
  const max = Math.max(...SALES_DATA.map(d => d.value));
  // Create a smooth-ish path
  const points = SALES_DATA.map((d, i) => {
    const x = (i / (SALES_DATA.length - 1)) * 100;
    // Normalize Y between 10% (top padding) and 100% (bottom)
    const y = 100 - ((d.value / max) * 90); 
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-80 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
         <h4 className="font-bold text-slate-700">Revenue Analytics</h4>
         <select className="text-xs border border-slate-200 rounded-lg p-1 text-slate-500 bg-slate-50">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
         </select>
      </div>
      
      {/* Chart Container - Flex 1 takes remaining height */}
      <div className="flex-1 w-full relative min-h-0"> 
         
         {/* Background Grid */}
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {[...Array(5)].map((_, i) => (
               <div key={i} className="w-full h-px bg-slate-50 border-t border-dashed border-slate-100" />
            ))}
         </div>

         {/* SVG Layer */}
         <div className="absolute inset-0 pb-6">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <polygon
                   fill="url(#gradient)"
                   stroke="none"
                   points={`0,100 ${points} 100,100`}
                />
                {/* Line */}
                <polyline
                   fill="none"
                   stroke="#10b981"
                   strokeWidth="3"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   points={points}
                   vectorEffect="non-scaling-stroke"
                />
             </svg>
         </div>

         {/* Interactive Points Layer */}
         <div className="absolute inset-0 pb-6">
             {SALES_DATA.map((d, i) => {
                const x = (i / (SALES_DATA.length - 1)) * 100;
                const normalizedY = 100 - ((d.value / max) * 90);
                
                return (
                   <div 
                      key={i} 
                      className="group absolute top-0 bottom-0 w-8 -ml-4 flex flex-col justify-end items-center cursor-pointer z-10"
                      style={{ left: `${x}%` }}
                   >
                      {/* Hover Line */}
                      <div 
                        className="w-px bg-emerald-500/20 absolute top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity border-l border-dashed border-emerald-500/50"
                        style={{ height: `${100 - normalizedY}%`, bottom: 0 }}
                      />

                      {/* Dot */}
                      <div 
                         className="w-3 h-3 bg-white border-2 border-emerald-500 rounded-full z-20 group-hover:scale-125 transition-transform absolute"
                         style={{ bottom: `calc(${100 - normalizedY}% - 6px)` }}
                      />
                      
                      {/* Tooltip */}
                      <div 
                         className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-30 mb-2 transform -translate-y-2"
                         style={{ bottom: `calc(${100 - normalizedY}% + 10px)` }}
                      >
                         ₹{d.value}
                      </div>
                      
                      {/* X-Axis Label */}
                      <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400">{d.day}</div>
                   </div>
                )
             })}
         </div>
      </div>
      
      <div className="mt-2 flex justify-between text-slate-400 text-xs font-medium border-t border-slate-50 pt-2 shrink-0">
         <span>₹3,000</span>
         <span>Target: ₹15,000/day</span>
      </div>
    </div>
  );
};

const ShopOwnerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [cart, setCart] = useState<{item: any, qty: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [importProgress, setImportProgress] = useState(0);
  const navigate = useNavigate();

  // Dashboard Stats
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount = MEDICINES.filter(m => m.stock < 50).length;

  // --- ACTIONS ---

  const addToCart = (medicine: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === medicine.id);
      if (existing) {
        return prev.map(i => i.item.id === medicine.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item: medicine, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id) return { ...i, qty: Math.max(1, i.qty + delta) };
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.item.mrp * curr.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert(`Order Processed! Amount: ₹${cartTotal} via ${paymentMode}`);
    setCart([]);
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleImport = () => {
    setImportProgress(10);
    const interval = setInterval(() => {
        setImportProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                alert("Import Successful! 50 new items added.");
                return 0;
            }
            return prev + 10;
        });
    }, 200);
  };

  // --- RENDERERS ---

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id); if (window.innerWidth < 768) setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
        activeTab === id 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
        : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <StoreIcon className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-none">Pharmelo Shop</h1>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">VERIFIED</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="pos" icon={CreditCard} label="POS & Billing" />
          <SidebarItem id="inventory" icon={Package} label="Inventory" />
          <SidebarItem id="orders" icon={Smartphone} label="App Orders" />
          
          <div className="my-4 border-t border-slate-100 pt-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Management</div>
          
          <SidebarItem id="purchases" icon={Truck} label="Purchases" />
          <SidebarItem id="suppliers" icon={User} label="Suppliers" />
          <SidebarItem id="documents" icon={FileText} label="My Documents" />
          <SidebarItem id="import" icon={Upload} label="Import Data" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />

          {/* Exit Button in Sidebar for mobile */}
          <button 
            onClick={() => navigate('/owners')}
            className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-4 font-bold"
          >
            <ArrowLeft size={20} />
            <span>Exit Demo</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
             {/* Back Button for Desktop */}
             <button 
                onClick={() => navigate('/owners')}
                className="hidden md:flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mr-4 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
             >
                <ArrowLeft size={16} /> Exit Demo
             </button>

             <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">Rajesh Kumar</div>
                <div className="text-xs text-slate-500">Owner • Solan, HP</div>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" alt="Owner" className="w-full h-full object-cover" loading="lazy" width="40" height="40" />
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-emerald-600 rounded-2xl p-8 text-white flex justify-between items-center shadow-lg shadow-emerald-600/20">
                 <div>
                    <h3 className="text-2xl font-bold mb-2">Welcome back, Rajesh!</h3>
                    <p className="text-emerald-100">Here's what's happening in your store today.</p>
                 </div>
                 <button onClick={() => setActiveTab('pos')} className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                    New Sale
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    { label: "Today's Sales", val: "₹12,450", icon: DollarSign, color: "emerald" },
                    { label: "Pending Orders", val: pendingCount, icon: Clock, color: "blue" },
                    { label: "Inventory Value", val: "₹1.6L", icon: Package, color: "indigo" },
                    { label: "Low Stock Items", val: lowStockCount, icon: AlertTriangle, color: "amber" }
                 ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                       <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                          <stat.icon size={24} />
                       </div>
                       <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                       <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
                    </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <SalesChart />
                 </div>
                 <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h4 className="font-bold text-slate-700 mb-4">Recent Sales</h4>
                    <div className="space-y-4">
                       {[1,2,3,4,5].map((i) => (
                          <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">#{i}</div>
                                <div>
                                   <div className="text-sm font-bold text-slate-900">Walk-in Customer</div>
                                   <div className="text-[10px] text-slate-400">2 mins ago</div>
                                </div>
                             </div>
                             <div className="text-sm font-bold text-emerald-600">+₹{100 * i + 50}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* POS TAB */}
          {activeTab === 'pos' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full animate-fade-in">
               {/* Product Selection */}
               <div className="flex-1 flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                           type="text" 
                           placeholder="F2: Search Medicine / Batch..."
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
                           value={searchQuery}
                           onChange={e => setSearchQuery(e.target.value)}
                        />
                     </div>
                     <input type="text" placeholder="Doctor Name" className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
                  </div>

                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                     <div className="grid grid-cols-12 bg-slate-50 p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                        <div className="col-span-5">Medicine</div>
                        <div className="col-span-2">Batch</div>
                        <div className="col-span-2">Expiry</div>
                        <div className="col-span-1">Stock</div>
                        <div className="col-span-2 text-right">MRP</div>
                     </div>
                     <div className="overflow-y-auto flex-1">
                        {MEDICINES.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
                           <div 
                              key={m.id} 
                              onClick={() => addToCart(m)}
                              className="grid grid-cols-12 p-4 border-b border-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors items-center"
                           >
                              <div className="col-span-5 font-medium text-slate-900 flex items-center gap-3">
                                 {/* Medicine Image */}
                                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                    <img 
                                      src={`https://api.dicebear.com/7.x/shapes/svg?seed=${m.name}`} 
                                      alt={m.name} 
                                      className="w-6 h-6 opacity-80" 
                                      loading="lazy"
                                      width="24"
                                      height="24"
                                    />
                                 </div>
                                 <div>
                                    <div>{m.name}</div>
                                    <div className="text-[10px] text-slate-400">{m.category}</div>
                                 </div>
                              </div>
                              <div className="col-span-2 text-xs text-slate-500">{m.batch}</div>
                              <div className="col-span-2 text-xs text-slate-500">{m.exp}</div>
                              <div className={`col-span-1 text-xs font-bold ${m.stock < 50 ? 'text-red-500' : 'text-emerald-600'}`}>{m.stock}</div>
                              <div className="col-span-2 text-right font-bold text-slate-900">₹{m.mrp}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Cart / Bill */}
               <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                  <div className="p-4 border-b border-slate-100">
                     <h3 className="font-bold text-slate-900">Current Bill</h3>
                     <p className="text-xs text-slate-400">Invoice #{Math.floor(Math.random() * 10000)}</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {cart.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                           <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
                           <p className="text-sm">Cart is empty.</p>
                           <p className="text-xs">Search and click medicines to add.</p>
                        </div>
                     ) : (
                        cart.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 {/* Medicine Image in Cart */}
                                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                    <img 
                                      src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.item.name}`} 
                                      alt={item.item.name} 
                                      className="w-8 h-8 opacity-80" 
                                      loading="lazy"
                                      width="32"
                                      height="32"
                                    />
                                 </div>
                                 <div>
                                    <div className="font-bold text-sm text-slate-900">{item.item.name}</div>
                                    <div className="text-xs text-slate-500">₹{item.item.mrp} x {item.qty}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button onClick={() => updateCartQty(item.item.id, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Minus size={12}/></button>
                                 <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                 <button onClick={() => updateCartQty(item.item.id, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Plus size={12}/></button>
                                 <button onClick={() => removeFromCart(item.item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"><Trash2 size={14}/></button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500">Total Amount</span>
                        <span className="text-2xl font-bold text-slate-900">₹{cartTotal}</span>
                     </div>
                     
                     <div className="grid grid-cols-3 gap-2 mb-4">
                        {['Cash', 'UPI', 'Card'].map(mode => (
                           <button 
                              key={mode}
                              onClick={() => setPaymentMode(mode as any)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                 paymentMode === mode 
                                 ? 'bg-emerald-600 text-white border-emerald-600' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                           >
                              {mode}
                           </button>
                        ))}
                     </div>

                     <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Complete Sale
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
             <div className="animate-fade-in bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-900">Medicine Stock</h3>
                   <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                      <Plus size={16} /> Add Medicine
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                         <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Batch No</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">MRP</th>
                            <th className="p-4">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {MEDICINES.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                               <td className="p-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200">
                                        <img 
                                          src={`https://api.dicebear.com/7.x/shapes/svg?seed=${m.name}`} 
                                          alt={m.name} 
                                          className="w-6 h-6 opacity-80" 
                                          loading="lazy"
                                          width="24"
                                          height="24"
                                        />
                                     </div>
                                     <span className="font-bold text-slate-700">{m.name}</span>
                                  </div>
                               </td>
                               <td className="p-4 text-sm text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{m.category}</span></td>
                               <td className="p-4 text-sm text-slate-500 font-mono">{m.batch}</td>
                               <td className="p-4 text-sm text-slate-500">{m.exp}</td>
                               <td className="p-4">
                                  <span className={`font-bold text-sm ${m.stock < 50 ? 'text-red-500' : 'text-emerald-600'}`}>
                                     {m.stock} units
                                  </span>
                               </td>
                               <td className="p-4 text-sm font-bold text-slate-900">₹{m.mrp}</td>
                               <td className="p-4">
                                  <button className="text-blue-600 hover:underline text-xs font-bold">Edit</button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {/* APP ORDERS TAB */}
          {activeTab === 'orders' && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex gap-4 overflow-x-auto pb-2">
                   {['All', 'Pending', 'Ready', 'Completed'].map(status => (
                      <button key={status} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
                         {status}
                      </button>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <div className="text-xs text-slate-400 font-bold uppercase mb-1">Order {order.id}</div>
                               <div className="font-bold text-slate-900 text-lg">{order.customer}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                               order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                               order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                               'bg-emerald-100 text-emerald-700'
                            }`}>
                               {order.status}
                            </span>
                         </div>
                         
                         <div className="bg-slate-50 p-4 rounded-xl mb-4 space-y-2">
                            {order.items.map((item, i) => (
                               <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                  {item}
                               </div>
                            ))}
                         </div>

                         <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-slate-400">{order.time}</div>
                            <div className="font-bold text-slate-900">Total: ₹{order.total}</div>
                         </div>

                         {order.status === 'Pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Ready')} className="w-full mt-4 bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                               Accept & Pack
                            </button>
                         )}
                         {order.status === 'Ready' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                               Mark Handed Over
                            </button>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* PURCHASES TAB */}
          {activeTab === 'purchases' && (
             <div className="animate-fade-in bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-900">Purchase Orders</h3>
                   <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                      <Plus size={16} /> New Order
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                         <tr>
                            <th className="p-4">PO Number</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {PURCHASES.map(po => (
                            <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 text-sm font-bold text-slate-700">{po.id}</td>
                               <td className="p-4 text-sm font-bold text-slate-900">{po.supplier}</td>
                               <td className="p-4 text-sm text-slate-500">{po.date}</td>
                               <td className="p-4 text-sm text-slate-500">{po.items}</td>
                               <td className="p-4 text-sm font-bold text-slate-900">₹{po.amount}</td>
                               <td className="p-4">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {po.status}
                                  </span>
                               </td>
                               <td className="p-4">
                                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><FileText size={16} /></button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {/* SUPPLIERS TAB */}
          {activeTab === 'suppliers' && (
             <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                   <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input type="text" placeholder="Search suppliers..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64" />
                   </div>
                   <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                      <Plus size={16} /> Add Supplier
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {SUPPLIERS.map(sup => (
                      <div key={sup.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${sup.name}`} alt={sup.name} loading="lazy" width="48" height="48" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{sup.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                  <span>★</span> {sup.rating}
                                </div>
                            </div>
                         </div>
                         <div className="space-y-2 text-sm text-slate-600 mb-6">
                            <div className="flex justify-between">
                               <span className="text-slate-400">Contact</span>
                               <span className="font-medium">{sup.contact}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-slate-400">Phone</span>
                               <span className="font-medium">{sup.phone}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-slate-400">Email</span>
                               <span className="font-medium">{sup.email}</span>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="flex-1 border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">History</button>
                            <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800">New Order</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* DOCUMENTS TAB - NEW */}
          {activeTab === 'documents' && (
             <div className="max-w-4xl animate-fade-in space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                   <div>
                      <h3 className="font-bold text-slate-900 mb-1">Legal Documents</h3>
                      <p className="text-slate-500 text-sm">Manage your pharmacy licenses and business registrations.</p>
                   </div>
                   <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                      <Upload size={16} /> Upload New
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* License Card */}
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={64} className="text-emerald-600"/></div>
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                            <FileText size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Drug License (Form 20/21)</h4>
                            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">VERIFIED</span>
                         </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                         <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">License No</span>
                            <span className="font-mono font-bold">DL-19284/HP</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Valid Until</span>
                            <span className="font-bold">31 Dec 2025</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-slate-400">Last Verified</span>
                            <span>14 Feb 2024</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200">View File</button>
                         <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200">Renew</button>
                      </div>
                   </div>

                   {/* GST Card */}
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <FileText size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">GST Registration</h4>
                            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">VERIFIED</span>
                         </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                         <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">GSTIN</span>
                            <span className="font-mono font-bold">02ABCDE1234F1Z5</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className="font-bold text-green-600">Active</span>
                         </div>
                      </div>
                      <button className="w-full bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 border border-slate-200">View Certificate</button>
                   </div>
                </div>
             </div>
          )}

          {/* IMPORT DATA TAB */}
          {activeTab === 'import' && (
             <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                         <UploadCloud size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Import Inventory</h3>
                      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Drag and drop your CSV or Excel file here to bulk update your stock levels.</p>
                      
                      <div 
                        onClick={handleImport}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                         {importProgress > 0 && importProgress < 100 ? (
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                               <div className="bg-blue-600 h-full transition-all duration-200" style={{width: `${importProgress}%`}}></div>
                            </div>
                         ) : (
                            <>
                               <div className="text-blue-600 font-bold mb-1">Click to Upload</div>
                               <div className="text-xs text-slate-400">or drag and drop</div>
                            </>
                         )}
                      </div>
                      
                      <div className="mt-6 flex justify-center gap-4">
                         <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600"><Download size={14} /> Download Template</button>
                      </div>
                   </div>

                   <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">Recent Imports</div>
                      {IMPORT_HISTORY.map(imp => (
                         <div key={imp.id} className="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="bg-green-50 p-2 rounded-lg text-green-600"><FileText size={18}/></div>
                               <div>
                                  <div className="text-sm font-bold text-slate-900">{imp.filename}</div>
                                  <div className="text-xs text-slate-400">{imp.date}</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-xs font-bold text-green-600 flex items-center justify-end gap-1"><CheckCircle size={12}/> {imp.status}</div>
                               <div className="text-xs text-slate-500">{imp.records} records</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 mb-2">POS Integration</h4>
                      <p className="text-xs text-indigo-700 mb-4">Connect your existing billing software (Marg, Vyapar) directly.</p>
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">Setup Sync</button>
                   </div>
                   
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-4 text-sm">Supported Formats</h4>
                      <ul className="space-y-2 text-xs text-slate-500">
                         <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> CSV (Comma Separated)</li>
                         <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Excel (.xlsx, .xls)</li>
                         <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500"/> Marg Backup XML</li>
                      </ul>
                   </div>
                </div>
             </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
             <div className="max-w-2xl animate-fade-in bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Store Settings</h3>
                
                <div className="space-y-6">
                   <div>
                      <h4 className="font-bold text-slate-700 mb-4">General Information</h4>
                      <div className="grid grid-cols-1 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pharmacy Name</label>
                            <input type="text" defaultValue="Pharmelo Shop Solan" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                               <input type="text" defaultValue="+91 98765 43210" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                               <input type="text" defaultValue="The Mall, Solan" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100">
                      <h4 className="font-bold text-slate-700 mb-4">System Preferences</h4>
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                         <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-blue-600" size={20} />
                            <h5 className="font-bold text-blue-900">AI Inventory Intelligence</h5>
                         </div>
                         <p className="text-sm text-blue-700 mb-4">Automatically categorize new medicines and predict stock requirements based on sales history.</p>
                         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Auto-Categorize Now</button>
                      </div>
                   </div>

                   <div className="pt-6 flex justify-end">
                      <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Save Changes</button>
                   </div>
                </div>
             </div>
          )}

          {/* Placeholders for other tabs */}
          {(activeTab === 'purchases' || activeTab === 'suppliers') && (
             <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                   <Settings className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Under Development</h3>
                <p className="text-slate-500">This module is part of the Pro Plan.</p>
             </div>
          )}

        </main>
      </div>
    </div>
  );
};

// Simple Store Icon Component
const StoreIcon = ({className}: {className?: string}) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
)

export default ShopOwnerDemo;
