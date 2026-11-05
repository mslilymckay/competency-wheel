import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/competency-wheel/',
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
