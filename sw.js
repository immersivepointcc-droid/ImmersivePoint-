const CACHE_NAME = 'imagination-spark-xr-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/riasec-engine.js',
  '/js/vignettes.js',
  '/js/vignettes-industrial.js',
  '/js/vignettes-professional.js',
  '/js/passport.js',
  '/styles.css',
  'https://aframe.io/releases/1.6.0/aframe.min.js',
  'https://unpkg.com/aframe-environment-component@1.3.3/dist/aframe-environment-component.min.js',
  'https://unpkg.com/aframe-particle-system-component@1.1.3/dist/aframe-particle-system-component.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
