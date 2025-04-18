// Increment cache version when files change significantly
const CACHE_NAME = 'local-novel-reader-cache-v3';
// Essential files needed for the app shell to work offline
const urlsToCache = [
  '/', // Root path (often serves index.html)
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // Google Fonts CSS (the browser will cache the actual font files separately)
  'https://fonts.googleapis.com/css2?family=Arial&family=Source+Code+Pro&family=Times+New+Roman&family=Garamond&display=swap'
];

// Event: Install
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        // Use addAll for atomic caching of essential assets
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
         console.error('Service Worker: Failed to cache app shell:', error);
         // Optionally, throw the error to fail the installation if caching is critical
         // throw error;
      })
      .then(() => {
          console.log('Service Worker: Install complete.');
          // Force the waiting service worker to become the active service worker.
          // Useful for ensuring updates are applied immediately after install.
          return self.skipWaiting();
      })
  );
});

// Event: Activate
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  // Define the current cache(s) we want to keep
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete caches that are not in the whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('Service Worker: Activation complete, old caches removed.');
        // Take control of uncontrolled clients immediately
        return self.clients.claim();
    })
  );
});

// Event: Fetch
self.addEventListener('fetch', event => {
  // We only handle GET requests for caching
  if (event.request.method !== 'GET') {
    // Let the browser handle non-GET requests normally
    return;
  }

  // Strategy: Cache First, then Network (for app shell and fonts)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // --- Cache Hit ---
        if (cachedResponse) {
          // console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // --- Cache Miss ---
        // console.log('Service Worker: Not in cache, fetching:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
               // Don't cache invalid responses (e.g., 404, 500, opaque responses unless intended)
              console.log('Service Worker: Not caching invalid response:', event.request.url, networkResponse.status);
              return networkResponse;
            }

            // --- Valid Network Response ---
            // Clone the response stream because it can only be consumed once
            const responseToCache = networkResponse.clone();
            const requestUrl = event.request.url;

            // Check if this URL should be cached
            // Cache app shell URLs and Google Fonts resources
            if (urlsToCache.includes(requestUrl) || requestUrl.startsWith('https://fonts.gstatic.com')) {
                 caches.open(CACHE_NAME)
                    .then(cache => {
                        // console.log('Service Worker: Caching new resource:', event.request.url);
                        cache.put(event.request, responseToCache);
                    });
            } else {
                // console.log('Service Worker: Not caching non-essential resource:', event.request.url);
            }

            // Return the original network response to the browser
            return networkResponse;
          }
        ).catch(error => {
            // Network request failed (e.g., offline)
            console.error('Service Worker: Fetch failed; returning offline fallback or error:', event.request.url, error);
            // Optionally: return a generic offline fallback page/response
            // For example: return caches.match('/offline.html');
            // For now, just let the browser handle the fetch error
        });
      })
  );
});