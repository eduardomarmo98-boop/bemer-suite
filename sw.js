/* Desliga o service worker do BeMer antigo (28/09/2026). A suíte não usa sw na raiz. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k))))
    .then(() => self.registration.unregister())));
