import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { PortalAuthProvider } from './context/PortalAuthProvider';

const PortalLoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const PortalClientDashboard = lazy(() => import('./pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const PortalClientMessages = lazy(() => import('./pages/ClientMessages').then(m => ({ default: m.ClientMessages })));
const PortalClientFiles = lazy(() => import('./pages/ClientFiles').then(m => ({ default: m.ClientFiles })));
const PortalAdminOverview = lazy(() => import('./pages/AdminOverview').then(m => ({ default: m.AdminOverview })));
const PortalAdminProject = lazy(() => import('./pages/AdminProject').then(m => ({ default: m.AdminProject })));
const PortalAdminNewProject = lazy(() => import('./pages/AdminNewProject').then(m => ({ default: m.AdminNewProject })));
const PortalAdminClients = lazy(() => import('./pages/AdminClients').then(m => ({ default: m.AdminClients })));
const PortalAdminNewClient = lazy(() => import('./pages/AdminNewClient').then(m => ({ default: m.AdminNewClient })));
const PortalAdminMessages = lazy(() => import('./pages/AdminMessages').then(m => ({ default: m.AdminMessages })));

const PortalAuthGuard = lazy(() => import('./guards/AuthGuard').then(m => ({ default: m.AuthGuard })));
const PortalRoleGuard = lazy(() => import('./guards/RoleGuard').then(m => ({ default: m.RoleGuard })));
const PortalLayout = lazy(() => import('./components/layout/PortalLayout').then(m => ({ default: m.PortalLayout })));

// SEO panel
const SeoClientDashboard = lazy(() => import('./pages/SeoClientDashboard').then(m => ({ default: m.SeoClientDashboard })));
const SeoAdminOverview = lazy(() => import('./pages/SeoAdminOverview').then(m => ({ default: m.SeoAdminOverview })));
const SeoAdminProject = lazy(() => import('./pages/SeoAdminProject').then(m => ({ default: m.SeoAdminProject })));
const SeoAdminPreview = lazy(() => import('./pages/SeoAdminPreview').then(m => ({ default: m.SeoAdminPreview })));
const SeoAdminNewSeoProject = lazy(() => import('./pages/SeoAdminNewSeoProject').then(m => ({ default: m.SeoAdminNewSeoProject })));
const SeoPublicReport = lazy(() => import('./pages/SeoPublicReport').then(m => ({ default: m.SeoPublicReport })));
const SeoReportPage = lazy(() => import('./pages/SeoReportPage').then(m => ({ default: m.SeoReportPage })));

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

/**
 * Standalone client-only portal app (Sub-step 2D). /portal/* is auth-gated,
 * never SEO-relevant (robots.txt already disallows it) and never prerendered
 * — under Framework Mode's ssr:true there is no live Node server on the
 * static Vercel deployment to server-render it on demand, so it is mounted
 * here exactly like the pre-migration site was: a plain client-side
 * BrowserRouter, entered via a dedicated static shell (portal.html) that
 * Vercel rewrites all /portal/* requests to. See PHASE_2D_REPORT.md.
 *
 * This is the same route tree previously nested inside App.tsx's AppContent
 * (now removed — its marketing-routing scaffold was fully superseded by
 * Sub-steps 2B/2C's real route modules). isLoading/ExitIntentPopup/
 * LoadingScreen from the old AppContent never activated for /portal/* paths
 * (isPortal always short-circuited them), so nothing behavioral is lost by
 * not carrying them over.
 */
export function PortalApp() {
  return (
    <Router>
      <Suspense fallback={<PortalFallback />}>
        <Routes>
          <Route path="/portal/izvestaj/:token" element={<SeoPublicReport />} />
          <Route path="/portal" element={<PortalRoutesWithAuth />}>
            <Route path="login" element={<PortalLoginPage />} />

            {/* All authenticated pages share sidebar layout (sidebar stays persistent across tab switches) */}
            <Route element={<PortalAuthGuard><PortalLayout /></PortalAuthGuard>}>
              <Route path="dashboard" element={
                <PortalRoleGuard requiredRole="client"><PortalClientDashboard /></PortalRoleGuard>
              } />
              <Route path="dashboard/poruke" element={
                <PortalRoleGuard requiredRole="client"><PortalClientMessages /></PortalRoleGuard>
              } />
              <Route path="dashboard/fajlovi" element={
                <PortalRoleGuard requiredRole="client"><PortalClientFiles /></PortalRoleGuard>
              } />
              <Route path="admin" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminOverview /></PortalRoleGuard>
              } />
              <Route path="admin/poruke" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminMessages /></PortalRoleGuard>
              } />
              <Route path="admin/klijenti" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminClients /></PortalRoleGuard>
              } />
              <Route path="admin/klijenti/novi" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminNewClient /></PortalRoleGuard>
              } />
              <Route path="admin/projekti/novi" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminNewProject /></PortalRoleGuard>
              } />
              <Route path="admin/projekti/:id" element={
                <PortalRoleGuard requiredRole="admin"><PortalAdminProject /></PortalRoleGuard>
              } />

              {/* SEO panel — client */}
              <Route path="seo" element={
                <PortalRoleGuard requiredRole="client"><SeoClientDashboard /></PortalRoleGuard>
              } />

              {/* SEO panel — admin */}
              <Route path="admin/seo" element={
                <PortalRoleGuard requiredRole="admin"><SeoAdminOverview /></PortalRoleGuard>
              } />
              <Route path="admin/seo/novi" element={
                <PortalRoleGuard requiredRole="admin"><SeoAdminNewSeoProject /></PortalRoleGuard>
              } />
              <Route path="admin/seo/:id" element={
                <PortalRoleGuard requiredRole="admin"><SeoAdminProject /></PortalRoleGuard>
              } />
              <Route path="admin/seo/:id/preview" element={
                <PortalRoleGuard requiredRole="admin"><SeoAdminPreview /></PortalRoleGuard>
              } />
              <Route path="admin/seo/:id/report" element={
                <PortalRoleGuard requiredRole="admin"><SeoReportPage /></PortalRoleGuard>
              } />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
