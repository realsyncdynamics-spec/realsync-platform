import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pkg = require('./package.json');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const manifest = require('./manifest.json');
        return { ...manifest, version: pkg.version };
      },
      watchFilePaths: ['package.json', 'manifest.json'],
      additionalInputs: [],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
  },
});
