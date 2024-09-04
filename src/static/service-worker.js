//service-worker.js
const cacheName = "ArmenianCache-v1";
const assets = [
    '/quiz',
    '/get_alphabet',
    '/aybuben',
    '/static/css/styles.css',
    '/static/js/aybuben.js',
    '/static/js/utils.js',
    '/static/js/quiz.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.4.1.slim.min.js",
    '/static/aybuben512.png',
    '/static/aybuben192.png',
    '/static/aybuben144.png',
];


function stripRangeHeader(request) {
    if (request.headers.has('range')) {
        const newRequest = new Request(request.url);
        newRequest.headers.delete('range');
        return newRequest;
    }
    return request;
}

function getResponseFromPartial(response) {
    //handle partial content
    console.log('Partial content');
    const blob = response.blob();
    const range = response.headers.get('content-range');
    const contentLength = range.split('/')[1];
    const headers = new Headers({
        'Content-Type': 'audio/mpeg',
        'Content-Length': contentLength
    });
    return new Response(blob, {status: 200, headers});
}

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(async function () {
        console.log('Installing service worker...');
        //get alphabet from server as json
        const response = await fetch('/get_alphabet');
        const alphabet = await response.json();
        const assetsHandwritten = alphabet["handwritten"];
        const assetsMP3 = alphabet["pronunciation"];

        const cache = await caches.open(cacheName);
        await cache.addAll(assets);
        await cache.addAll(assetsHandwritten);
        for (let i = 0; i < assetsMP3.length; i++) {
            let response = await fetch(assetsMP3[i]);
            if (response.status === 206) {
                response = getResponseFromPartial(response);
            } else if (response.status !== 200) {
                console.log('Error fetching asset: ', assetsMP3[i]);
                continue;
            }
            await cache.put(assetsMP3[i], response);
        }
        console.log('All assets added to cache ', cacheName);
        console.log('Service worker installed');
        await self.skipWaiting();
    }());
})


self.addEventListener('activate', function (event) {
    // Caches not to be deleted
    const cacheWhitelist = [cacheName];
    event.waitUntil(async function () {
        const keys = await caches.keys();
        await Promise.all(keys.map(function (key) {
            if (cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key);
            }
        }));
        console.log('Clients claims.');
        await self.clients.claim();
    }());
});

self.addEventListener("fetch", fetchEvent => {
    //ignore POST requests
    if (fetchEvent.request.method !== 'GET') {
        return;
    }

    fetchEvent.respondWith(async function () {
        let req = fetchEvent.request;
        if (fetchEvent.request.url.endsWith('.mp3')) {
            // if the request has the Range header, it means it's a partial request
            // so we recreate the request without the Range header
            req = stripRangeHeader(fetchEvent.request);
        }
        const cachedResponse = await caches.match(req);
        if (cachedResponse)
            return cachedResponse;

        const fetchResponse = await fetch(req);
        const clonedResponse = await fetchResponse.clone();
        fetchEvent.waitUntil(async function () {
            const cache = await caches.open(cacheName);
            try {
                await cache.put(fetchEvent.request, clonedResponse);
            } catch (error) {
                console.error("Error caching response: ", error);
            }
        }());
        return fetchResponse;
    }());
});
