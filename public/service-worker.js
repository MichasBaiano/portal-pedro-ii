const CACHE_NAME = 'pedroii-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/offline',
    '/css/style.css',
    '/css/home.css',
    '/css/eventos.css',
    '/css/estabelecimentos.css',
    '/js/tema.js',
    '/js/clima.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@700&display=swap'
];

// 1. Instalação: Baixa os arquivos essenciais
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Ativação: Limpa caches antigos se mudar a versão
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 3. Interceptação (Fetch): A mágica do Offline
self.addEventListener('fetch', (event) => {
    // IGNORA requisições que não sejam http ou https
    if (!event.request.url.startsWith('http')) return;
    // Apenas requisições GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se a internet funcionar, retorna a página e salva uma cópia atualizada no cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Se a internet falhar (offline), tenta pegar do cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Se não tiver no cache e for uma página HTML, mostra a página de erro customizada
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/offline');
                    }
                });
            })
    );
});