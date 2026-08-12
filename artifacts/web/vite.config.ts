import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PORT and BASE_PATH are required in dev (injected by the workflow),
// but for Vercel builds they are supplied via vercel.json env / build command.
// Use safe defaults so the build never throws on a missing variable.
const port = Number(process.env.PORT ?? '3000');
const basePath = process.env.BASE_PATH ?? '/';

const isProduction = process.env.NODE_ENV === 'production';
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  base: basePath,
  // Firebase's browser API key is public by design, but the workspace secret
  // keeps it out of the repository and injects it into dev/build environments.
  envPrefix: ['VITE_', 'FIREBASE_'],
  plugins: [
    react(),
    tailwindcss(),
    // Replit-specific plugins — never load in production builds
    ...(isProduction
      ? []
      : [
          await import('@replit/vite-plugin-runtime-error-modal').then((m) =>
            m.default(),
          ),
          ...(isReplit
            ? [
                await import('@replit/vite-plugin-cartographer').then((m) =>
                  m.cartographer({
                    root: path.resolve(import.meta.dirname, '..'),
                  }),
                ),
                await import('@replit/vite-plugin-dev-banner').then((m) =>
                  m.devBanner(),
                ),
              ]
            : []),
        ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
