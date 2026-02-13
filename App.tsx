import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import SplashScreen from './components/SplashScreen';
import { AppProvider } from './context/AppContext';

// Pages
import Home from './pages/Home';
import Owners from './pages/Owners';
import WishlistPage from './pages/WishlistPage';
import FeedbackPage from './pages/FeedbackPage';
import PartnerForm from './pages/PartnerForm';
import Documentation from './pages/Documentation';
import RoadmapPage from './pages/RoadmapPage';
import LegalPage from './pages/LegalPage';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial asset loading / health check
    const timer = setTimeout(() => {
      setIsLoading(false);
      // FORCE REDIRECT: Ensure we always start at Home on reload/open
      // This overrides any previous URL hash like #/admin
      navigate('/'); 
    }, 2200); 

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return <SplashScreen />;
  }

  // Hide Navbar/Footer/CTA on Admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col font-sans animate-fade-in">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/partner-form" element={<PartnerForm />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Catch-all Redirect to Home to prevent 404s or unintended admin access */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyCTA />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;