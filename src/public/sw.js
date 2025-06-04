// sw.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Workbox loaded`);

  // Precaching file-file dari manifest (build tool harus generate __WB_MANIFEST)
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache Google Fonts
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Cache FontAwesome dan CDN lain
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin.includes('fontawesome') || url.origin === 'https://cdnjs.cloudflare.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'fontawesome',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Cache Avatar API
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://ui-avatars.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'avatars-api',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Cache API non-image pakai NetworkFirst
  workbox.routing.registerRoute(
    ({ request, url }) => {
      const baseUrl = new URL('https://story-api.dicoding.dev/v1');
      return url.origin === baseUrl.origin && request.destination !== 'image';
    },
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Cache API image pakai StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request, url }) => {
      const baseUrl = new URL('https://story-api.dicoding.dev/v1');
      return url.origin === baseUrl.origin && request.destination === 'image';
    },
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-image-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Cache navigasi halaman dengan NetworkFirst, kecuali request untuk file statis seperti .js, .css, dll
  workbox.routing.registerRoute(
    ({ request, url }) => {
      if (request.mode !== 'navigate') return false;

      // Jangan fallback jika path mengandung ekstensi file (misal .js, .css, .png, .json, dll)
      if (url.pathname.match(/\.[^\/]+$/)) {
        return false;
      }

      return true;
    },
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    }),
  );

  // Push notification handler
  self.addEventListener('push', (event) => {
    let data = {
      title: 'Notifikasi',
      body: 'Ada pemberitahuan baru',
      icon: '/src/assets/icon/icon-192.png',
      badge: '/src/assets/icon/icon-192.png',
    };

    if (event.data) {
      try {
        const jsonData = event.data.json();
        data.title = jsonData.title || data.title;
        data.body = jsonData.body || data.body;
      } catch (e) {
        data.body = event.data.text();
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
      }),
    );
  });

  // Catch handler: fallback ke offline.html kalau request navigasi gagal (misal saat offline)
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match('/offline.html');
    }
    return Response.error();
  });

} else {
  console.log(`Workbox gagal dimuat`);
}

console.log('WB_MANIFEST:', self.__WB_MANIFEST);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);