import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works whether served from a domain root or a
// GitHub Pages project subpath (e.g. /Newtab/).
export default defineConfig({
  base: './',
  plugins: [react()],
});
