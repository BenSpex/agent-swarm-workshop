/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@systems': path.resolve(__dirname, 'src/systems'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
  test: {
    // Don't double-count tests that worktrees check out — they share files
    // with tests/ on the main branch (Run 11 finding).
    exclude: ['node_modules/**', '.swarm/**', 'dist/**'],
  },
});
