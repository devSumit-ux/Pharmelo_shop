
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Search, Home, User, Calendar, 
  MapPin, Bell, Menu, Plus, Minus, Trash2, 
  ChevronRight, Eye, EyeOff, Thermometer, Activity, 
  Heart, Zap, ShieldCheck, CheckCircle2, ArrowRight,
  LogOut, Settings, CreditCard, Clock, Check, QrCode,
  X, Upload, FileText, Loader2, Camera, Smartphone,
  Ticket, Pill, MessageCircle, ChevronLeft, Stethoscope
} from 'lucide-react';

// --- Types & Mock Data ---

type Screen = 'login' | 'app';
type Tab = 'home' | 'search' | 'bookings' | 'profile' | 'doctors' | 'records';
type BookingTab = 'active' | 'history';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  category: string;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  // Pain Relief
  { id: '1', name: 'Paracetamol 500mg', type: 'Tablet', price: 25, category: 'Pain Relief', inStock: true },
  { id: '2', name: 'Ibuprofen 400mg', type: 'Tablet', price: 45, category: 'Pain Relief', inStock: true },
  { id: '3', name: 'Aspirin 75mg', type: 'Tablet', price: 15, category: 'Pain Relief', inStock: true },
  { id: '4', name: 'Diclofenac Gel', type: 'Tube', price: 85, category: 'Pain Relief', inStock: true },
  { id: '5', name: 'Combiflam', type: 'Tablet', price: 35, category: 'Pain Relief', inStock: true },
  
  // Antibiotic
  { id: '6', name: 'Azithromycin 500mg', type: 'Tablet', price: 120, category: 'Antibiotic', inStock: true },
  { id: '7', name: 'Amoxicillin 500mg', type: 'Capsule', price: 85, category: 'Antibiotic', inStock: true },
  { id: '8', name: 'Cefixime 200mg', type: 'Tablet', price: 140, category: 'Antibiotic', inStock: true },
  { id: '9', name: 'Ofloxacin 200mg', type: 'Tablet', price: 95, category: 'Antibiotic', inStock: true },

  // Digestive
  { id: '10', name: 'Pantoprazole 40mg', type: 'Tablet', price: 95, category: 'Digestive', inStock: true },
  { id: '11', name: 'Digene Gel', type: 'Syrup', price: 110, category: 'Digestive', inStock: true },
  { id: '12', name: 'Omeprazole 20mg', type: 'Capsule', price: 60, category: 'Digestive', inStock: true },
  { id: '13', name: 'ORS Powder', type: 'Sachet', price: 20, category: 'Digestive', inStock: true },
  
  // Vitamins
  { id: '14', name: 'Vitamin C 500mg', type: 'Tablet', price: 40, category: 'Vitamins', inStock: true },
  { id: '15', name: 'Calcium + D3', type: 'Tablet', price: 150, category: 'Vitamins', inStock: true },
  { id: '16', name: 'B-Complex', type: 'Capsule', price: 55, category: 'Vitamins', inStock: true },
  { id: '17', name: 'Multivitamin', type: 'Syrup', price: 180, category: 'Vitamins', inStock: true },

  // Diabetes
  { id: '18', name: 'Metformin 500mg', type: 'Tablet', price: 30, category: 'Diabetes', inStock: true },
  { id: '19', name: 'Gluconorm G1', type: 'Tablet', price: 85, category: 'Diabetes', inStock: true },
  { id: '20', name: 'Accu-Chek Strips', type: 'Pack', price: 850, category: 'Diabetes', inStock: true },

  // Cardiac
  { id: '21', name: 'Atorvastatin 10mg', type: 'Tablet', price: 110, category: 'Cardiac', inStock: true },
  { id: '22', name: 'Telmisartan 40mg', type: 'Tablet', price: 90, category: 'Cardiac', inStock: true },
  { id: '23', name: 'Amlodipine 5mg', type: 'Tablet', price: 45, category: 'Cardiac', inStock: true },
  
  // Skin Care
  { id: '24', name: 'Aloe Vera Gel', type: 'Tube', price: 120, category: 'Skin Care', inStock: true },
  { id: '25', name: 'Ketoconazole Cream', type: 'Tube', price: 160, category: 'Skin Care', inStock: true },
  { id: '26', name: 'Sunscreen SPF 50', type: 'Lotion', price: 450, category: 'Skin Care', inStock: true },
];

const CATEGORIES = ['All', 'Pain Relief', 'Antibiotic', 'Digestive', 'Vitamins', 'Diabetes', 'Cardiac', 'Skin Care'];

const CONCERNS = [
  { label: 'Fever', icon: Thermometer },
  { label: 'Diabetes', icon: Activity },
  { label: 'Heart', icon: Heart },
  { label: 'Stomach', icon: Zap },
  { label: 'First Aid', icon: ShieldCheck },
];

const LOCATIONS = ['Solan, HP', 'Shimla, HP', 'Chandigarh, UT', 'Delhi, NCR'];

const PAST_BOOKINGS = [
  { id: '#8921', items: ['Cetirizine 10mg x1', 'Vicks Vaporub x1'], date: '10 Feb 2024', status: 'Completed', total: 165 },
  { id: '#8842', items: ['Band-Aids x2', 'Dettol Antiseptic x1'], date: '05 Feb 2024', status: 'Completed', total: 90 },
];

