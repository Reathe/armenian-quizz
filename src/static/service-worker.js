//service-worker.js
const cacheName = "ArmenianCache-v1";
const assets = [
    '/quiz',
    '/aybuben',
    // '/api/posts',
    // '/static/js/app.js',
    '/static/css/styles.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.4.1.slim.min.js",
    '/static/aybuben512.png',
    '/static/aybuben192.png',
    '/static/aybuben144.png',
    '/static/handwritten/Ա_handwritten.svg',
    '/static/handwritten/Բ_handwritten.svg',
    '/static/handwritten/Գ_handwritten.svg',
    '/static/handwritten/Դ_handwritten.svg',
    '/static/handwritten/Ե_handwritten.svg',
    '/static/handwritten/Զ_handwritten.svg',
    '/static/handwritten/Է_handwritten.svg',
    '/static/handwritten/Ը_handwritten.svg',
    '/static/handwritten/Թ_handwritten.svg',
    '/static/handwritten/Ժ_handwritten.svg',
    '/static/handwritten/Ի_handwritten.svg',
    '/static/handwritten/Լ_handwritten.svg',
    '/static/handwritten/Խ_handwritten.svg',
    '/static/handwritten/Ծ_handwritten.svg',
    '/static/handwritten/Կ_handwritten.svg',
    '/static/handwritten/Հ_handwritten.svg',
    '/static/handwritten/Ձ_handwritten.svg',
    '/static/handwritten/Ղ_handwritten.svg',
    '/static/handwritten/Ճ_handwritten.svg',
    '/static/handwritten/Մ_handwritten.svg',
    '/static/handwritten/Յ_handwritten.svg',
    '/static/handwritten/Ն_handwritten.svg',
    '/static/handwritten/Շ_handwritten.svg',
    '/static/handwritten/Ո_handwritten.svg',
    '/static/handwritten/Չ_handwritten.svg',
    '/static/handwritten/Պ_handwritten.svg',
    '/static/handwritten/Ջ_handwritten.svg',
    '/static/handwritten/Ռ_handwritten.svg',
    '/static/handwritten/Ս_handwritten.svg',
    '/static/handwritten/Վ_handwritten.svg',
    '/static/handwritten/Տ_handwritten.svg',
    '/static/handwritten/Ր_handwritten.svg',
    '/static/handwritten/Ց_handwritten.svg',
    '/static/handwritten/ՈՒ_handwritten.svg',
    '/static/handwritten/Փ_handwritten.svg',
    '/static/handwritten/Ք_handwritten.svg',
    '/static/handwritten/Օ_handwritten.svg',
    '/static/handwritten/Ֆ_handwritten.svg',
    '/static/handwritten/և_handwritten.svg'
];
const assetsMP3 = [
    '/static/sounds/Hy-ա.mp3',
    '/static/sounds/Hy-բ.mp3',
    '/static/sounds/Hy-գ.mp3',
    '/static/sounds/Hy-դ.mp3',
    '/static/sounds/Hy-ե.mp3',
    '/static/sounds/Hy-զ.mp3',
    '/static/sounds/Hy-է.mp3',
    '/static/sounds/Hy-ը.mp3',
    '/static/sounds/Hy-թ.mp3',
    '/static/sounds/Hy-ժ.mp3',
    '/static/sounds/Hy-ի.mp3',
    '/static/sounds/Hy-լ.mp3',
    '/static/sounds/Hy-խ.mp3',
    '/static/sounds/Hy-ծ.mp3',
    '/static/sounds/Hy-կ.mp3',
    '/static/sounds/Hy-հ.mp3',
    '/static/sounds/Hy-ձ.mp3',
    '/static/sounds/Hy-ղ.mp3',
    '/static/sounds/Hy-ճ.mp3',
    '/static/sounds/Hy-մ.mp3',
    '/static/sounds/Hy-յ.mp3',
    '/static/sounds/Hy-ն.mp3',
    '/static/sounds/Hy-շ.mp3',
    '/static/sounds/Hy-ո.mp3',
    '/static/sounds/Hy-չ.mp3',
    '/static/sounds/Hy-պ.mp3',
    '/static/sounds/Hy-ջ.mp3',
    '/static/sounds/Hy-ռ.mp3',
    '/static/sounds/Hy-ս.mp3',
    '/static/sounds/Hy-վ.mp3',
    '/static/sounds/Hy-տ.mp3',
    '/static/sounds/Hy-ր.mp3',
    '/static/sounds/Hy-ց.mp3',
    '/static/sounds/Hy-ու.mp3',
    '/static/sounds/Hy-փ.mp3',
    '/static/sounds/Hy-ք.mp3',
    '/static/sounds/Hy-օ.mp3',
    '/static/sounds/Hy-ֆ.mp3',
    '/static/sounds/Hy-և.mp3'
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
        const cache = await caches.open(cacheName);
        await cache.addAll(assets);
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
