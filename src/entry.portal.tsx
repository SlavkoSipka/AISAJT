import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PortalApp } from './portal/PortalApp';
import './index.css';

// Entry for the standalone portal.html shell (Sub-step 2D) — see PortalApp.tsx
// for why /portal/* is mounted client-only outside Framework Mode's own
// hydration pipeline.
const container = document.getElementById('portal-root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ErrorBoundary>
        <PortalApp />
      </ErrorBoundary>
    </StrictMode>
  );
}
