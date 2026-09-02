import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ============================================================================
// VITE CONFIGURATION
// Configures Vite development server and React JSX plugin
// ============================================================================
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
