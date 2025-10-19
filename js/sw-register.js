// sw-register.js
// Registers the service worker for offline support and updates.

// The service worker will intercept network requests and serve cached assets
// when available, enabling the app to function offline or on flaky networks.

// Register the service worker only when running over HTTP(S). Service
// workers cannot be registered from file:// URLs, so check the protocol
// first. This prevents errors when the app is opened locally without
// a server.
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        console.log('Service worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}