import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage';
import { SEOPage } from './components/pages/SEOPage';
import { WebDizajnPage } from './components/pages/WebDizajnPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { ContactPage } from './components/pages/ContactPage';
import { ThankYouPage } from './components/pages/ThankYouPage';
import { ResourcesPage } from './components/pages/ResourcesPage';
import { QuizPage } from './components/pages/QuizPage';
import { AuditFormPage } from './components/pages/AuditFormPage';
import { LeadMagnetDownloadPage } from './components/pages/LeadMagnetDownloadPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ExitIntentPopup } from './components/ui/ExitIntentPopup';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Show loading screen on initial load
  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(minLoadTime);
  }, []);

  // Show loading screen on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <ExitIntentPopup />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/seo" element={<SEOPage />} />
        <Route path="/web-dizajn" element={<WebDizajnPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/quiz" element={<QuizPage />} />
        <Route path="/resources/audit" element={<AuditFormPage />} />
        <Route path="/resources/guide" element={<LeadMagnetDownloadPage />} />
        <Route path="/resources/checklist" element={<LeadMagnetDownloadPage />} />
      </Routes>
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
