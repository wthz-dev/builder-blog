/* Basic service worker for WhiteBikeVibes */
const CACHE_NAME = 'wbv-cache-v2';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = ['/', OFFLINE_URL, '/favicon.ico', '/manifest.webmanifest'];

// Minimal IndexedDB helpers for background sync queue
const DB_NAME = 'wbv-bg-sync';
const STORE = 'commentQueue';
function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbAdd(record) {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  }));
}
function idbGetAll() {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}
function idbClear() {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      // Prefetch recent posts HTML to improve offline UX
      try {
        const res = await fetch('/api/posts?page=1');
        const data = await res.json();
        const posts = (data && data.posts) || [];
        const urls = posts.slice(0, 10).map(p => `/post/${encodeURIComponent(p.slug)}`);
        await Promise.all(urls.map(u => cache.add(u).catch(() => {})));
      } catch {}
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null))).then(() => self.clients.claim())
  );
});

// Network-first for HTML navigations, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET requests
  if (new URL(req.url).origin !== self.location.origin) return;

  // Background sync for comment POSTs
  if (req.method === 'POST' && new URL(req.url).pathname === '/api/comments') {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          return await fetch(req.clone());
        } catch (err) {
          // Queue for background sync
          const body = await req.clone().text();
          await idbAdd({ url: req.url, body, headers: Array.from(req.headers.entries()) });
          if ('sync' in self.registration) {
            try { await self.registration.sync.register('sync-comments'); } catch {}
          }
          return new Response(JSON.stringify({ queued: true, offline: true }), { headers: { 'Content-Type': 'application/json' }, status: 202 });
        }
      })()
    );
    return;
  }

  // HTML navigation requests
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  // for assets: images, css, js
  if (['image', 'style', 'script', 'font'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        });
      })
    );
    return;
  }
});

// Replay queued comment POSTs when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil((async () => {
      try {
        const items = await idbGetAll();
        for (const item of items) {
          const headers = new Headers(item.headers || []);
          headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
          try {
            await fetch(item.url, { method: 'POST', body: item.body, headers, credentials: 'include' });
          } catch {}
        }
        await idbClear();
        const clients = await self.clients.matchAll();
        for (const client of clients) client.postMessage({ type: 'comments-synced' });
      } catch {}
    })());
  }
});
