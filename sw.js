// No app cache. Every page, script, image and /api response goes to the network so edits made at
// /dashboard show up the next time the home-screen app is opened — no reinstall needed.
// Only the two Arcadia fonts are cached (their URLs carry ?v=, so a font change still means a bump).
const CACHE = 'mercury-fonts-v7';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));   // drops the old mercury-v* caches
  await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (!url.pathname.endsWith('.woff2')) return;        // default network fetch, no SW cache
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request);
    if (hit) return hit;
    const fresh = await fetch(e.request);
    if (fresh && fresh.ok) cache.put(e.request, fresh.clone());
    return fresh;
  })());
});
