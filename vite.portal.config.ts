import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Separate, plain-Vite build for portal.html (Sub-step 2D) — deliberately NOT
// using @react-router/dev's reactRouter() plugin, which owns entry
// resolution (root.tsx/entry.client.tsx) whenever it's present in a Vite
// config and can't cleanly coexist with an extra arbitrary HTML entry point.
// Runs as a second step in `npm run build`, after `react-router build` has
// already populated dist/client — emptyOutDir:false so it doesn't wipe that
// output; content-hashed filenames mean its assets can't collide with the
// react-router build's.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: false,
    rollupOptions: {
      input: 'portal.html',
    },
  },
});
