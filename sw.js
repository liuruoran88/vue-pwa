var filesToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/app.js',
    // '/0.js',
    // '/1.js',
    '/manifest.json'
];
var dataCacheName = 'newsData-v1';
var cacheName = 'newsPWA-final-1';
require('http').globalAgent.maxSockets = Infinity;
require('https').globalAgent.maxSockets = Infinity;

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url);

    if (e.request.url.indexOf('/api/') > -1) {
        e.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch(e.request).then(function (response){
                    cache.put(e.request.url, response.clone());
                    return response;
                }).catch(function (err) {
                    return caches.match(e.request).then(function (response) {
                        return response;
                    });
                });
            })
        );
    }
    else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                  return response || fetch(e.request);
            })
        );
    }
});

