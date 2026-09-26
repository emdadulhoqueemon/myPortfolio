// Service worker for the Emdadul Hoque Emon portfolio PWA.
//
// Strategy:
//   - App shell is precached on install so an installed app opens offline.
//   - Navigations (the HTML document) are network-first, so a new deploy is
//     picked up on the next load instead of being frozen behind the cache.
//   - Same-origin static assets are cache-first, with the network response
//     written back into the cache so the versioned asset URLs are covered too.
//   - Everything else (non-GET, cross-origin) is left alone.

const CACHE_NAME = 'emon-portfolio-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html', '/styles.css', '/app.js']);
    })
  );
});

// Drop caches from earlier versions so a future CACHE_NAME bump can actually
// replace the stored shell. Without this, cache-first would keep serving the
// very first version forever.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const request = e.request;

  // Only same-origin GETs are cacheable. This also keeps the contact form's
  // POST to script.google.com on Apps Script out of the cache entirely — a
  // responded-to POST would never reach the spreadsheet.
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network-first for page loads: prefer fresh HTML, fall back to the cached
  // shell when offline.
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first for static assets, backfilling the cache on a miss. Note that
  // index.html requests assets with a ?v= cache-buster, so the precached
  // '/styles.css' and '/app.js' entries alone would never match — the backfill
  // is what makes those files available offline.
  e.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      });
    })
  );
});
