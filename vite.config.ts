import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'oge-monologue': resolve(__dirname, 'oge-monologue.html'),
        'speak-practice': resolve(__dirname, 'speak-practice.html'),
      },
    },
  },
});
