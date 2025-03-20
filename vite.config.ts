import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'single-spa', 'single-spa-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
