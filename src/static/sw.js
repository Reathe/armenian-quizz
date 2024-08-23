//sw.js
const cacheName = "ArmenianCache";
const assets = [
    '/quiz',
    '/aybuben',
    // '/api/posts',
    // '/static/js/app.js',
    '/static/css/styles.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.4.1.slim.min.js",
    '/manifest.json',
    '/static/favicon.ico',
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
    '/static/sounds/Hy-և.mp3',
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
console.log('Hello from sw.js');
self.addEventListener("install", installEvent => {
    console.log('Installing');
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            try {
                cache.addAll(assets).then(r => console.log('assets added to cache'));
            } catch (e) {
                console.log('Error in cache install event:', e);
            }

        })
    )
});

//caching the website itself aka /quiz, /aybuben
//handle redirects from / to /aybuben
self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
});
