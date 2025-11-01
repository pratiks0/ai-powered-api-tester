import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-query',
      '@headlessui/react',
      '@heroicons/react',
      'axios',
      'react-json-view'
    ],
    force: true
  }
});