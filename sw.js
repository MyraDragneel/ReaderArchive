// UPDATE THIS VERSION WHEN YOU CHANGE ANY CACHED FILES
const CACHE_NAME = 'local-novel-reader-cache-v7'; // Updated version
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Arial&family=Source+Code+Pro&family=Times+New+Roman&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
         console.error('SW Cache Install failed:', error);
      })
      .then(() => {
          return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            const requestUrl = event.request.url;
            const scope = self.registration.scope;
            let relativeUrl = requestUrl.startsWith(scope) ? requestUrl.substring(scope.length) : null;
            if (relativeUrl === '') relativeUrl = './';

            // Cache core files and Google Fonts assets
            if ((relativeUrl && urlsToCache.includes(relativeUrl)) || requestUrl.startsWith('https://fonts.gstatic.com')) {
                 caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
            }
            return networkResponse;
          }
        ).catch(error => {
            console.error('SW Fetch failed:', event.request.url, error);
            // Optionally return offline fallback page here
        });
      })
  );
});