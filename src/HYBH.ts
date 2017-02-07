import LocationService from "./LocationService";
const riot = require('riot');
const route = require('riot-route');

/**
 * https://github.com/Microsoft/TSJS-lib-generator/blob/cd60588b72a9188e89346b3c440a76508b4c0e76/baselines/dom.generated.d.ts#L8360-L8381
 */
declare var Notification: any;

export default class HYBH {

	ls: LocationService;

	constructor() {
		let r = route.create();
		r.stop();
		r('',        	() => {
			console.warn('Page: hybh');
			riot.mount('#app', 'hybh');
		});
		r('details/*',  (id) => {
			console.warn('Page: details/' + id);
			riot.mount('#app', 'details');
		});
		r('about',  	() => {
			console.warn('Page: about');
			riot.mount('#app', 'about');
		});
		route.start(true);

		// not needed
		// this.initializeServiceWorker(this.initialiseState.bind(this));

		this.ls = new LocationService();
		setInterval(this.periodicUpdater.bind(this), 10000);
		this.periodicUpdater();
	}

	periodicUpdater() {
		console.log('10000 milliseconds passed');
		this.ls.start();
	}

	initializeServiceWorker(callback: Function) {
		if ('serviceWorker' in navigator) {
			console.log('service worker is supported');
			window.addEventListener('load', function () {
				console.log('registering sw');
				navigator.serviceWorker.register('sw.run.js')
					.then(function (registration) {
						// Registration was successful
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					})
					.then(() => {
						console.log('calling callback...');
						callback();
					})
					.catch(function (err) {
						// registration failed :(
						console.log('ServiceWorker registration failed: ', err);
					});
			});
		} else {
			console.log('service worker is NOT supported');
		}
	}

	initialiseState() {
		console.log('initializing state?');
		if (Notification.permission === 'granted') {
			console.log('We can send notifications already.');
		} else if (Notification.permission === 'blocked') {
			/* the user has previously denied push. Can't reprompt. */
			console.log('User blocked notifications permanently.');
		} else {
			/* show a prompt to the user */
			console.log('asking for permission...');
			Notification.requestPermission(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
					console.log('notification are grated');
				} else {
					console.warn('notifications rejected');
				}
			});
		}
	}

}
