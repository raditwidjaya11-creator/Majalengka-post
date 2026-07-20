// Majalengka Post Service Worker for PWA
const CACHE_VERSION = 'majalengkapost-v2';
const CACHE_NAME_STATIC = `majalengkapost-static-${CACHE_VERSION}`;
const CACHE_NAME_IMAGES = `majalengkapost-images-${CACHE_VERSION}`;
const CACHE_NAME_API = `majalengkapost-api-${CACHE_VERSION}`;
const CACHE_NAME_PAGES = `majalengkapost-pages-${CACHE_VERSION}`;

const ALL_CACHES = [
  CACHE_NAME_STATIC,
  CACHE_NAME_IMAGES,
  CACHE_NAME_API,
  CACHE_NAME_PAGES
];

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png'
];

// 1. Install Event (Pre-cache static assets & skipWaiting)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-caching warning (some assets might be fetched dynamic later):', err);
      });
    })
  );
});

// 2. Activate Event (Claim clients & cleanupOutdatedCaches)
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Delete old caches that do not belong to current version
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!ALL_CACHES.includes(cacheName)) {
              console.log('[SW] Cleaning up outdated cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Helper: Network First with Graceful Fallback
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      const cache = await caches.open(CACHE_NAME_API);
      await cache.put(request, responseToCache);
    }
    return response;
  } catch (err) {
    console.log('[SW] Network failed, looking for offline fallback for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback response for JSON API requests to prevent uncaught error in console
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('json') || request.url.includes('/api/')) {
      return new Response(JSON.stringify({ success: false, error: 'Offline', isOffline: true }), {
        status: 200, // standard JSON response
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default general fallback
    try {
      const rootFallback = await caches.match('/');
      if (rootFallback) return rootFallback;
      const indexFallback = await caches.match('/index.html');
      if (indexFallback) return indexFallback;
    } catch (e) {
      console.warn('[SW] Fallback cache match error:', e);
    }

    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Helper: Cache First with Network Fallback
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      const cache = await caches.open(CACHE_NAME_STATIC);
      await cache.put(request, responseToCache);
    }
    return response;
  } catch (err) {
    console.log('[SW] Static asset fetch failed and not cached:', request.url);
    // Return empty fallback instead of throwing error to keep console green
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('html')) {
      try {
        const rootFallback = await caches.match('/');
        if (rootFallback) return rootFallback;
        const indexFallback = await caches.match('/index.html');
        if (indexFallback) return indexFallback;
      } catch (e) {
        console.warn('[SW] CacheFirst fallback cache match error:', e);
      }
    }
    return new Response('', { status: 404, statusText: 'Not Found' });
  }
}

// Helper: Stale-While-Revalidate for images
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(async networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME_IMAGES);
      await cache.put(request, responseToCache);
    }
    return networkResponse;
  }).catch(err => {
    console.log('[SW] Background image pre-fetch or network failed for:', request.url);
    // Ignore to avoid uncaught promise rejection in console
  });

  return cachedResponse || fetchPromise;
}

// 3. Fetch Event interceptor
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignore non-GET, chrome extensions, etc.
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // A. Navigation/HTML Requests -> Network First fallback to cached page or /index.html
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            const cache = await caches.open(CACHE_NAME_PAGES);
            await cache.put(event.request, responseToCache);
          }
          return response;
        })
        .catch(async () => {
          console.log('[SW] Navigation failed, serving offline page if cached, otherwise general SPA fallback.');
          const cachedPage = await caches.match(event.request);
          if (cachedPage) {
            return cachedPage;
          }
          return (await caches.match('/index.html')) || (await caches.match('/')) || new Response('Offline', {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // B. API & News Data -> Network First
  const isApi = url.pathname.includes('/api/') || url.pathname.includes('/berita-digest') || url.pathname.includes('/valas');
  if (isApi) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // C. Static Assets -> Cache First
  const isStatic =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/fonts/') ||
    url.pathname.includes('lucide') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico');

  if (isStatic) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // D. External images & media -> Stale While Revalidate
  const isImage =
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('images.unsplash.com');

  if (isImage) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // E. Fallback strategy (Fetch with safe catch)
  event.respondWith(
    fetch(event.request).catch(async () => {
      const matched = await caches.match(event.request);
      return matched || new Response('', { status: 404 });
    })
  );
});

// 4. Notification Click Event listener
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window open with this app and focus it
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

