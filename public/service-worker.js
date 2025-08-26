const CACHE_NAME = 'two-do-v1'
const STATIC_CACHE = 'two-do-static-v1'
const DYNAMIC_CACHE = 'two-do-dynamic-v1'
const IMAGE_CACHE = 'two-do-images-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== STATIC_CACHE && 
                   cacheName !== DYNAMIC_CACHE && 
                   cacheName !== IMAGE_CACHE
          })
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return offline message for API failures
        return new Response(
          JSON.stringify({ message: 'Offline - please try again when connected' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      })
    )
    return
  }

  // Handle images
  if (url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          }).catch(() => {
            // Return placeholder for failed image loads
            return new Response('', { status: 404 })
          })
        })
      })
    )
    return
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Serve from cache and update in background
            fetch(request).then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                cache.put(request, fetchResponse.clone())
              }
            }).catch(() => {})
            return response
          }
          
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          }).catch(() => {
            // Return cached root page as fallback
            return cache.match('/').then((fallback) => {
              return fallback || new Response('Offline', { status: 503 })
            })
          })
        })
      })
    )
    return
  }

  // Handle other requests (CSS, JS, etc.)
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            cache.put(request, fetchResponse.clone())
          }
          return fetchResponse
        })
      })
    })
  )
})

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync logic here
      console.log('Background sync triggered')
    )
  }
})

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'two-do-notification',
      })
    )
  }
})
