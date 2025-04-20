const CACHE_NAME = 'local-novel-reader-cache-v10'; // Incremented version
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap' // Updated Google Fonts URL
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

            let relativeUrl = null;
             if (requestUrl.startsWith(scope)) {
                 relativeUrl = requestUrl.substring(scope.length);
                 if (relativeUrl === '') relativeUrl = './';
             }

            const isCoreFile = relativeUrl && urlsToCache.includes(relativeUrl);
            const isGoogleFontAsset = requestUrl.startsWith('https://fonts.gstatic.com') || requestUrl.startsWith('https://fonts.googleapis.com');

            if (isCoreFile || isGoogleFontAsset) {
                 caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    })
                    .catch(cacheError => {
                        console.error("SW: Failed to cache resource:", requestUrl, cacheError);
                    });
            }

            return networkResponse;
          }
        ).catch(error => {
            console.warn('SW Fetch failed; user is likely offline:', event.request.url, error);
        });
      })
  );
});