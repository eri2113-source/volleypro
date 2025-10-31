// VolleyPro Service Worker
// Versão dinâmica baseada em timestamp

const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__'; // Será substituído no build
const CACHE_VERSION = `volleypro-${BUILD_TIMESTAMP || Date.now()}`;
const CACHE_NAME = CACHE_VERSION;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

console.log('🚀 [SW] Versão do cache:', CACHE_VERSION);

// Recursos essenciais para cache (shell da aplicação)
const ESSENTIAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 [SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 [SW] Cache aberto, adicionando recursos essenciais');
      return cache.addAll(ESSENTIAL_RESOURCES).catch((error) => {
        console.error('❌ [SW] Erro ao cachear recursos:', error);
        // Não falhar se alguns recursos não estiverem disponíveis
        return Promise.resolve();
      });
    }).then(() => {
      console.log('✅ [SW] Service Worker instalado com sucesso');
      // Força o novo SW a ativar imediatamente
      return self.skipWaiting();
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 [SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('🗑️ [SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ [SW] Service Worker ativado');
      // Toma controle de todas as páginas imediatamente
      return self.clients.claim();
    })
  );
});

// Estratégia de cache para diferentes tipos de recursos
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // API do Supabase: Network First (sempre buscar dados frescos)
  if (url.hostname.includes('supabase.co')) {
    return 'network-first';
  }
  
  // Imagens: Cache First (economizar dados)
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return 'cache-first-image';
  }
  
  // Scripts e CSS: Stale While Revalidate
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css)$/i)) {
    return 'stale-while-revalidate';
  }
  
  // HTML: Network First
  if (request.destination === 'document' || 
      request.headers.get('accept')?.includes('text/html')) {
    return 'network-first';
  }
  
  // Padrão: Network First
  return 'network-first';
}

// Network First: Tenta rede, fallback para cache
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Só cacheia respostas bem-sucedidas
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📡 [SW] Sem rede, buscando do cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se não tem no cache e é HTML, retorna página offline
    if (request.destination === 'document') {
      return new Response(
        `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>VolleyPro - Offline</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%);
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 1rem;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              max-width: 400px;
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #0066ff;
              margin: 0 0 1rem 0;
            }
            p {
              color: #475569;
              line-height: 1.6;
            }
            button {
              background: linear-gradient(135deg, #0066ff, #0052cc);
              color: white;
              border: none;
              padding: 0.75rem 2rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover {
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🏐</div>
            <h1>Você está offline</h1>
            <p>O VolleyPro precisa de conexão com a internet para funcionar. Verifique sua conexão e tente novamente.</p>
            <button onclick="location.reload()">Tentar Novamente</button>
          </div>
        </body>
        </html>`,
        { 
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          } 
        }
      );
    }
    
    throw error;
  }
}

// Cache First para imagens
async function cacheFirstImage(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Atualiza o cache em background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(IMAGE_CACHE).then((cache) => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {
      // Ignora erros em background
    });
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Retorna imagem placeholder se falhar
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect fill="#e0f0ff" width="400" height="300"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#0066ff" text-anchor="middle" dominant-baseline="middle">Imagem indisponível</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      caches.open(cacheName).then((cache) => {
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  }).catch(() => {
    // Se falhar, retorna o que tem no cache
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignora chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  const strategy = getCacheStrategy(event.request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case 'cache-first-image':
            return await cacheFirstImage(event.request);
          
          case 'stale-while-revalidate':
            return await staleWhileRevalidate(event.request, RUNTIME_CACHE);
          
          case 'network-first':
          default:
            return await networkFirst(event.request, RUNTIME_CACHE);
        }
      } catch (error) {
        console.error('❌ [SW] Erro ao processar requisição:', error);
        throw error;
      }
    })()
  );
});

// Mensagens do app (comunicação com o cliente)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏩ [SW] Pulando espera e ativando imediatamente');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🧹 [SW] Limpando todos os caches');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('✅ [SW] Todos os caches limpos');
        // Notifica o cliente
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        });
      })
    );
  }
});

// Push notifications (preparado para futuro)
self.addEventListener('push', (event) => {
  console.log('📬 [SW] Push notification recebida');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'VolleyPro';
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'volleypro-notification',
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('👆 [SW] Notificação clicada');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tem uma janela aberta, foca nela
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Senão, abre nova janela
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

console.log('✅ [SW] Service Worker carregado');
