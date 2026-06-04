/**
 * Service Worker — Lista del Súper v3
 * Cache-First para assets locales · Sin caché para Drive API
 */
const CACHE  = 'super-lista-v3';
const ASSETS = ['./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',  e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // APIs de Google → siempre red (nunca cachear tokens ni datos)
  if (url.hostname.endsWith('googleapis.com') ||
      url.hostname.endsWith('accounts.google.com')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(JSON.stringify({error:'offline'}),
        {status:503, headers:{'Content-Type':'application/json'}})
    ));
    return;
  }

  // Google Fonts → Cache-First
  if (url.hostname.includes('fonts.')) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Assets locales → Cache-First con fallback a network
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => e.request.mode === 'navigate'
        ? caches.match('./index.html') : undefined
      );
    })
  );
});