const DOCTORS = [
  { id: 1, name: 'Dr. Rajesh Sharma', specialty: 'General Physician', experience: '15 Years', available: '10:00 AM - 02:00 PM', phone: '+919876543210', fee: 500, degree: 'MBBS, MD (General Medicine)', license: 'MCI-12345', about: 'Dr. Rajesh Sharma is a highly experienced General Physician with over 15 years of practice. He specializes in treating common illnesses, managing chronic conditions like diabetes and hypertension, and providing preventive care.', slots: ['10:00 AM', '11:00 AM', '12:30 PM', '01:30 PM'], image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&auto=format&fit=crop' },
  { id: 2, name: 'Dr. Anita Verma', specialty: 'Pediatrician', experience: '10 Years', available: '04:00 PM - 08:00 PM', phone: '+919876543211', fee: 700, degree: 'MBBS, MD (Pediatrics)', license: 'MCI-67890', about: 'Dr. Anita Verma is a dedicated Pediatrician known for her compassionate care towards children. She has extensive experience in managing childhood illnesses, vaccinations, and developmental monitoring.', slots: ['04:00 PM', '05:30 PM', '06:00 PM', '07:30 PM'], image: 'https://images.unsplash.com/photo-1594824432258-f6a111de1ce0?q=80&w=256&auto=format&fit=crop' },
  { id: 3, name: 'Dr. Vikram Singh', specialty: 'Orthopedic', experience: '20 Years', available: '09:00 AM - 01:00 PM', phone: '+919876543212', fee: 800, degree: 'MBBS, MS (Orthopedics)', license: 'MCI-54321', about: 'Dr. Vikram Singh is a renowned Orthopedic surgeon specializing in joint replacements, sports injuries, and fracture management. He brings 20 years of surgical and clinical expertise.', slots: ['09:00 AM', '10:30 AM', '11:30 AM', '12:30 PM'], image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop' },
];

// --- Internal App Components ---

const PharmeloApp = ({ sharedBookings, setSharedBookings, sharedRecords, activeTab, setActiveTab, onBack }: { sharedBookings: any[], setSharedBookings: any, sharedRecords: any[], activeTab: Tab, setActiveTab: (t: Tab) => void, onBack: () => void }) => {
  const [screen, setScreen] = useState<Screen>('login');
  const [bookingTab, setBookingTab] = useState<BookingTab>('active');
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({msg: '', visible: false});
  const [currentLocation, setCurrentLocation] = useState('Solan, HP');
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  
  // Modals
  const [showQr, setShowQr] = useState<string | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState<any>(null);
  const [viewDoctorDetails, setViewDoctorDetails] = useState<any>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingFor, setBookingFor] = useState<'self' | 'other'>('self');
  const [patientName, setPatientName] = useState('Demo User');
  const [patientAddress, setPatientAddress] = useState('Solan, HP');
  const [patientProblem, setPatientProblem] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const prevBookingsLength = useRef(sharedBookings.length);

  useEffect(() => {
    if (sharedBookings.length > prevBookingsLength.current) {
      const newBooking = sharedBookings[0];
      if (newBooking && newBooking.source === 'whatsapp') {
        const isDoctor = newBooking.items[0]?.includes('Appointment');
        setToast({msg: isDoctor ? 'New appointment booked via AI!' : 'New order received from WhatsApp AI!', visible: true});
        setTimeout(() => setToast({msg: '', visible: false}), 4000);
        setHasUnreadNotification(true);
      }
      prevBookingsLength.current = sharedBookings.length;
    }
  }, [sharedBookings]);
  
  // Login State - PREFILLED GENERIC DEMO
  const [email, setEmail] = useState('demo@pharmelo.com');
  const [password, setPassword] = useState('pharmelo_demo_123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  const showToastMsg = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: '', visible: false }), 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setScreen('app');
    }, 800);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    showToastMsg(`Added ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.product.id === productId) {
              const newQty = Math.max(1, item.qty + delta);
              return { ...item, qty: newQty };
          }
          return item;
      }));
  };

  const placeOrder = () => {
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
    const newBooking = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart.map(i => `${i.product.name} x${i.qty}`),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Ready for Pickup',
      total
    };
    setIsLoading(true);
    setTimeout(() => {
        setSharedBookings([newBooking, ...sharedBookings]);
        setCart([]);
        setShowCart(false);
        setBookingTab('active');
        setActiveTab('bookings');
        setIsLoading(false);
        showToastMsg('Order Placed Successfully!');
        
        // Automatically show QR code after a short delay to enhance demo flow
        setTimeout(() => setShowQr(newBooking.id), 600);
    }, 1500);
  };

  const handleUploadRx = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 10;
        });
    }, 200);
    setTimeout(() => {
        setShowUploadModal(false);
        showToastMsg('Prescription Uploaded!');
        setUploadProgress(0);
    }, 2500);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // --- RENDERERS ---

  if (screen === 'login') {
    return (
      <div className="h-full flex flex-col bg-slate-50 p-8 justify-center animate-fade-in relative overflow-hidden font-sans">
         <button onClick={onBack} className="absolute top-12 left-6 text-slate-400 hover:text-slate-600 z-20 p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-transform active:scale-90">
            <ChevronLeft size={20} />
         </button>
         <div className="absolute top-0 left-0 w-full h-48 bg-emerald-50 rounded-b-[3rem] -z-0"></div>
         <div className="z-10 bg-white p-8 rounded-3xl shadow-xl shadow-emerald-900/5">
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transform -rotate-6">
                  <div className="w-8 h-4 border-2 border-white rounded-full transform -rotate-45"></div>
               </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome to Pharmelo</h2>
            <p className="text-center text-slate-400 text-sm mb-8">Your trusted pharmacy partner</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                 <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                 />
               </div>
               <div className="relative">
                 <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
               </div>
               <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 mt-4 flex justify-center items-center">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Sign In"}
               </button>
            </form>
            <div className="mt-6 text-center">
               <span className="text-xs text-slate-400">Don't have an account? <span className="text-emerald-600 font-bold cursor-pointer">Sign Up</span></span>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Toast Notification */}
      <div className={`absolute top-14 left-0 right-0 z-[60] flex justify-center transition-all duration-300 pointer-events-none ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              {toast.msg}
          </div>
      </div>

      {/* Top Header Area */}
      {(activeTab === 'home' || activeTab === 'profile') && (
         <div className="bg-emerald-600 px-6 pt-14 pb-24 rounded-b-[2.5rem] relative shrink-0 z-10 shadow-lg shadow-emerald-900/10">
            <div className="flex justify-between items-start">
               <div className="flex items-start gap-3">
                  <button onClick={onBack} className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors -ml-2 mt-0.5 active:scale-90">
                     <ChevronLeft size={22} />
                  </button>
                  {activeTab === 'home' ? (
                    <div>
                       <div className="text-emerald-100 text-xs font-medium tracking-wider mb-1">WELCOME BACK</div>
                       <div className="text-white text-2xl font-bold">Find Medicines</div>
                    </div>
                  ) : (
                    <div className="text-white text-2xl font-bold">Profile</div>
                  )}
               </div>
               <button className="bg-emerald-500/50 p-2 rounded-xl text-white backdrop-blur-sm hover:bg-emerald-500/70 transition-colors relative" onClick={() => setHasUnreadNotification(false)}>
                 <Bell size={20} />
                 {hasUnreadNotification && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></div>}
               </button>
            </div>
            
            {activeTab === 'home' && (
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10 group cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setShowLocationModal(true)}>
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                       <MapPin className="text-white" size={18} />
                    </div>
                    <div>
                       <div className="text-emerald-100 text-[10px] uppercase font-bold">Your Location</div>
                       <div className="text-white font-bold text-sm">{currentLocation}</div>
                    </div>
                 </div>
                 <button className="text-xs bg-white text-emerald-700 px-3 py-1.5 rounded-lg font-bold shadow-sm group-hover:scale-105 transition-transform">Change</button>
              </div>
            )}
         </div>
      )}

      {/* Main Scrollable Content */}
      <div className={`flex-1 overflow-y-auto no-scrollbar pb-20 -mt-16 relative z-10 ${activeTab !== 'home' && activeTab !== 'profile' ? 'mt-0 pt-14' : ''}`}>
         
         {/* HOME TAB */}
         {activeTab === 'home' && (
           <div className="px-6 space-y-6">
              {/* Stats Cards */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-2">
                 <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 min-w-[140px] flex-1">
                    <div className="text-3xl font-bold text-slate-800 mb-1">{PRODUCTS.length}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Available<br/>Medicines</div>
                 </div>
                 <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 min-w-[140px] flex-1">
                    <div className="text-3xl font-bold text-slate-800 mb-1">12</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Nearby<br/>Shops</div>
                 </div>
              </div>

              {/* Upload Rx Banner */}
              <div className="bg-emerald-600 rounded-3xl p-5 shadow-lg shadow-emerald-600/20 text-white flex justify-between items-center group cursor-pointer hover:bg-emerald-700 transition-colors" onClick={() => setShowUploadModal(true)}>
                 <div>
                    <div className="font-bold text-lg">Quick Order</div>
                    <div className="text-emerald-100 text-xs mt-1">Upload prescription & relax</div>
                 </div>
                 <button className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold group-hover:scale-105 transition-transform">Upload Rx</button>
              </div>

              {/* Concerns */}
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-emerald-600" size={18} />
                    <h3 className="font-bold text-slate-800">Shop by Concern</h3>
                 </div>
                 <div className="grid grid-cols-4 gap-3">
                    {CONCERNS.map((c, i) => (
                       <div key={i} onClick={() => setActiveTab('search')} className="flex flex-col items-center gap-2 cursor-pointer group">
                          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:border-emerald-200 transition-all">
                             <c.icon size={24} />
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">{c.label}</span>
                       </div>
                    ))}
                 </div>
              </div>

               {/* Categories Preview */}
               <div className="pt-2">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Popular Medicines</h3>
                    <button onClick={() => setActiveTab('search')} className="text-xs font-bold text-emerald-600">See All</button>
                 </div>
                 <div className="space-y-3">
                     {PRODUCTS.slice(0, 3).map(product => (
                         <div key={product.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-50 shadow-sm">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}`} alt="" className="w-6 h-6 opacity-50" loading="lazy" width="24" height="24" />
                             </div>
                             <div className="flex-1">
                                 <div className="text-sm font-bold text-slate-900">{product.name}</div>
                                 <div className="text-[10px] text-slate-400">{product.category}</div>
                             </div>
                             <button onClick={() => addToCart(product)} className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center active:bg-emerald-600 active:text-white transition-colors">
                                 <Plus size={14} />
                             </button>
                         </div>
                     ))}
                 </div>
               </div>
           </div>
         )}

         {/* SEARCH TAB */}
         {activeTab === 'search' && (
           <div className="px-5 h-full flex flex-col pt-12">
              <div className="flex items-center gap-3 mb-6 px-1">
                 <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-1.5 bg-white rounded-full shadow-sm border border-slate-100 active:scale-90">
                    <ChevronLeft size={20} />
                 </button>
                 <h2 className="text-2xl font-bold text-slate-900">Browse Medicines</h2>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                 <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search medicines..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
                 />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                 {CATEGORIES.map(cat => (
                    <button 
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          selectedCategory === cat 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                          : 'bg-white text-slate-600 border border-slate-200'
                       }`}
                    >
                       {cat}
                    </button>
                 ))}
              </div>

              {/* Product List */}
              <div className="space-y-4 pb-24">
                 {filteredProducts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">No medicines found.</div>
                 ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${product.name}`} alt="" className="w-8 h-8 opacity-50" loading="lazy" width="32" height="32" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                                <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">{product.category}</div>
                                <div className="text-xs font-bold text-slate-500 mt-1">₹{product.price}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors active:scale-90"
                        >
                            <Plus size={16} />
                        </button>
                        </div>
                    ))
                 )}
              </div>
           </div>
         )}

         {/* BOOKINGS TAB */}
         {activeTab === 'bookings' && (
           <div className="px-6 h-full pt-12">
              <div className="flex items-center gap-3 mb-6">
                 <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-1.5 bg-white rounded-full shadow-sm border border-slate-100 active:scale-90">
                    <ChevronLeft size={20} />
                 </button>
                 <h2 className="text-2xl font-bold text-slate-900">My Bookings</h2>
              </div>
              
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                 <button 
                    onClick={() => setBookingTab('active')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bookingTab === 'active' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                 >
                    Active
                 </button>
                 <button 
                    onClick={() => setBookingTab('history')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bookingTab === 'history' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                 >
                    History
                 </button>
              </div>

              {bookingTab === 'active' ? (
                 sharedBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Calendar size={32} />
                        </div>
                        <p className="text-slate-500 font-medium text-sm">No active bookings found.</p>
                        <button onClick={() => setActiveTab('search')} className="mt-4 text-emerald-600 text-sm font-bold">Browse Medicines</button>
                    </div>
                 ) : (
                    <div className="space-y-4">
                        {sharedBookings.map(booking => (
                        <div key={booking.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden animate-slide-up">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">Order ID</div>
                                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        {booking.id}
                                        {booking.source === 'whatsapp' && (
                                            <span className="bg-[#25D366]/10 text-[#25D366] text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <MessageCircle size={10} /> AI Order
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">{booking.status}</span>
                            </div>
                            <div className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {booking.items.join(', ')}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                <div className="text-xs text-slate-400">{booking.date}</div>
                                <div className="flex items-center gap-3">
                                   <div className="font-bold text-slate-900 text-sm">₹{booking.total}</div>
                                   
                                   {/* View Ticket / QR Button */}
                                   <button 
                                      onClick={() => setShowQr(booking.id)}
                                      className="group text-xs font-bold bg-slate-900 text-white pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-2 active:scale-95 transition-all hover:bg-emerald-600"
                                   >
                                      <span>Show QR</span>
                                      <div className="bg-white p-0.5 rounded">
                                        <QrCode size={12} className="text-slate-900"/>
                                      </div>
                                   </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                 )
              ) : (
                  <div className="space-y-4">
                      {PAST_BOOKINGS.map(booking => (
                        <div key={booking.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden opacity-75">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">Order ID</div>
                                    <div className="text-lg font-bold text-slate-700">{booking.id}</div>
                                </div>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full">{booking.status}</span>
                            </div>
                            <div className="text-sm text-slate-500 mb-4 line-clamp-2">
                                {booking.items.join(', ')}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                <div className="text-xs text-slate-400">{booking.date}</div>
                                <div className="font-bold text-slate-600 text-sm">₹{booking.total}</div>
                            </div>
                        </div>
                      ))}
                  </div>
              )}
           </div>
         )}

         {/* DOCTORS TAB */}
         {activeTab === 'doctors' && (
            <div className="animate-fade-in pb-24">
               <div className="px-6 pt-6 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Find a Doctor</h2>
                  <p className="text-sm text-slate-500">Book appointments instantly.</p>
               </div>
               
               <div className="px-6 mb-6">
                  <div className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100">
                     <Search size={20} className="text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="Search doctors or specialties..." 
                        className="bg-transparent border-none outline-none w-full text-sm text-slate-700"
                        value={doctorSearchQuery}
                        onChange={e => setDoctorSearchQuery(e.target.value)}
                     />
                  </div>
               </div>

               <div className="px-6 space-y-4">
                  {DOCTORS.filter(d => d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase())).map(doc => (
                     <div key={doc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-3">
                              <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" referrerPolicy="no-referrer" />
                              <div>
                                 <h3 className="font-bold text-slate-900">{doc.name}</h3>
                                 <p className="text-xs font-medium text-emerald-600">{doc.specialty}</p>
                              </div>
                           </div>
                           <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
                              {doc.experience}
                           </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                           <div className="flex items-center gap-1">
                              <Clock size={12} /> {doc.available}
                           </div>
                           <div className="font-bold text-slate-900">
                              ₹{doc.fee}
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button 
                              onClick={() => setViewDoctorDetails(doc)}
                              className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                           >
                              View Details
                           </button>
                           <button 
                              onClick={() => setShowDoctorModal(doc)}
                              className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                           >
                              Book in App
                           </button>
                        </div>
                     </div>
                  ))}
                  {DOCTORS.filter(d => d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase())).length === 0 && (
                     <div className="text-center py-8 text-slate-500 text-sm">No doctors found matching your search.</div>
                  )}
               </div>
            </div>
         )}

         {/* RECORDS TAB */}
         {activeTab === 'records' && (
            <div className="animate-fade-in pb-24">
               <div className="px-6 pt-6 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Health Records</h2>
                  <p className="text-sm text-slate-500">Your prescriptions and medical history.</p>
               </div>
               
               <div className="px-6 space-y-4">
                  {sharedRecords.map(record => (
                     <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <h3 className="font-bold text-slate-900">{record.hospital}</h3>
                              <p className="text-xs font-medium text-emerald-600">{record.doctor}</p>
                           </div>
                           <div className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">
                              {record.date}
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg">
                           <FileText size={14} className="text-emerald-600" />
                           <span className="font-medium">{record.type}</span>
                        </div>
                        {record.notes && (
                           <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {record.notes}
                           </div>
                        )}
                        <button className="w-full bg-emerald-50 text-emerald-700 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                           <Eye size={14} /> View Document
                        </button>
                     </div>
                  ))}
                  {sharedRecords.length === 0 && (
                     <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <FileText size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Records Found</h3>
                        <p className="text-slate-500 text-sm">Upload a prescription to get started.</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* PROFILE TAB */}
         {activeTab === 'profile' && (
           <div className="px-6 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center -mt-12 relative z-10">
                 <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-slate-300" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Demo User</h3>
                 <p className="text-sm text-slate-500">Consumer Account</p>
                 <button onClick={() => showToastMsg('Profile details saved')} className="mt-4 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">Edit Profile</button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100">
                 <h4 className="text-sm font-bold text-slate-900 mb-4">Personal Information</h4>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                       <User size={18} className="text-slate-400" />
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Full Name</div>
                          <div className="text-sm font-medium text-slate-700">Demo User</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                       <div className="text-[10px] text-slate-400 w-5 text-center font-bold">@</div>
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Email</div>
                          <div className="text-sm font-medium text-slate-700">{email || 'demo@example.com'}</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100">
                 <h4 className="text-sm font-bold text-slate-900 mb-4">Settings</h4>
                 <div className="space-y-2">
                     <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                             <CreditCard size={18} className="text-slate-400" />
                             <span className="text-sm font-medium text-slate-700">Payment Methods</span>
                         </div>
                         <ChevronRight size={16} className="text-slate-300" />
                     </button>
                     <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                             <Settings size={18} className="text-slate-400" />
                             <span className="text-sm font-medium text-slate-700">App Settings</span>
                         </div>
                         <ChevronRight size={16} className="text-slate-300" />
                     </button>
                     <button onClick={() => setScreen('login')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 transition-colors group">
                         <div className="flex items-center gap-3">
                             <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                             <span className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition-colors">Log Out</span>
                         </div>
                     </button>
                 </div>
              </div>
           </div>
         )}

      </div>

      {/* --- MODALS & OVERLAYS --- */}

      {/* QR Code Modal */}
      {showQr && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => setShowQr(null)}>
              <div className="bg-white p-8 rounded-t-[2rem] w-full text-center shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pickup Code</h3>
                  <p className="text-slate-500 text-xs mb-6">Show this QR code at the counter</p>
                  
                  <div className="bg-slate-900 p-4 rounded-2xl inline-block mb-6 shadow-xl relative">
                      {/* Using encodeURIComponent to safely handle order IDs with '#' */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(showQr)}&bgcolor=0f172a&color=ffffff&margin=0`} 
                        alt="QR Code" 
                        className="w-40 h-40 rounded-lg mix-blend-screen" 
                        loading="lazy"
                        width="150"
                        height="150"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="bg-white p-1 rounded-full">
                           <CheckCircle2 size={24} className="text-emerald-600" />
                         </div>
                      </div>
                  </div>
                  
                  <div className="text-2xl font-mono font-bold text-slate-900 tracking-widest mb-6">{showQr}</div>
                  
                  <button onClick={() => setShowQr(null)} className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200">
                      Close
                  </button>
              </div>
          </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end animate-fade-in" onClick={() => setShowLocationModal(false)}>
              <div className="bg-white w-full rounded-t-[2.5rem] p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Select Location</h3>
                      <button onClick={() => setShowLocationModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={16}/></button>
                  </div>
                  <div className="space-y-3 mb-6">
                      {LOCATIONS.map(loc => (
                          <button 
                            key={loc}
                            onClick={() => { setCurrentLocation(loc); setShowLocationModal(false); showToastMsg('Location Updated'); }}
                            className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${currentLocation === loc ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-transparent'}`}
                          >
                              <div className="flex items-center gap-3">
                                  <MapPin size={18} className={currentLocation === loc ? 'text-emerald-600' : 'text-slate-400'} />
                                  <span className={`font-bold ${currentLocation === loc ? 'text-emerald-900' : 'text-slate-600'}`}>{loc}</span>
                              </div>
                              {currentLocation === loc && <CheckCircle2 size={18} className="text-emerald-600" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Upload Rx Modal */}
      {showUploadModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => !uploadProgress && setShowUploadModal(false)}>
              <div className="bg-white p-6 rounded-t-[2rem] w-full text-center shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                  {uploadProgress > 0 && uploadProgress < 100 ? (
                      <div className="py-8">
                          <Loader2 size={40} className="text-emerald-600 animate-spin mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-slate-900 mb-1">Uploading...</h3>
                          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                      </div>
                  ) : uploadProgress === 100 ? (
                      <div className="py-8">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                              <CheckCircle2 size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Upload Successful!</h3>
                          <p className="text-slate-500 text-xs mt-1">Pharmacist will review shortly.</p>
                      </div>
                  ) : (
                      <>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Prescription</h3>
                        <p className="text-slate-500 text-xs mb-6">Take a photo or upload from gallery</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={handleUploadRx} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                                <Camera size={24} className="text-slate-400 group-hover:text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">Camera</span>
                            </button>
                            <button onClick={handleUploadRx} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                                <FileText size={24} className="text-slate-400 group-hover:text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">Gallery</span>
                            </button>
                        </div>
                        
                        <button onClick={() => setShowUploadModal(false)} className="text-slate-400 text-xs font-bold hover:text-slate-600">Cancel</button>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Floating Cart Button (Only on Search & Home) */}
      {(activeTab === 'search' || activeTab === 'home') && cartCount > 0 && !showCart && (
         <div className="absolute bottom-24 left-0 right-0 px-6 z-20 animate-fade-in">
            <button 
               onClick={() => setShowCart(true)}
               className="w-full bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800 active:scale-95 transition-transform"
            >
               <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/40">{cartCount}</div>
                  <span className="font-medium text-sm">View Cart</span>
               </div>
               <span className="font-bold">₹{cartTotal}</span>
            </button>
         </div>
      )}

      {/* Cart Bottom Sheet Overlay */}
      {showCart && (
         <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 max-h-[85%] flex flex-col animate-slide-up shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Your Cart</h3>
                  <button onClick={() => setShowCart(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><Minus size={16} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  {cart.map(item => (
                     <div key={item.product.id} className="flex justify-between items-center border-b border-slate-50 pb-4">
                        <div>
                           <div className="font-bold text-slate-900">{item.product.name}</div>
                           <div className="text-xs text-slate-500">₹{item.product.price} / unit</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center bg-slate-50 rounded-lg">
                               <button onClick={() => updateQty(item.product.id, -1)} className="p-1.5 hover:text-emerald-600"><Minus size={14}/></button>
                               <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                               <button onClick={() => updateQty(item.product.id, 1)} className="p-1.5 hover:text-emerald-600"><Plus size={14}/></button>
                           </div>
                           <div className="text-sm font-bold text-emerald-600 w-12 text-right">₹{item.product.price * item.qty}</div>
                           <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="border-t border-slate-100 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-slate-500 text-sm">Subtotal</span>
                     <span className="font-bold text-slate-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 text-sm">
                     <span>Booking Fee</span>
                     <span className="font-bold">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-50">
                     <span className="text-slate-900 font-bold text-lg">Total</span>
                     <span className="font-bold text-emerald-600 text-xl">₹{cartTotal}</span>
                  </div>
               </div>

               <button onClick={placeOrder} disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/30 active:scale-95 transition-transform flex justify-between items-center px-6">
                  {isLoading ? (
                      <div className="flex items-center justify-center w-full gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                      </div>
                  ) : (
                      <>
                        <span>Confirm Pickup</span>
                        <ArrowRight size={20} />
                      </>
                  )}
               </button>
            </div>
         </div>
      )}

      {/* Doctor Details Modal */}
      {viewDoctorDetails && (
         <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full h-[90%] rounded-t-[2.5rem] flex flex-col animate-slide-up shadow-2xl overflow-hidden">
               <div className="flex justify-between items-center p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Doctor Profile</h3>
                  <button onClick={() => setViewDoctorDetails(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={16} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center gap-4">
                     <img src={viewDoctorDetails.image} alt={viewDoctorDetails.name} className="w-20 h-20 rounded-full object-cover border-4 border-emerald-50 shadow-sm" referrerPolicy="no-referrer" />
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">{viewDoctorDetails.name}</h2>
                        <p className="text-emerald-600 font-medium">{viewDoctorDetails.specialty}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Experience</div>
                        <div className="font-bold text-slate-900">{viewDoctorDetails.experience}</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Consultation Fee</div>
                        <div className="font-bold text-slate-900">₹{viewDoctorDetails.fee}</div>
                     </div>
                  </div>

                  <div>
                     <h4 className="font-bold text-slate-900 mb-2">About</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">{viewDoctorDetails.about}</p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                     <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-emerald-600" />
                        Available Slots Today
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {viewDoctorDetails.slots.map((slot: string) => (
                           <span key={slot} className="bg-white text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200">
                              {slot}
                           </span>
                        ))}
                     </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                     <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        Verified Credentials
                     </h4>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-emerald-700">Degree</span>
                           <span className="font-bold text-emerald-900">{viewDoctorDetails.degree}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-emerald-700">License No.</span>
                           <span className="font-bold text-emerald-900">{viewDoctorDetails.license}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-100 bg-white">
                  <button 
                     onClick={() => {
                        setShowDoctorModal(viewDoctorDetails);
                        setViewDoctorDetails(null);
                     }}
                     className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
                  >
                     Book Appointment
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Doctor Booking Modal */}
      {showDoctorModal && (
         <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 max-h-[85%] flex flex-col animate-slide-up shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                  <button onClick={() => setShowDoctorModal(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={16} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto pr-2 -mr-2 mb-6 space-y-6">
                  <div>
                     <div className="flex items-center gap-3 mb-4">
                        <img src={showDoctorModal.image} alt={showDoctorModal.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" referrerPolicy="no-referrer" />
                        <div>
                           <div className="font-bold text-slate-900 text-lg">{showDoctorModal.name}</div>
                           <div className="text-sm text-emerald-600 font-medium">{showDoctorModal.specialty}</div>
                        </div>
                     </div>
                     <div className="text-sm font-bold text-slate-900 mb-4">Consultation Fee: ₹{showDoctorModal.fee}</div>
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Available Slot</label>
                     <div className="grid grid-cols-3 gap-3">
                        {showDoctorModal.slots.map((slot: string) => (
                           <button
                              key={slot}
                              onClick={() => setBookingTime(slot)}
                              className={`py-2 rounded-xl text-sm font-bold border transition-colors ${bookingTime === slot ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-600'}`}
                           >
                              {slot}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Booking For</label>
                     <div className="flex gap-3 mb-4">
                        <button 
                           onClick={() => {
                              setBookingFor('self');
                              setPatientName('Demo User');
                              setPatientAddress('Solan, HP');
                           }}
                           className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${bookingFor === 'self' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900'}`}
                        >
                           Myself
                        </button>
                        <button 
                           onClick={() => {
                              setBookingFor('other');
                              setPatientName('');
                              setPatientAddress('');
                           }}
                           className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${bookingFor === 'other' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900'}`}
                        >
                           Someone Else
                        </button>
                     </div>

                     <div className="space-y-3">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Patient Name</label>
                           <input 
                              type="text" 
                              value={patientName}
                              onChange={e => setPatientName(e.target.value)}
                              placeholder="Enter patient name"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
                           <input 
                              type="text" 
                              value={patientAddress}
                              onChange={e => setPatientAddress(e.target.value)}
                              placeholder="Enter patient address"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Problem / Symptoms</label>
                           <textarea 
                              value={patientProblem}
                              onChange={e => setPatientProblem(e.target.value)}
                              placeholder="Briefly describe the problem..."
                              rows={2}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" 
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-100">
                  <button 
                     onClick={() => {
                        if(!bookingTime) return alert('Please select a time slot');
                        if(!patientName.trim()) return alert('Please enter patient name');
                        if(!patientAddress.trim()) return alert('Please enter patient address');
                        if(!patientProblem.trim()) return alert('Please describe the problem');
                        
                        const formattedTime = bookingTime;

                        setSharedBookings((prev: any) => [{
                           id: `#A${Math.floor(1000 + Math.random() * 9000)}`,
                           items: [`Appointment with ${showDoctorModal.name}`, `Patient: ${patientName}`],
                           date: `Today, ${formattedTime}`,
                           status: 'Confirmed',
                           total: showDoctorModal.fee,
                           source: 'app'
                        }, ...prev]);
                        
                        setToast({msg: 'Appointment Confirmed!', visible: true});
                        setTimeout(() => setToast({msg: '', visible: false}), 3000);
                        setShowDoctorModal(null);
                        setBookingTime('');
                        setPatientProblem('');
                        setActiveTab('bookings');
                     }}
                     className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/30 active:scale-95 transition-transform"
                  >
                     Confirm Booking
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 py-3 px-6 pb-6 flex justify-between items-center z-20">
         {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'doctors', icon: Stethoscope, label: 'Doctors' },
            { id: 'records', icon: FileText, label: 'Records' },
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'profile', icon: User, label: 'Profile' },
         ].map(tab => (
            <button 
               key={tab.id}
               onClick={() => { setActiveTab(tab.id as Tab); setScreen('app'); }}
               className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`}
            >
               <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} className="transition-all duration-300" />
               <span className={`text-[10px] font-medium transition-all ${activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 hidden'}`}>{tab.label}</span>
            </button>
         ))}
      </div>

    </div>
  );
};

// --- WhatsApp Simulation Component ---

const WhatsAppApp = ({ sharedRecords, onOrderPlaced, onRecordAdded, onBack }: { sharedRecords: any[], onOrderPlaced: (booking: any) => void, onRecordAdded: (record: any) => void, onBack: () => void }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I am Pharmelo AI. How can I help you today?\n\n1️⃣ Order Medicine\n2️⃣ Book Doctor Appointment\n3️⃣ View Health Records\n\nReply with 1, 2, or 3.', sender: 'bot', time: '10:00 AM', isImage: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [flow, setFlow] = useState<'none' | 'medicine' | 'doctor'>('none');
  const [bookingDetails, setBookingDetails] = useState({ time: '', name: '', address: '', problem: '' });

  const handleSend = (text: string = inputText, isImage: boolean = false) => {
    if (!text && !isImage) return;
    
    const newMsg = { id: Date.now(), text: isImage ? '📷 Prescription.jpg' : text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase().trim();

      // Initial Selection
      if (step === 0) {
        if (lowerText === '1' || lowerText.includes('medicine') || lowerText.includes('order')) {
          setFlow('medicine');
          setStep(1);
          setMessages(prev => [...prev, { id: Date.now(), text: 'Great! Please send me your prescription (click the camera icon) or type the medicines you need.', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        } else if (lowerText === '2' || lowerText.includes('doctor') || lowerText.includes('book')) {
          setFlow('doctor');
          setStep(10);
          setMessages(prev => [...prev, { id: Date.now(), text: 'Sure! Please tell me the doctor\'s name or the specialty you are looking for (e.g., "Dr. Sharma" or "Pediatrician").', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        } else if (lowerText === '3' || lowerText.includes('record') || lowerText.includes('health')) {
          setFlow('none');
          setStep(0);
          const recordsText = sharedRecords.length > 0 
            ? sharedRecords.map(r => `- ${r.date}: ${r.type} from ${r.hospital} (${r.doctor})`).join('\n')
            : 'You have no health records yet.';
          setMessages(prev => [...prev, { id: Date.now(), text: `Here are your recent health records:\n\n${recordsText}\n\nReply with 1 or 2 to order medicine or book a doctor.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        } else {
          setMessages(prev => [...prev, { id: Date.now(), text: 'Please reply with "1" for Medicine, "2" for Doctor Appointment, or "3" for Health Records.', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        }
      } 
      // Medicine Flow
      else if (flow === 'medicine') {
        if (step === 1 && isImage) {
          setMessages(prev => [...prev, { id: Date.now(), text: 'Scanning prescription... 🔍', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          
          setTimeout(() => {
             setMessages(prev => [...prev, { id: Date.now(), text: 'I found:\n- CALPOL (₹40)\n- Delcon (₹65)\n- Levolin (₹55)\n- Meftal-p (₹45)\n\nTotal: ₹205\n\nReply "YES" to confirm your order.', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
             setStep(2);
             setIsTyping(false);
          }, 1500);
          return; // Skip the default setIsTyping(false) below
        } else if (step === 2 && lowerText === 'yes') {
          const orderId = `#${Math.floor(1000 + Math.random() * 9000)}`;
          setMessages(prev => [...prev, { id: Date.now(), text: `✅ Order confirmed! Your Order ID is ${orderId}.\n\nIt will be ready for pickup in 15 mins. You can track it in the Pharmelo app.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          
          setTimeout(() => {
             setMessages(prev => [...prev, { id: Date.now(), text: `I see this prescription is from Dr. Sharma. Would you like to book a follow-up appointment with him? Reply 'YES' to book or 'NO' to skip.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
             setIsTyping(false);
          }, 1500);

          setStep(3);
          
          onOrderPlaced({
            id: orderId,
            items: ['CALPOL', 'Delcon', 'Levolin', 'Meftal-p'],
            date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Ready for Pickup',
            total: 205,
            source: 'whatsapp'
          });

          onRecordAdded({
            id: Date.now(),
            hospital: 'City Clinic',
            doctor: 'Dr. Sharma',
            date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'Prescription',
            notes: 'Uploaded via WhatsApp AI'
          });
          return;
        } else if (step === 3) {
            if (lowerText === 'yes') {
                setFlow('doctor');
                setStep(11);
                setMessages(prev => [...prev, { id: Date.now(), text: `Great! Dr. Sharma (General Physician) is available today at:\n- 10:00 AM\n- 11:30 AM\n- 02:00 PM\n\nPlease reply with your preferred time.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
            } else {
                setStep(4);
                setMessages(prev => [...prev, { id: Date.now(), text: `Okay, no problem. Let me know if you need anything else!`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
            }
        } else {
          setMessages(prev => [...prev, { id: Date.now(), text: 'I am a demo bot. Please upload a prescription (click the camera icon) to test the AI flow!', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        }
      }
      // Doctor Flow
      else if (flow === 'doctor') {
        if (step === 10) {
          setMessages(prev => [...prev, { id: Date.now(), text: `I found Dr. Sharma (General Physician) at Solan Clinic.\n\nAvailable slots for today:\n- 10:00 AM\n- 11:30 AM\n- 02:00 PM\n\nPlease reply with your preferred time.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          setStep(11);
        } else if (step === 11) {
          const appointmentTime = text.toUpperCase();
          setBookingDetails(prev => ({ ...prev, time: appointmentTime }));
          setMessages(prev => [...prev, { id: Date.now(), text: `Great! Are you booking this appointment for yourself or someone else? Reply "Myself" or "Someone else".`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          setStep(12);
        } else if (step === 12) {
          if (lowerText.includes('myself') || lowerText.includes('self')) {
             setBookingDetails(prev => ({ ...prev, name: 'Demo User', address: 'Solan, HP' }));
             setMessages(prev => [...prev, { id: Date.now(), text: `Got it. Please briefly describe the problem or symptoms.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
             setStep(15);
          } else {
             setMessages(prev => [...prev, { id: Date.now(), text: `Please provide the patient's name.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
             setStep(13);
          }
        } else if (step === 13) {
          setBookingDetails(prev => ({ ...prev, name: text }));
          setMessages(prev => [...prev, { id: Date.now(), text: `Please provide the patient's address.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          setStep(14);
        } else if (step === 14) {
          setBookingDetails(prev => ({ ...prev, address: text }));
          setMessages(prev => [...prev, { id: Date.now(), text: `Please briefly describe the problem or symptoms.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          setStep(15);
        } else if (step === 15) {
          setBookingDetails(prev => ({ ...prev, problem: text }));
          const orderId = `#A${Math.floor(1000 + Math.random() * 9000)}`;
          setMessages(prev => [...prev, { id: Date.now(), text: `✅ Appointment confirmed with Dr. Sharma at ${bookingDetails.time}.\nPatient: ${bookingDetails.name || 'Demo User'}\nConsultation Fee: ₹500\n\nYou will receive a reminder 30 minutes before your visit.`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
          setStep(16);
          
          onOrderPlaced({
            id: orderId,
            items: [`Appointment with Dr. Sharma at ${bookingDetails.time}`, `Patient: ${bookingDetails.name || 'Demo User'}`],
            date: `Today, ${bookingDetails.time}`,
            status: 'Confirmed',
            total: 500,
            source: 'whatsapp'
          });
        } else {
          setMessages(prev => [...prev, { id: Date.now(), text: 'Your appointment is already booked. Type "Hi" to start over.', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isImage: false }]);
        }
      }

      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] font-sans relative">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-2 z-10 shadow-md pt-12">
         <button onClick={onBack} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors -ml-2 active:scale-90">
            <ChevronLeft size={24} />
         </button>
         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Pill className="text-[#075e54]" size={24} />
         </div>
         <div className="flex-1">
            <div className="font-bold flex items-center gap-1">Pharmelo AI <CheckCircle2 size={14} className="text-blue-400 fill-current" /></div>
            <div className="text-xs text-emerald-100">online</div>
         </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
         {messages.map(m => (
           <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-2 shadow-sm relative ${m.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                 {m.isImage ? (
                    <div className="w-48 h-64 bg-slate-200 rounded mb-1 flex items-center justify-center border border-slate-300 overflow-hidden relative">
                       <img src="https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTc0ZGMyNDcwLTRlNzEtMTFlZi04MGUwLTg5MTBmNjk1YjZkZS5qcGc=" alt="Prescription" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                 ) : (
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">{m.text}</div>
                 )}
                 <div className="text-[10px] text-slate-400 text-right mt-1">{m.time}</div>
              </div>
           </div>
         ))}
         {isTyping && (
           <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm flex gap-1">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
           </div>
         )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-transparent pb-6">
         <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm">
               <button onClick={() => handleSend('', true)} className="text-slate-400 hover:text-emerald-600 mr-2 transition-colors">
                  <Camera size={20} />
               </button>
               <input 
                 type="text" 
                 placeholder="Message" 
                 className="flex-1 bg-transparent outline-none text-sm"
                 value={inputText}
                 onChange={e => setInputText(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && handleSend()}
               />
            </div>
            <button onClick={() => handleSend()} className="w-10 h-10 bg-[#008f68] rounded-full flex items-center justify-center text-white shadow-sm hover:bg-[#075e54] transition-colors">
               <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  )
}

// --- Main Wrapper Component ---

const WishlistFeature: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState(`https://pharmelo.com/demo?session=${Math.floor(Math.random() * 10000)}`);
  const [activeApp, setActiveApp] = useState<'home' | 'pharmelo' | 'whatsapp'>('home');
  const [pharmeloTab, setPharmeloTab] = useState<Tab>('home');
  const [sharedBookings, setSharedBookings] = useState<any[]>([]);
  const [sharedRecords, setSharedRecords] = useState<any[]>([
    { id: 1, hospital: 'City Hospital', doctor: 'Dr. Sharma', date: '10 Feb 2024', type: 'Prescription', notes: 'Fever and cold medication' }
  ]);
  const [pushNotification, setPushNotification] = useState<{title: string, message: string} | null>(null);
  
  useEffect(() => {
    // Dynamically get current window URL for the QR code
    if (typeof window !== 'undefined' && window.location.href) {
        setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <section id="wishlist" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="order-2 lg:order-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Simulator</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
               Experience the <span className="text-emerald-600">Future of Pharmacy</span>.
             </h2>
             <p className="text-slate-500 text-lg mb-8 leading-relaxed">
               Try our fully functional simulation on the right. Switch to <strong>WhatsApp AI</strong>, upload a prescription, and watch the AI automatically place an order in your <strong>Pharmelo App</strong>.
             </p>
             
             <div className="space-y-6 mb-10">
               <div className="flex gap-4 group">
                 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">1</div>
                 <div>
                   <h4 className="text-slate-900 font-bold text-lg">Open WhatsApp AI</h4>
                   <p className="text-slate-500 text-sm">Click the WhatsApp icon on the simulated phone's home screen.</p>
                 </div>
               </div>
               <div className="flex gap-4 group">
                 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">2</div>
                 <div>
                   <h4 className="text-slate-900 font-bold text-lg">Upload Prescription</h4>
                   <p className="text-slate-500 text-sm">Click the camera icon to simulate uploading an Rx.</p>
                 </div>
               </div>
               <div className="flex gap-4 group">
                 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">3</div>
                 <div>
                   <h4 className="text-slate-900 font-bold text-lg">See the Magic</h4>
                   <p className="text-slate-500 text-sm">Confirm the order and watch the push notification appear!</p>
                 </div>
               </div>
             </div>
             
             {/* Scan QR Code Section */}
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-emerald-500/5 inline-flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default">
                <div className="relative">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff`} 
                        className="w-20 h-20 rounded-lg mix-blend-multiply" 
                        alt="Scan to try on mobile"
                        loading="lazy"
                        width="80"
                        height="80"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1 rounded-full border-2 border-white">
                        <Smartphone size={12} />
                    </div>
                </div>
                <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">Scan to try on device</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">Experience the live demo<br/>on your smartphone instantly.</div>
                </div>
             </div>
          </div>

             {/* Right Phone Mockup */}
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end relative">
             
             {/* App Switcher (Removed in favor of Home Screen) */}
             <div className="flex bg-slate-200 p-1 rounded-full mb-6 relative z-20 shadow-sm opacity-0 pointer-events-none h-0 overflow-hidden">
             </div>

             {/* Glow behind phone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/40 blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />
             
             {/* iPhone Frame */}
             <div className="relative border-slate-900 bg-slate-900 border-[14px] rounded-[3rem] h-[720px] w-[360px] shadow-2xl shadow-emerald-900/20 flex flex-col z-10 transform hover:scale-[1.01] transition-transform duration-500">
                {/* Side Buttons */}
                <div className="absolute -left-[18px] top-[100px] h-[40px] w-[4px] bg-slate-800 rounded-l-md"></div>
                <div className="absolute -left-[18px] top-[160px] h-[70px] w-[4px] bg-slate-800 rounded-l-md"></div>
                <div className="absolute -right-[18px] top-[120px] h-[80px] w-[4px] bg-slate-800 rounded-r-md"></div>

                {/* Inner Bezel/Screen Container */}
                <div className="h-full w-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative">
                    
                    {/* Status Bar */}
                    <div className={`h-10 w-full absolute top-0 z-[60] flex items-center justify-between px-6 text-xs font-bold transition-colors ${activeApp === 'whatsapp' ? 'bg-[#075e54] text-white' : activeApp === 'home' ? 'bg-transparent text-white' : 'bg-transparent text-slate-900'}`}>
                         <span className="pl-2 w-12">9:41</span>
                         <div className="flex items-center gap-1.5 pr-2 w-12 justify-end">
                             <div className={`h-3 w-5 rounded-[4px] ${activeApp === 'whatsapp' || activeApp === 'home' ? 'bg-white' : 'bg-slate-800'}`}></div>
                         </div>
                    </div>
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-[70] shadow-sm"></div>

                    {/* App Content */}
                    <div className="flex-1 overflow-hidden bg-slate-50 font-sans relative">
                        {/* Push Notification Banner */}
                        <div className={`absolute top-10 left-4 right-4 z-[80] transition-all duration-500 ${pushNotification ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'}`}>
                            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20 cursor-pointer" onClick={() => { 
                                setPushNotification(null); 
                                setActiveApp('pharmelo'); 
                                if (pushNotification?.title.includes('Appointment')) {
                                   setPharmeloTab('bookings');
                                } else {
                                   setPharmeloTab('bookings');
                                }
                            }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center">
                                        <Pill size={12} className="text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Pharmelo</span>
                                    <span className="text-[10px] text-slate-400 ml-auto">now</span>
                                </div>
                                <div className="font-bold text-slate-900 text-sm">{pushNotification?.title}</div>
                                <div className="text-xs text-slate-600 line-clamp-2">{pushNotification?.message}</div>
                            </div>
                        </div>

                        {/* Home Screen */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeApp === 'home' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" alt="Wallpaper" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                            </div>
                            <div className="relative z-10 pt-24 px-6 grid grid-cols-4 gap-4">
                                {/* Pharmelo App Icon */}
                                <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('pharmelo')}>
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                            <Pill size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <span className="text-white text-[10px] font-medium drop-shadow-md">Pharmelo</span>
                                </div>

                                {/* WhatsApp App Icon */}
                                <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('whatsapp')}>
                                    <div className="w-14 h-14 bg-[#25D366] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <MessageCircle size={32} className="text-white" fill="currentColor" />
                                    </div>
                                    <span className="text-white text-[10px] font-medium drop-shadow-md">WhatsApp</span>
                                </div>
                            </div>
                        </div>

                        {/* Pharmelo App */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeApp === 'pharmelo' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                           <PharmeloApp sharedBookings={sharedBookings} setSharedBookings={setSharedBookings} sharedRecords={sharedRecords} activeTab={pharmeloTab} setActiveTab={setPharmeloTab} onBack={() => setActiveApp('home')} />
                        </div>
                        
                        {/* WhatsApp App */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${activeApp === 'whatsapp' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                           <WhatsAppApp sharedRecords={sharedRecords} onOrderPlaced={(booking) => {
                              setSharedBookings(prev => [booking, ...prev]);
                              const isDoctor = booking.items[0]?.includes('Appointment');
                              setPushNotification({
                                title: isDoctor ? 'Appointment Confirmed!' : 'Order Confirmed!',
                                message: isDoctor 
                                  ? `Your ${booking.items[0]} is confirmed.`
                                  : `Your prescription order ${booking.id} has been placed successfully.`
                              });
                              setTimeout(() => setPushNotification(null), 5000);
                           }} onRecordAdded={(record) => {
                              setSharedRecords(prev => [record, ...prev]);
                           }} onBack={() => setActiveApp('home')} />
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-black/20 rounded-full z-50 cursor-pointer hover:bg-black/40 transition-colors" onClick={() => setActiveApp('home')}></div>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
};

export default WishlistFeature;
