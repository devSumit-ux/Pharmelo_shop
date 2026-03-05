import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'], // Support modern browsers + IE11 if needed (adjust as required)
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // Polyfill async/await for old browsers
    }),
  ],
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
