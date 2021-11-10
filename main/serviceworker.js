//set up cache name and files to add to it
// only change from here down
const CACHE_NAME = 'cache-v1';
const CACHE_URLS =  ['/','index.html',
                    'about.html',
                    'coffee.html',
                    'main.css',
                    'menu.html',
                    'menuStyle.css',
                    'prototype.html',                      
                    'table.html',
                    '404.html',
                    'manifest.webmanifest',
                    'images/footer/fb.png',
                    'images/footer/ig.png',
                    'images/footer/messenger.png',
                    'images/footer/twitter.png',
                    'images/home/aboutUs.jpg',
                    'images/home/coffee.jpeg',
                    'images/home/home_desktop.jpg',
                    'images/home/home.jpg',
                    'images/home/menu.jpg',
                    'images/menu/americano.jpg',
                    'images/menu/capuccino.jpg',
                    'images/menu/Chemex.jpg',
                    'images/menu/comming-soon.jpg',
                    'images/menu/espresso.jpg',
                    'images/menu/pourOver.jpg',
                    'images/subpage/coffeeprocess.jpeg',
                    'images/subpage/floorplan.jpg',
                    'images/icon/icon-192x192.png',
                    'images/icon/icon-512x512.png'
                  ];
// const CACHE_URLS =[];
//DO NOT change any of the code below 
//...

//add all URLs to cache when installed
self.addEventListener("install", function(event){
    console.log("Service worker installed");
    event.waitUntil(
        //create and open cache
        caches.open(CACHE_NAME)
            .then(function(cache){
                console.log("Cache opened");
                //add all URLs to cache
                return cache.addAll(CACHE_URLS);
        })
    );
});

//On activate update the cache with the new version and clean out old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.startsWith('my-site-') && CACHE_NAME !== cacheName) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
//add all URLs to cache when installed
//...
//user has navigated to page - fetch required assets
self.addEventListener("fetch", function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            //check whether asset is in cache
            if(response){
                //asset in cache, so return it
                console.log(`Return ${event.request.url} from cache`);
                return response;
            }
            //asset not in cache so fetch asset from network
            console.log(`Fetch ${event.request.url} from network`);
            return fetch(event.request);
        })
    );
});
