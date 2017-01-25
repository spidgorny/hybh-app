/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/redux/index.d.ts" />
var riot = require('riot');
var hybh = require('./hybh.tag');
var h1_places_nearby = require('./h1-places-nearby.tag');
var panels = require('./panels.tag');
var card = require('./card.tag');
var about = require('./about.tag');
var details = require('./details.tag');
var route = require('riot-route');
var LatLon = require('mt-latlon');
var store = require('./storeFactory').default;
// console.log(store);
// console.log(store.getState());
// store.dispatch({type: 'setGPS', latLon: new LatLon(0, 1)});
// console.log(store.getState());
var r = route.create();
r.stop();
r('', function () {
    console.warn('Page: hybh');
    riot.mount('#app', 'hybh');
});
r('details/*', function (id) {
    console.warn('Page: details/' + id);
    riot.mount('#app', 'details');
});
r('about', function () {
    console.warn('Page: about');
    riot.mount('#app', 'about');
});
route.start(true);
global.shareMe = function () {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Find interesting places nearby where-ever you are.',
            url: window.location.href
        }).then(function () { return console.log('Successful share'); })
            .catch(function (error) { return console.log('Error sharing:', error); });
    }
    return false;
};
initializeServiceWorker(initialiseState);
function initializeServiceWorker(callback) {
    if ('serviceWorker' in navigator) {
        console.log('service worker is supported');
        window.addEventListener('load', function () {
            console.log('registering sw');
            navigator.serviceWorker.register('sw.js')
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
}
function initialiseState() {
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
}
// initialiseState();
