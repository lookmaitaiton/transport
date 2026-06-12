const CACHE_NAME = 'lookmai-cache-v1';
const urlsToCache = [
    'https://lookmaitaiton.github.io/transport/logo.png',
    'https://lookmaitaiton.github.io/transport/icon.jpg'
];

self.addEventListener('install', (e) => { 
    self.skipWaiting(); 
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', (e) => { 
    e.waitUntil(self.clients.claim()); 
});

self.addEventListener('fetch', (e) => { 
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        }).catch(() => {
            console.log("Offline mode triggered");
        })
    );
});
