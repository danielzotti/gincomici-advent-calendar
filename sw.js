const CACHE_NAME = 'advent-calendar-pwa-v7';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './configuration.html',
  './manifest.json',
  './css/main.css',
  './css/config.css',
  './js/storage.js',
  './js/app.js',
  './js/config.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/brand/gin-comici-logo.png',
    './assets/brand/gin-comici-logo-text.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          cache.add(new Request(asset, { cache: 'no-cache' }))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

async function fetchFresh(request) {
  const response = await fetch(request.url, {
    cache: 'no-cache',
    credentials: 'same-origin'
  });

  if (request.mode === 'navigate' && response.redirected) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetchFresh(event.request)
      .then(async (networkResponse) => {
        if (networkResponse && networkResponse.status >= 500) {
          const cachedFallback = await caches.match(event.request, { ignoreSearch: true });
          if (cachedFallback) {
            return cachedFallback;
          }
          return networkResponse;
        }

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'default')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request, { ignoreSearch: true });
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          const fallbackPage = url.pathname.endsWith('configuration.html')
            ? await caches.match('./configuration.html')
            : await caches.match('./index.html');
          if (fallbackPage) {
            return fallbackPage;
          }
        }

        return new Response('', { status: 503, statusText: 'Offline' });
      })
  );
});
