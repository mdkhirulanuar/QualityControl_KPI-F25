// service-worker.js
// Provides offline support by caching essential assets and serving them
// when the network is unavailable. This implementation uses a simple
// pre-cache list and dynamically caches other requests on demand. It
// mirrors the behavior of the original InspectWise Go service worker but
// adapts it for the modular structure of this app.

const CACHE_NAME = 'inspectwise-cache-v1';
const PRECACHE_ASSETS = [
  './index.html',
  './offline.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/operatorList.js',
  './js/partsList.js',
  './js/samplingPlan.js',
  './js/sw-register.js',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png'
];

// Install event: pre-cache the application shell
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event: remove old caches
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Claim clients immediately so that the service worker starts controlling pages
  self.clients.claim();
});

// Fetch event: respond from cache or fetch from network with fallback
self.addEventListener('fetch', (evt) => {
  const { request } = evt;
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For navigations (e.g. page loads), attempt network first then offline fallback
  if (request.mode === 'navigate') {
    evt.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => caches.match('./offline.html'))
    );
    return;
  }

  // For other requests, use cache-first strategy with network fallback
  evt.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            // Put a clone of the response in the cache for future use
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            return response;
          })
          .catch(() => {
            // If network fetch fails and asset isn't cached, return offline page for HTML
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('./offline.html');
            }
          })
      );
    })
  );
});