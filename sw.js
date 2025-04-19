// UPDATE THIS VERSION WHEN YOU CHANGE ANY CACHED FILES
const CACHE_NAME = 'local-novel-reader-cache-v9'; // Incremented version
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  // Updated Google Fonts URL to cache (matches index.html)
  'https://fonts.googleapis.com/css2?family=Arial&family=Bitter&family=EB+Garamond&family=Inter&family=Lato&family=Libre+Baskerville&family=Lora&family=Merriweather&family=Noto+Serif&family=Nunito+Sans&family=Open+Sans&family=PT+Serif&family=Roboto&family=Source+Code+Pro&family=Times+New+Roman&display=swap'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // console.log('SW: Caching core assets');
        // Use addAll for atomic caching of essential assets
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
         console.error('SW Cache Install failed:', error);
      })
      .then(() => {
          // Force the waiting service worker to become the active service worker immediately.
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
            return caches.delete(cacheName); // Delete caches not in the whitelist
          }
        })
      );
    }).then(() => {
        // Take control of uncontrolled clients (e.g., pages loaded before activation)
        return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // We only intercept GET requests. Other methods like POST should pass through.
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy: Cache First, then Network for core assets and Google Fonts
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
            // Check if we received a valid response (200 OK)
            // Also check type: 'basic' for same-origin, 'cors' for cross-origin (like Google Fonts)
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse; // Don't cache invalid or non-cacheable responses
            }

            // Clone the response. A response is a stream and can only be consumed once.
            // We need one stream for the browser and one for the cache.
            const responseToCache = networkResponse.clone();
            const requestUrl = event.request.url;
            const scope = self.registration.scope; // The scope under which the SW is registered

            // Determine relative URL for checking against urlsToCache
            let relativeUrl = null;
             if (requestUrl.startsWith(scope)) {
                 relativeUrl = requestUrl.substring(scope.length);
                 if (relativeUrl === '') relativeUrl = './'; // Normalize root path ('/' or '/index.html')
             }

            // Check if the request is for a core file or a Google Fonts asset
            const isCoreFile = relativeUrl && urlsToCache.includes(relativeUrl);
            const isGoogleFontAsset = requestUrl.startsWith('https://fonts.gstatic.com') || requestUrl.startsWith('https://fonts.googleapis.com');

            // Cache the fetched resource if it's a core file or Google Font asset
            if (isCoreFile || isGoogleFontAsset) {
                 caches.open(CACHE_NAME)
                    .then(cache => {
                        // Put the cloned response into the cache
                        cache.put(event.request, responseToCache);
                    })
                    .catch(cacheError => {
                        console.error("SW: Failed to cache resource:", requestUrl, cacheError);
                    });
            }

            // Return the original network response to the browser
            return networkResponse;
          }
        ).catch(error => {
            // Network request failed, likely offline
            console.warn('SW Fetch failed; user is likely offline:', event.request.url, error);
            // Optional: Return a fallback offline page/resource
            // For this app, failing might be acceptable as core assets should be cached.
            // return caches.match('/offline.html');
            // Or just let the browser handle the network error
        });
      })
  );
});