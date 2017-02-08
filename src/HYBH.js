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
            riot.mount('#app', 'hybh');
        });
        r('details/*', function (app, page, id) {
            console.warn('Page: details/', app, page, id);
            _this.currentPage = riot.mount('#app', 'details')[0];
            _this.currentPage.setID(app);
            //console.log(this.currentPage);
        });
        r('about', function () {
            console.warn('Page: about');
            riot.mount('#app', 'about');
        });
        route.start(true);
        // not needed
        // this.initializeServiceWorker(this.initialiseState.bind(this));
        this.ls = new LocationService_1.default();
        //setInterval(this.periodicUpdater.bind(this), 10000);
        // this.periodicUpdater();
        $('#start_geocoding').on('click', this.periodicUpdater.bind(this));
    }
    HYBH.prototype.periodicUpdater = function () {
        console.log('10000 milliseconds passed');
        this.ls.start();
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
