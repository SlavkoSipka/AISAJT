import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ExitIntentPopup } from './components/ui/ExitIntentPopup';

// Lazy load pages for code splitting
const SEOPage = lazy(() => import('./components/pages/SEOPage').then(m => ({ default: m.SEOPage })));
const IzradaSajtaCenaPage = lazy(() => import('./components/pages/IzradaSajtaCenaPage').then(m => ({ default: m.IzradaSajtaCenaPage })));
const WebDizajnPage = lazy(() => import('./components/pages/WebDizajnPage').then(m => ({ default: m.WebDizajnPage })));
const WebShopPage = lazy(() => import('./components/pages/WebShopPage').then(m => ({ default: m.WebShopPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ThankYouPage = lazy(() => import('./components/pages/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const ResourcesPage = lazy(() => import('./components/pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const QuizPage = lazy(() => import('./components/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const AuditFormPage = lazy(() => import('./components/pages/AuditFormPage').then(m => ({ default: m.AuditFormPage })));
const LeadMagnetDownloadPage = lazy(() => import('./components/pages/LeadMagnetDownloadPage').then(m => ({ default: m.LeadMagnetDownloadPage })));
const FunnelPage = lazy(() => import('./components/pages/FunnelPage').then(m => ({ default: m.FunnelPage })));
const BlogHubPage = lazy(() => import('./components/pages/BlogHubPage').then(m => ({ default: m.BlogHubPage })));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const BlogCategoryPage = lazy(() => import('./components/pages/BlogCategoryPage').then(m => ({ default: m.BlogCategoryPage })));
const IzradaSajtaDetaljiPage = lazy(() => import('./components/pages/IzradaSajtaDetaljiPage').then(m => ({ default: m.IzradaSajtaDetaljiPage })));
const SEOOdrzavanjeDetaljiPage = lazy(() => import('./components/pages/SEOOdrzavanjeDetaljiPage').then(m => ({ default: m.SEOOdrzavanjeDetaljiPage })));

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Show loading screen on initial load
  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(minLoadTime);
  }, []);

  // Show loading screen on route change (ne prikazuj loading na thank-you da ne bi dupli Lead)
  useEffect(() => {
    if (location.pathname === '/thank-you') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <ExitIntentPopup />
      <Suspense fallback={<LoadingScreen onLoadComplete={() => {}} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seo-optimizacija-cena" element={<SEOPage />} />
          <Route path="/seo" element={<SEOPage />} /> {/* Redirect old URL */}
          <Route path="/izrada-sajta-cena" element={<IzradaSajtaCenaPage />} />
          <Route path="/izrada-sajta-detalji" element={<IzradaSajtaDetaljiPage />} />
          <Route path="/seo-optimizacija-detalji" element={<SEOOdrzavanjeDetaljiPage />} />
          <Route path="/izrada-web-shopa" element={<WebShopPage />} />
          <Route path="/web-dizajn" element={<WebDizajnPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<FunnelPage />} />
          <Route path="/funnel" element={<FunnelPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/quiz" element={<QuizPage />} />
          <Route path="/resources/audit" element={<AuditFormPage />} />
          <Route path="/resources/guide" element={<LeadMagnetDownloadPage />} />
          <Route path="/resources/checklist" element={<LeadMagnetDownloadPage />} />
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogHubPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/category/:categorySlug" element={<BlogCategoryPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
