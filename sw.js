// UPDATE THIS VERSION WHEN YOU CHANGE ANY CACHED FILES
// Cache version incremented to reflect recent file updates
const CACHE_NAME = 'local-novel-reader-cache-v6'; // <--- Updated version here
const urlsToCache = [
  './', // Root Alias
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  // External resources - Ensure this matches index.html
  'https://fonts.googleapis.com/css2?family=Arial&family=Source+Code+Pro&family=Times+New+Roman&display=swap'
  // Add other essential assets like icons if they are separate files
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing new version (v6)...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets:', urlsToCache);
        // Use addAll for atomic caching
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
         // Log error but allow SW install to proceed potentially
         console.error('Service Worker: Cache install failed:', error);
      })
      .then(() => {
          console.log('Service Worker: Skip waiting state.');
          // Force the waiting service worker to become the active service worker.
          return self.skipWaiting();
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating new version (v6)...');
  // List of caches to keep (only the current one)
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name is not in the whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('Service Worker: Claiming clients.');
        // Take control of uncontrolled clients immediately
        return self.clients.claim();
    })
  );
});

// Fetch event: Serve cached assets first, fall back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy: Cache First, then Network. Cache network responses for specified assets.
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // --- 1. Cache Hit ---
        if (cachedResponse) {
          // console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // --- 2. Cache Miss - Fetch from Network ---
        // console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // --- 3. Handle Network Response ---
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                // Don't cache invalid responses
                // console.log('Service Worker: Not caching invalid response:', event.request.url, networkResponse.status);
              return networkResponse;
            }

            // --- 4. Cache the Valid Network Response ---
            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            // Check if the requested URL should be cached
            const requestUrl = event.request.url;
            const scope = self.registration.scope;
            let relativeUrl = requestUrl.startsWith(scope) ? requestUrl.substring(scope.length) : null;
            if (relativeUrl === '') relativeUrl = './'; // Adjust for root relative path '/' mapping to './' in cache list

            // Cache if it's in our initial list OR if it's a Google Font asset (fonts.gstatic.com)
            if ((relativeUrl && urlsToCache.includes(relativeUrl)) || requestUrl.startsWith('https://fonts.gstatic.com')) {
                 // console.log('Service Worker: Caching network response:', event.request.url);
                 caches.open(CACHE_NAME)
                    .then(cache => {
                        // Put the request and its cloned response into the cache
                        cache.put(event.request, responseToCache);
                    });
            } else {
                 // console.log('Service Worker: Not caching:', event.request.url);
            }

            // Return the original network response to the browser
            return networkResponse;
          }
        ).catch(error => {
            // --- 5. Handle Fetch Failure (Network Error) ---
            console.error('Service Worker: Fetch failed; returning offline fallback or error:', event.request.url, error);
            // Optional: Return a generic offline fallback page/response
            // Example: return caches.match('/offline.html');
            // Or just let the browser handle the error (default behavior)
        });
      })
  );
});