// sw.js — オフライン動作用キャッシュ（単一ファイル構成版）
const CACHE = 'koyomi-v2';
const ASSETS = [
  './', './index.html', './koyomi-all.js', './privacy.html',
  './manifest.webmanifest', './icon.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './img/opening.jpg', './img/bg_spring.jpg', './img/bg_summer.jpg', './img/bg_autumn.jpg', './img/bg_winter.jpg',
];
self.addEventListener('install', (e) => {
  // 一部の画像が無くてもインストールを失敗させない（individual add）
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    await Promise.all(ASSETS.map((a) => c.add(a).catch(() => {})));
    self.skipWaiting();
  }));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      if (resp.ok && new URL(e.request.url).origin === location.origin) {
        const clone = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
