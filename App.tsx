import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import SplashScreen from './components/SplashScreen';
import Seo from './components/Seo';
import { AppProvider } from './context/AppContext';

// Pages
import Home from './pages/Home';
import Owners from './pages/Owners';
import WishlistPage from './pages/WishlistPage';
import ShopOwnerDemoPage from './pages/ShopOwnerDemoPage'; // Import new page
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

// Wrapper for pages to inject SEO
const PageWrapper = ({ children, title, desc }: React.PropsWithChildren<{ title: string, desc: string }>) => (
    <>
        <Seo title={title} description={desc} />
        {children}
    </>
);

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

  // Hide Navbar/Footer/CTA on Admin routes AND Shop Demo route (it has its own UI)
  const isFullScreenRoute = location.pathname.startsWith('/admin') || location.pathname === '/shop-demo';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col font-sans animate-fade-in">
      <ScrollToTop />
      {!isFullScreenRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
             <PageWrapper title="Pharmelo | #1 Instant Pharmacy in Solan" desc="Order medicine online in Solan. Skip the line at local pharmacies.">
                <Home />
             </PageWrapper>
          } />
          <Route path="/owners" element={
             <PageWrapper title="Pharmelo for Pharmacy Owners | Grow Your Business" desc="Join the Pharmelo network. Get more customers, manage inventory, and reduce counter wait times.">
                <Owners />
             </PageWrapper>
          } />
          <Route path="/wishlist" element={
             <PageWrapper title="Try Pharmelo Demo | Live App Simulation" desc="Experience the Pharmelo app right now in your browser. No download required.">
                <WishlistPage />
             </PageWrapper>
          } />
          <Route path="/shop-demo" element={
             <PageWrapper title="Pharmelo Partner Dashboard Demo" desc="Interactive demo for pharmacy owners. See how to manage orders and inventory.">
                <ShopOwnerDemoPage />
             </PageWrapper>
          } /> 
          <Route path="/roadmap" element={
             <PageWrapper title="Pharmelo Roadmap | Solan Launch Timeline" desc="See our journey from Solan to Himachal. Upcoming features and city launches.">
                <RoadmapPage />
             </PageWrapper>
          } />
          <Route path="/feedback" element={
             <PageWrapper title="Community Feedback | Pharmelo" desc="Help us build the best pharmacy app. Share your suggestions and vote on features.">
                <FeedbackPage />
             </PageWrapper>
          } />
          <Route path="/partner-form" element={
             <PageWrapper title="Apply to be a Partner | Pharmelo" desc="Pharmacy registration form. Join Solan's fastest growing medical network.">
                <PartnerForm />
             </PageWrapper>
          } />
          <Route path="/documentation" element={
             <PageWrapper title="Partner Documentation | Pharmelo" desc="Technical guides and onboarding manuals for pharmacy partners.">
                <Documentation />
             </PageWrapper>
          } />
          <Route path="/terms" element={
             <PageWrapper title="Terms of Service | Pharmelo" desc="Legal terms and conditions for using the Pharmelo platform.">
                <LegalPage type="terms" />
             </PageWrapper>
          } />
          <Route path="/privacy" element={
             <PageWrapper title="Privacy Policy | Pharmelo" desc="How we protect your health data and personal information.">
                <LegalPage type="privacy" />
             </PageWrapper>
          } />
          <Route path="/about" element={
             <PageWrapper title="About Us | The Pharmelo Story" desc="Founded by students at Shoolini University to solve the pharmacy queue problem.">
                <AboutUs />
             </PageWrapper>
          } />
          <Route path="/careers" element={
             <PageWrapper title="Careers at Pharmelo | Join the Team" desc="We are hiring interns and developers in Solan. Help us digitize healthcare.">
                <Careers />
             </PageWrapper>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
             <PageWrapper title="Admin Login | Pharmelo" desc="Restricted access for Pharmelo administrators.">
                <AdminLogin />
             </PageWrapper>
          } />
          <Route path="/admin/dashboard" element={
             <PageWrapper title="Admin Dashboard | Pharmelo" desc="Restricted access.">
                <AdminDashboard />
             </PageWrapper>
          } />
          
          {/* Catch-all Redirect to Home to prevent 404s or unintended admin access */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isFullScreenRoute && <Footer />}
      {!isFullScreenRoute && <StickyCTA />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
        <Analytics />
      </Router>
    </AppProvider>
  );
}

export default App;