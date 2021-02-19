const CACHE_NAME = "version-1";
const urlsToCache = ['index.html','offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
    console.log("Service worker installed");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests

// self.addEventListener('fetch', event => {
    // request.mode = navigate isn't supported in all browsers
    // so include a check for Accept: text/html header.
//     if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
//           event.respondWith(
//             fetch(event.request.url).catch(error => {
//                 // Return the offline page
//                 return caches.match('offline.html');
//             })
//       );
//     }
//     else{
//           // Respond with everything else if we can
//           event.respondWith(caches.match(event.request)
//                           .then(function (response) {
//                           return response || fetch(event.request);
//                       })
//               );
//         }
//   });



self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            // .then(() => {
            //     console.log("Event-req",fetch(event.request))
            //     return fetch(event.request) 
            //         .catch(() => caches.match('offline.html'))
            // })
            .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                return fetch(event.request)
                        .catch(()=> caches.match('offline.html'));
              })
//             .then(function(response){
//                 return response || fetch(event.request);
//             })
    )
});




// Activate the SW
self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
    // console.log("Activate")
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});

