// Stale-while-revalidate. Bump CACHE on every image change (same number as ?v=).
const CACHE = 'mercury-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const isShell = e.request.mode === 'navigate';
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const cachedCopy = (cached && isShell) ? cached.clone() : null;
    const refresh = (async () => {
      try {
        const fresh = await fetch(e.request);
        if (fresh && fresh.ok) {
          let changed = false;
          if (cachedCopy) {
            const [a, b] = await Promise.all([fresh.clone().text(), cachedCopy.text()]);
            changed = a !== b;
          }
          await cache.put(e.request, fresh.clone());
          if (changed) {
            for (let i = 0; i < 3; i++) {
              const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
              clients.forEach((c) => c.postMessage({ type: 'shell-updated' }));
              await new Promise((r) => setTimeout(r, 400));
            }
          }
        }
        return fresh;
      } catch (err) {
        return null;
      }
    })();
    if (cached) {
      e.waitUntil(refresh);
      return cached;
    }
    const fresh = await refresh;
    if (fresh) return fresh;
    return new Response('offline', { status: 503 });
  })());
});
