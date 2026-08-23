const CACHE_NAME = 'atelier-app-v3';

const cacheAppShell = async () => {
  const cache = await caches.open(CACHE_NAME);
  const indexResponse = await fetch('/index.html');
  await cache.put('/index.html', indexResponse.clone());
  await cache.put('/', indexResponse.clone());

  const pendingUrls = ['/manifest.json'];
  const html = await indexResponse.text();
  const htmlAssets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1]);
  pendingUrls.push(...htmlAssets);

  const cachedUrls = new Set();
  while (pendingUrls.length > 0) {
    const assetUrl = pendingUrls.shift();
    const absoluteUrl = new URL(assetUrl, self.location.origin);
    if (absoluteUrl.origin !== self.location.origin || cachedUrls.has(absoluteUrl.href)) continue;
    cachedUrls.add(absoluteUrl.href);

    const response = await fetch(absoluteUrl.href);
    if (!response.ok) continue;
    await cache.put(absoluteUrl.href, response.clone());

    if (absoluteUrl.pathname.endsWith('.js')) {
      const script = await response.text();
      const moduleAssets = [...script.matchAll(/import\(["']([^"']+)["']\)/g)].map((match) => match[1]);
      pendingUrls.push(...moduleAssets.map((moduleUrl) => new URL(moduleUrl, absoluteUrl).href));
    }
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheAppShell().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cachedResponse) => cachedResponse || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        }
        return response;
      });
    })
  );
});