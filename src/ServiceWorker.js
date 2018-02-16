"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocationService_1 = require("./LocationService");
/**
 * This was implemented in order to watch user's location
 * even when the browser is closed. Since SW navigator object
 * does not support GL - we don't need SW.
 */
var ServiceWorker = /** @class */ (function () {
    /**
     * Self is a special SW context
     * @param self
     */
    function ServiceWorker(self) {
        var _this = this;
        this.title = 'Have you been here?';
        this.CACHE_NAME = 'my-site-cache-v1';
        this.urlsToCache = [];
        console.log('service worker constructor');
        self.addEventListener('install', function (event) {
            // Perform install steps
            console.log('service worker installed');
            event.waitUntil(caches.open(_this.CACHE_NAME)
                .then(function (cache) {
                console.log('Opened cache');
                //return cache.addAll(this.urlsToCache);
            }));
        });
        // auto cache everything
        // disabled for development
        self.addEventListener('no-fetch', this.cacheAllFetch.bind(this));
        this.ls = new LocationService_1.default();
        self.addEventListener('activate', function (event) {
            console.log('activated');
            //this.notify();
            setInterval(_this.periodicUpdater.bind(_this), 10000);
        });
        this.periodicUpdater();
        self.addEventListener('push', function (event) {
            _this.notify();
            event.waitUntil(function () {
                // Process the event and display a notification.
                _this.notify();
            });
        });
        self.addEventListener('notificationclick', function (event) {
            // Do something with the event
            event.notification.close();
            console.log('clicked');
        });
        self.addEventListener('notificationclose', function (event) {
            // Do something with the event
            console.log('closed');
        });
    }
    ServiceWorker.prototype.notify = function () {
        self.registration.showNotification(this.title, {
            body: 'We found some interesting places nearby. Want to see details?',
            icon: 'img/map_blue.png',
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: 'request',
            actions: [
                { action: 'yes', title: 'Yes!', icon: 'images/thumb-up.png' },
                { action: 'no', title: 'No', icon: 'images/thumb-down.png' }
            ]
        });
    };
    ServiceWorker.prototype.cacheAllFetch = function (event) {
        var _this = this;
        event.respondWith(caches.match(event.request)
            .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(function (response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();
                caches.open(_this.CACHE_NAME)
                    .then(function (cache) {
                    if (response.method == 'GET') {
                        cache.put(event.request, responseToCache);
                    }
                });
                return response;
            });
        }));
    };
    ServiceWorker.prototype.periodicUpdater = function () {
        console.log('10000 seconds passed');
        this.ls.start();
    };
    return ServiceWorker;
}());
exports.default = ServiceWorker;
