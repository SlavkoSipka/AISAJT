import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Za lokalni dev koristi: vercel dev (serviRA i frontend i /api/ funkcije)
      '/.netlify/functions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '/api'),
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Sub-step 2A: the previous manualChunks function grouped anything
    // matching `id.includes('react-router')` into a "router-vendor" chunk.
    // Under Framework Mode, @react-router/dev generates internal virtual
    // modules whose ids match that same substring — the old rule swept them
    // into router-vendor too and corrupted the framework's own route-module
    // wiring (root/catchall route components resolved as undefined at
    // render time). Removed for now; revisit chunk-splitting once
    // Framework Mode is fully migrated (Phase 7 performance work).
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@emailjs/browser', 'lucide-react', 'react-hot-toast']
  }
});