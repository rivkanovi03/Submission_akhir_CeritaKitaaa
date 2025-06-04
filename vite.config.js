import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'), // file offline.html dkk di sini
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['offline.html', 'icon.svg', 'favicon.ico'], // pastikan offline.html disertakan
      manifest: {
        name: 'CertiaKita',
        short_name: 'CertiaKita',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
  urlPattern: /^https:\/\/story-api\.dicoding\.dev\/images\/stories\/.*\.(?:png|jpg|jpeg|webp|gif|blob)/,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'api-image-cache',
    expiration: {
      maxEntries: 60,
      maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
}
        ],
        navigateFallback: '/offline.html', // fallback saat offline
      },
      devOptions: {
        enabled: false, // tetap false agar __WB_MANIFEST tidak error di dev
      },
    }),
  ],
});
