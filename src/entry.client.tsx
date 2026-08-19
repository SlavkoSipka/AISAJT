import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { ErrorBoundary } from './components/ErrorBoundary';

// Replaces main.tsx under Framework Mode. hydrateRoot(document, ...) hydrates
// the whole document produced by src/root.tsx's Layout — there is no
// #root div to mount into anymore. HelmetProvider/LanguageProvider live in
// root.tsx (shared by prerender + hydration), not here (client-only).
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ErrorBoundary>
        <HydratedRouter />
      </ErrorBoundary>
    </StrictMode>,
  );
});
