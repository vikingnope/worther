import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
    }),
    tailwindcss(),
    eslint(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  base: '/', // Changed from './' to '/' for proper absolute paths
  publicDir: 'public', // Explicitly set the public directory
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  assetsInclude: ["**/*.csv", "**/*.md"],
});