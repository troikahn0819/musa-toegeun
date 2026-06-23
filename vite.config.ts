/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Node provides `process` at config-eval time; declared locally to avoid a
// hard dependency on @types/node just for one env var lookup.
declare const process: { env: Record<string, string | undefined> };

export default defineConfig(({ mode }) => ({
  root: 'frontend',
  envDir: '..',
  // Vercel serves at the domain root, so use '/'. GitHub Pages serves under
  // /musa-toegeun/, so keep that base for non-Vercel production builds.
  base: process.env.VERCEL ? '/' : mode === 'production' ? '/musa-toegeun/' : '/',
  server: {
    // Honor the PORT env var (e.g. when the preview launcher assigns a free
    // port); fall back to Vite's default for normal local dev.
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
