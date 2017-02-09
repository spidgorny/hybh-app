import LocationService from "./LocationService";
import ScrollWatch from "./ScrollWatch";
const riot = require('riot');
const route = require('riot-route');

/**
 * https://github.com/Microsoft/TSJS-lib-generator/blob/cd60588b72a9188e89346b3c440a76508b4c0e76/baselines/dom.generated.d.ts#L8360-L8381
 */
declare var Notification: any;

export default class HYBH {

	ls: LocationService;

	currentPage: any;

	store;

	scrollWatch;

	constructor() {
		let r = route.create();
		r.stop();
		r('',        	() => {
			console.warn('Page: hybh');
			this.currentPage = riot.mount('#app', 'hybh', {
				scrollWatch: this.scrollWatch
			})[0];
			console.log('after riot.mount');
			this.currentPage.afterMount();
		});
		r('details/*',  (pageid) => {
			console.warn('Page: details/', pageid);
			this.scrollWatch.saveScroll();

			this.currentPage = riot.mount('#app', 'details', {
				pageid: pageid,
			})[0];
			this.currentPage.setID(app);
			//console.log(this.currentPage);
		});
		r('about',  	() => {
			console.warn('Page: about');
			this.currentPage = riot.mount('#app', 'about')[0];
		});
		route.start(true);

		this.store = require('./storeFactory').default;

		// not needed
		// this.initializeServiceWorker(this.initialiseState.bind(this));

		this.ls = new LocationService();
		setInterval(this.periodicUpdater.bind(this), 60 * 1000);

		setTimeout(() => {
			this.getLocationOnStart();
		}, 1000);

		$('#start_geocoding').on('click', this.periodicUpdater.bind(this));
		$('#fake_geocoding').on('click', this.fakeGeocoding.bind(this));

		this.scrollWatch = new ScrollWatch(route);
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
			this.ls.start();
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
