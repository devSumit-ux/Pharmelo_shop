import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'es2015', // Support older browsers
    sourcemap: true,  // Enable source maps for debugging
    outDir: 'dist',
  },
});
