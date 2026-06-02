/**
 * Service Worker — Lista del Súper
 * Estrategia: Cache-First para assets estáticos, Network-First para Drive API
 */

const CACHE_NAME   = 'super-lista-v1';
const DRIVE_ORIGIN = 'https://www.googleapis.com';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'
];

/* ── Install: pre-cachear assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: limpiar caches viejos ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: estrategia por tipo de request ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Llamadas a Google Drive API → Network-First (sin caché)
  if (url.origin === DRIVE_ORIGIN) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response(
          JSON.stringify({ error: 'offline' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
    );
    return;
  }

  // Google Fonts → Cache-First
  if (url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Assets locales → Cache-First con fallback a network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback offline: servir index.html para navegación
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

/* ── Background Sync (para cuando vuelva la conexión) ── */
self.addEventListener('sync', event => {
  if (event.tag === 'drive-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client =>
          client.postMessage({ type: 'TRIGGER_SYNC' })
        );
      })
    );
  }
});

/* ── Push Notifications (para futura expansión) ── */
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Lista del Súper', {
      body: data.body || 'Hay cambios en tu lista',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'super-lista-update',
      renotify: true
    })
  );
});
