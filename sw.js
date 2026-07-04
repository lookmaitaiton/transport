const CACHE_NAME = 'lookmai-cache-v2'; // เมื่อไหร่ที่มีการแก้โค้ดเว็บ ให้มาเปลี่ยนเลข v2, v3, v4 ไปเรื่อยๆ
const urlsToCache = [
    './', // ⭐️ สำคัญมาก: แคชหน้า HTML ตัวมันเองเพื่อให้เปิดเว็บตอนออฟไลน์ได้
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
    
    // ⭐️ ล้าง Cache เก่าทิ้ง เมื่อมีการอัปเดตเลข CACHE_NAME
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('ล้าง Cache เก่า:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => { 
    // ⭐️ ปล่อยผ่านลิงก์ของ Google Apps Script ไม่ต้องเอามาลง Cache (ป้องกันระบบข้อมูลรวน)
    if (e.request.url.includes('script.google.com')) {
        return; 
    }

    e.respondWith(
        caches.match(e.request).then((response) => {
            // ถ้ามีไฟล์ใน Cache ให้ดึงมาใช้ ถ้าไม่มีให้ไปโหลดจากเน็ต (fetch)
            return response || fetch(e.request);
        }).catch(() => {
            // ทำงานเมื่อไม่มีเน็ตและหาไฟล์ใน Cache ไม่เจอ
            console.log("Offline mode triggered for:", e.request.url);
        })
    );
});
