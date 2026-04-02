import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port mora da se poklopi sa netlify.toml [dev] targetPort. Bez ručnog HMR — Netlify proxy + Vite default HMR rade zajedno.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/.netlify/functions': {
        target: 'https://aisajt.com',
        changeOrigin: true,
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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core - must be first to avoid circular deps
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router-vendor';
          }
          // UI libraries
          if (id.includes('lucide-react')) {
            return 'ui-icons';
          }
          if (id.includes('react-hot-toast')) {
            return 'ui-toast';
          }
          // Email
          if (id.includes('@emailjs')) {
            return 'email-vendor';
          }
          // Markdown
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
            return 'markdown-vendor';
          }
          // Helmet
          if (id.includes('react-helmet')) {
            return 'helmet-vendor';
          }
          // GSAP
          if (id.includes('gsap')) {
            return 'gsap-vendor';
          }
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
          // Portal code
          if (id.includes('/portal/')) {
            return 'portal';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@emailjs/browser', 'lucide-react', 'react-hot-toast']
  }
});