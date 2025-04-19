// UPDATE THIS VERSION WHEN YOU CHANGE ANY CACHED FILES
const CACHE_NAME = 'local-novel-reader-cache-v8'; // Incremented version
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  // Updated Google Fonts URL to cache
  'https://fonts.googleapis.com/css2?family=Arial&family=Source+Code+Pro&family=Times+New+Roman&family=Merriweather&family=Noto+Serif&display=swap'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // console.log('SW: Caching core assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
         console.error('SW Cache Install failed:', error);
      })
      .then(() => {
          // Force the waiting service worker to become the active service worker.
          return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the current cache version
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response from cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse; // Don't cache invalid responses
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();
            const requestUrl = event.request.url;
            const scope = self.registration.scope;

            // Determine relative URL for checking against urlsToCache
            let relativeUrl = null;
             if (requestUrl.startsWith(scope)) {
                 relativeUrl = requestUrl.substring(scope.length);
                 if (relativeUrl === '') relativeUrl = './'; // Normalize root path
             }

            // Cache core app files and requested Google Fonts assets (CSS and font files)
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
            // Network request failed, try to serve a fallback?
            // For this app, failing silently might be okay, or return a basic offline indicator.
            console.warn('SW Fetch failed; user is likely offline:', event.request.url, error);
            // Optional: return a custom offline response page
            // return caches.match('/offline.html');
        });
      })
  );
});