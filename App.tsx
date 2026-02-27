
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import SplashScreen from './components/SplashScreen';
import Seo from './components/Seo';
import { AppProvider } from './context/AppContext';

// Eager Load Critical Pages
import Home from './pages/Home';
import Owners from './pages/Owners';

// Lazy Load Secondary Pages
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ShopOwnerDemoPage = lazy(() => import('./pages/ShopOwnerDemoPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const PartnerForm = lazy(() => import('./pages/PartnerForm'));
const Documentation = lazy(() => import('./pages/Documentation'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Careers = lazy(() => import('./pages/Careers'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Wrapper for pages to inject SEO
const PageWrapper = ({ children, title, desc, keywords }: React.PropsWithChildren<{ title: string, desc: string, keywords?: string }>) => (
    <>
        <Seo title={title} description={desc} keywords={keywords} />
        {children}
    </>
);

const AppContent = () => {
  const location = useLocation();

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
            <Route path="/owners" element={<PageWrapper title="Pharmelo for Pharmacy Owners | Grow Your Business" desc="Partner with Pharmelo to increase sales and streamline operations. The best pharmacy management software and online medicine sales platform for shops in Solan and Himachal." keywords="pharmacy partnership Solan, online medicine sales Himachal, pharmacy management software, medical store business growth"><Owners /></PageWrapper>} />
            <Route path="/wishlist" element={<PageWrapper title="Try Pharmelo Demo | Live App Simulation" desc="Experience the Pharmelo app right now in your browser. No download required."><WishlistPage /></PageWrapper>} />
            <Route path="/shop-demo" element={<PageWrapper title="Pharmelo Partner Dashboard Demo" desc="Interactive demo for pharmacy owners. See how to manage orders and inventory."><ShopOwnerDemoPage /></PageWrapper>} />
            <Route path="/roadmap" element={<PageWrapper title="Pharmelo Roadmap | Solan Pharmacy Launch Timeline" desc="Track our journey transforming healthcare in Himachal. See our launch phases for Solan, Shimla, and beyond." keywords="Pharmelo roadmap, Solan pharmacy launch timeline, Himachal healthcare innovation"><RoadmapPage /></PageWrapper>} />
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
            <Route path="/survey" element={<PageWrapper title="Participate in Survey | Pharmelo" desc="Help us validate the Pharmelo concept. Share your feedback as a patient, doctor, or pharmacist."><SurveyPage /></PageWrapper>} />
            
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
