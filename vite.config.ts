import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Fix for Babylon.js in Vite
    global: 'globalThis',
  },
  server: {
    port: 3000,
  },
});