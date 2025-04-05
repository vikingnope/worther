import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Add proxy configuration for API calls if needed
      // '/api': {
      //   target: 'your-api-url',
      //   changeOrigin: true,
      //   secure: false,
      // }
    },
    headers: {
      // Add headers to allow cross-site cookies
      'Set-Cookie': [
        'SameSite=None; Secure',
      ],
    },
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