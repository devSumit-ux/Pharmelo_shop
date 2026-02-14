
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import SplashScreen from './components/SplashScreen';
import Seo from './components/Seo';
import { AppProvider } from './context/AppContext';

// HELPER: Retry Lazy Imports
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error: any) {
      console.error("Lazy load failed:", error);
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return new Promise(() => {}); 
      }
      throw error;
    }
  });
};

// Lazy Load Pages
const Home = lazyWithRetry(() => import('./pages/Home'));
const Owners = lazyWithRetry(() => import('./pages/Owners'));
const WishlistPage = lazyWithRetry(() => import('./pages/WishlistPage'));
const ShopOwnerDemoPage = lazyWithRetry(() => import('./pages/ShopOwnerDemoPage'));
const FeedbackPage = lazyWithRetry(() => import('./pages/FeedbackPage'));
const PartnerForm = lazyWithRetry(() => import('./pages/PartnerForm'));
const Documentation = lazyWithRetry(() => import('./pages/Documentation'));
const RoadmapPage = lazyWithRetry(() => import('./pages/RoadmapPage'));
const LegalPage = lazyWithRetry(() => import('./pages/LegalPage'));
const AboutUs = lazyWithRetry(() => import('./pages/AboutUs'));
const Careers = lazyWithRetry(() => import('./pages/Careers'));
const AdminLogin = lazyWithRetry(() => import('./pages/AdminLogin'));
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'));

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

  useEffect(() => {
    // Simulate initial asset loading / health check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Hide Navbar/Footer/CTA on Admin routes AND Shop Demo route
  const isFullScreenRoute = location.pathname.startsWith('/admin') || location.pathname === '/shop-demo';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col font-sans animate-fade-in">
      <ScrollToTop />
      {!isFullScreenRoute && <Navbar />}
      
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<PageWrapper title="Pharmelo | #1 Instant Pharmacy in Solan" desc="Order medicine online in Solan. Skip the line at local pharmacies."><Home /></PageWrapper>} />
            <Route path="/owners" element={<PageWrapper title="Pharmelo for Pharmacy Owners | Grow Your Business" desc="Join the Pharmelo network. Get more customers, manage inventory, and reduce counter wait times."><Owners /></PageWrapper>} />
            <Route path="/wishlist" element={<PageWrapper title="Try Pharmelo Demo | Live App Simulation" desc="Experience the Pharmelo app right now in your browser. No download required."><WishlistPage /></PageWrapper>} />
            <Route path="/shop-demo" element={<PageWrapper title="Pharmelo Partner Dashboard Demo" desc="Interactive demo for pharmacy owners. See how to manage orders and inventory."><ShopOwnerDemoPage /></PageWrapper>} />
            <Route path="/roadmap" element={<PageWrapper title="Pharmelo Roadmap | Solan Launch Timeline" desc="See our journey from Solan to Himachal. Upcoming features and city launches."><RoadmapPage /></PageWrapper>} />
            <Route path="/feedback" element={<PageWrapper title="Community Feedback | Pharmelo" desc="Help us build the best pharmacy app. Share your suggestions and vote on features."><FeedbackPage /></PageWrapper>} />
            <Route path="/partner-form" element={<PageWrapper title="Apply to be a Partner | Pharmelo" desc="Pharmacy registration form. Join Solan's fastest growing medical network."><PartnerForm /></PageWrapper>} />
            <Route path="/documentation" element={<PageWrapper title="Partner Documentation | Pharmelo" desc="Technical guides and onboarding manuals for pharmacy partners."><Documentation /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper title="Terms of Service | Pharmelo" desc="Legal terms and conditions for using the Pharmelo platform."><LegalPage type="terms" /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper title="Privacy Policy | Pharmelo" desc="How we protect your health data and personal information."><LegalPage type="privacy" /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper title="About Us | The Pharmelo Story" desc="Founded by students at Shoolini University to solve the pharmacy queue problem."><AboutUs /></PageWrapper>} />
            <Route path="/careers" element={<PageWrapper title="Careers at Pharmelo | Join the Team" desc="We are hiring interns and developers in Solan. Help us digitize healthcare."><Careers /></PageWrapper>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PageWrapper title="Admin Login | Pharmelo" desc="Restricted access."><AdminLogin /></PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper title="Admin Dashboard | Pharmelo" desc="Restricted access."><AdminDashboard /></PageWrapper>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
      </Router>
    </AppProvider>
  );
}

export default App;
