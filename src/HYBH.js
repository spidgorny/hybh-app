"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocationService_1 = require("./LocationService");
const ScrollWatch_1 = require("./ScrollWatch");
const riot = require('riot');
const route = require('riot-route');
class HYBH {
    constructor() {
        let r = route.create();
        r.stop();
        r('', () => {
            console.warn('Page: hybh');
            this.currentPage = riot.mount('#app', 'hybh', {
                scrollWatch: this.scrollWatch
            })[0];
            console.log('after riot.mount');
            this.currentPage.afterMount();
        });
        r('details/*', (pageid) => {
            console.warn('Page: details/', pageid);
            this.scrollWatch.saveScroll();
            this.currentPage = riot.mount('#app', 'details', {
                pageid: pageid,
            })[0];
            this.currentPage.setID(app);
            //console.log(this.currentPage);
        });
        r('about', () => {
            console.warn('Page: about');
            this.currentPage = riot.mount('#app', 'about')[0];
        });
        route.start(true);
        this.store = require('./storeFactory').default;
        this.initializeServiceWorker()
            .then(this.initialiseState.bind(this))
            .then(() => {
            console.log('2 promises');
        });
        this.ls = new LocationService_1.default();
        setInterval(this.periodicUpdater.bind(this), 60 * 1000);
        setTimeout(() => {
            this.getLocationOnStart();
        }, 1000);
        $('#start_geocoding').on('click', this.periodicUpdater.bind(this));
        $('#fake_geocoding').on('click', this.fakeGeocoding.bind(this));
        this.scrollWatch = new ScrollWatch_1.default(route);
        // required even though we restore manually
        //this.scrollWatch.start();
    }
    getLocationOnStart() {
        let state = this.store.getState();
        let placesNearby = state.placesNearby;
        //console.log('placesNearby', placesNearby);
        if (!placesNearby || !Object.keys(placesNearby).length) {
            console.error('nothing is in placesNearby. call periodicUpdater');
            this.periodicUpdater();
        }
    }
    periodicUpdater() {
        //console.log('10000 milliseconds passed');
        //console.log('currentPage', this.currentPage);
        if (this.currentPage && this.currentPage.type && this.currentPage.type == 'hybh') {
            this.ls.start()
                .then((response) => {
                console.log(response);
                this.registration.showNotification('Some nice places nearby', {
                    "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
                    "icon": "img/map_blue.png",
                    "vibrate": [200, 100, 200, 100, 200, 100, 400],
                    "tag": "request",
                });
            }).catch(err => {
                console.error(err);
            });
        }
    }
    fakeGeocoding() {
        this.store.dispatch({
            type: 'setRadius',
            radius: 100,
        });
        this.ls.geolocated({
            coords: {
                latitude: 50.449992,
                longitude: 30.5230968,
            }
        });
    }
    initializeServiceWorker() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                console.log('service worker is supported');
                window.addEventListener('load', () => {
                    console.log('registering sw');
                    navigator.serviceWorker.register('sw.run.js')
                        .then((registration) => {
                        // Registration was successful
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                        console.log(registration);
                        this.registration = registration;
                    })
                        .then(() => {
                        console.log('calling callback...');
                        resolve();
                    })
                        .catch((err) => {
                        // registration failed :(
                        console.log('ServiceWorker registration failed: ', err);
                        reject(err);
                    });
                });
            }
            else {
                console.log('service worker is NOT supported');
                reject('service worker is NOT supported');
            }
        });
    }
    initialiseState() {
        return new Promise((resolve, reject) => {
            console.log('initializing state?');
            if (Notification.permission === 'granted') {
                console.log('We can send notifications already.');
                resolve('We can send notifications already.');
            }
            else if (Notification.permission === 'blocked') {
                /* the user has previously denied push. Can't reprompt. */
                console.log('User blocked notifications permanently.');
                reject('User blocked notifications permanently.');
            }
            else {
                /* show a prompt to the user */
                console.log('asking for permission...');
                Notification.requestPermission((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === 'granted') {
                        console.log('notification are grated');
                        resolve('notification are grated');
                    }
                    else {
                        console.warn('notifications rejected');
                        reject('notifications rejected');
                    }
                });
            }
        });
    }
}
exports.default = HYBH;
