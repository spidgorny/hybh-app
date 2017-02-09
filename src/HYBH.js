"use strict";
var LocationService_1 = require("./LocationService");
var riot = require('riot');
var route = require('riot-route');
var HYBH = (function () {
    function HYBH() {
        var _this = this;
        var r = route.create();
        r.stop();
        r('', function () {
            console.warn('Page: hybh');
            _this.currentPage = riot.mount('#app', 'hybh')[0];
        });
        r('details/*', function (app, page, id) {
            console.warn('Page: details/', app, page, id);
            _this.currentPage = riot.mount('#app', 'details', {
                id: app
            })[0];
            _this.currentPage.setID(app);
            //console.log(this.currentPage);
        });
        r('about', function () {
            console.warn('Page: about');
            _this.currentPage = riot.mount('#app', 'about')[0];
        });
        route.start(true);
        this.store = require('./storeFactory').default;
        // not needed
        // this.initializeServiceWorker(this.initialiseState.bind(this));
        this.ls = new LocationService_1.default();
        setInterval(this.periodicUpdater.bind(this), 60 * 1000);
        var state = this.store.getState();
        var placesNearby = state.placesNearby;
        console.log(placesNearby);
        if (!Object.keys(placesNearby).length) {
            console.error('nothing is in placesNearby. call periodicUpdater');
            this.periodicUpdater();
        }
        $('#start_geocoding').on('click', this.periodicUpdater.bind(this));
        $('#fake_geocoding').on('click', this.fakeGeocoding.bind(this));
    }
    HYBH.prototype.periodicUpdater = function () {
        console.log('10000 milliseconds passed');
        console.log(this.currentPage);
        this.ls.start();
    };
    HYBH.prototype.fakeGeocoding = function () {
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
    };
    HYBH.prototype.initializeServiceWorker = function (callback) {
        if ('serviceWorker' in navigator) {
            console.log('service worker is supported');
            window.addEventListener('load', function () {
                console.log('registering sw');
                navigator.serviceWorker.register('sw.run.js')
                    .then(function (registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                    .then(function () {
                    console.log('calling callback...');
                    callback();
                })
                    .catch(function (err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
        else {
            console.log('service worker is NOT supported');
        }
    };
    HYBH.prototype.initialiseState = function () {
        console.log('initializing state?');
        if (Notification.permission === 'granted') {
            console.log('We can send notifications already.');
        }
        else if (Notification.permission === 'blocked') {
            /* the user has previously denied push. Can't reprompt. */
            console.log('User blocked notifications permanently.');
        }
        else {
            /* show a prompt to the user */
            console.log('asking for permission...');
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    console.log('notification are grated');
                }
                else {
                    console.warn('notifications rejected');
                }
            });
        }
    };
    return HYBH;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HYBH;
