import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { PortalAuthProvider } from './portal/context/PortalAuthProvider';
import { HomePage } from './components/pages/HomePage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ExitIntentPopup } from './components/ui/ExitIntentPopup';

// Lazy load marketing pages
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

// Lazy load portal pages (separate chunk)
const PortalLoginPage = lazy(() => import('./portal/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const PortalClientDashboard = lazy(() => import('./portal/pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const PortalClientMessages = lazy(() => import('./portal/pages/ClientMessages').then(m => ({ default: m.ClientMessages })));
const PortalClientFiles = lazy(() => import('./portal/pages/ClientFiles').then(m => ({ default: m.ClientFiles })));
const PortalAdminOverview = lazy(() => import('./portal/pages/AdminOverview').then(m => ({ default: m.AdminOverview })));
const PortalAdminProject = lazy(() => import('./portal/pages/AdminProject').then(m => ({ default: m.AdminProject })));
const PortalAdminNewProject = lazy(() => import('./portal/pages/AdminNewProject').then(m => ({ default: m.AdminNewProject })));
const PortalAdminClients = lazy(() => import('./portal/pages/AdminClients').then(m => ({ default: m.AdminClients })));
const PortalAdminNewClient = lazy(() => import('./portal/pages/AdminNewClient').then(m => ({ default: m.AdminNewClient })));

const PortalAuthGuard = lazy(() => import('./portal/guards/AuthGuard').then(m => ({ default: m.AuthGuard })));
const PortalRoleGuard = lazy(() => import('./portal/guards/RoleGuard').then(m => ({ default: m.RoleGuard })));

function PortalRoutesWithAuth() {
  return (
    <PortalAuthProvider>
      <Outlet />
    </PortalAuthProvider>
  );
}

function PortalFallback() {
  return (
    <div className="portal-root flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F7F6F3' }}>
      <div className="w-6 h-6 border-2 border-[#6B4FBB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');

  useEffect(() => {
    if (isPortal) {
      setIsLoading(false);
      return;
    }
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(minLoadTime);
  }, [isPortal]);

  useEffect(() => {
    if (isPortal) {
      setIsLoading(false);
      return;
    }
    if (location.pathname === '/thank-you') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname, isPortal]);

  if (isLoading && !isPortal) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      {!isPortal && <ExitIntentPopup />}
      <Suspense fallback={isPortal ? <PortalFallback /> : <LoadingScreen onLoadComplete={() => {}} />}>
        <Routes>
          {/* Marketing site routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/seo-optimizacija-cena" element={<SEOPage />} />
          <Route path="/seo" element={<SEOPage />} />
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
          <Route path="/blog" element={<BlogHubPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/category/:categorySlug" element={<BlogCategoryPage />} />

          {/* Portal — jedan AuthProvider za sve /portal/* (izbegava dupli useAuth + beskonačan loader na refresh) */}
          <Route path="/portal" element={<PortalRoutesWithAuth />}>
            <Route path="login" element={<PortalLoginPage />} />
            <Route path="dashboard" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="client"><PortalClientDashboard /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="dashboard/poruke" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="client"><PortalClientMessages /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="dashboard/fajlovi" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="client"><PortalClientFiles /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="admin" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="admin"><PortalAdminOverview /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="admin/klijenti" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="admin"><PortalAdminClients /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="admin/klijenti/novi" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="admin"><PortalAdminNewClient /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="admin/projekti/novi" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="admin"><PortalAdminNewProject /></PortalRoleGuard></PortalAuthGuard>
            } />
            <Route path="admin/projekti/:id" element={
              <PortalAuthGuard><PortalRoleGuard requiredRole="admin"><PortalAdminProject /></PortalRoleGuard></PortalAuthGuard>
            } />
          </Route>
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
