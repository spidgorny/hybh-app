const riot = require('riot');
const hybh = require('./hybh.tag');
const h1_places_nearby = require('./h1-places-nearby.tag');
const panels = require('./panels.tag');
const card = require('./card.tag');
const about = require('./about.tag');
const details = require('./details.tag');
const route = require('riot-route');

let r = route.create();
r.stop();
r('',        	() => {
	console.warn('Page: hybh');
	riot.mount('#app', 'hybh');
});
r('details/*',  (id) => {
	console.warn('Page: details/'+id);
	riot.mount('#app', 'details');
});
r('about',  	() => {
	console.warn('Page: about');
	riot.mount('#app', 'about');
});
route.start(true);

global.shareMe = () => {
	if (navigator.share) {
		navigator.share({
			title: document.title,
			text: "Find interesting places nearby where-ever you are.",
			url: window.location.href
		}).then(() => console.log('Successful share'))
		.catch(error => console.log('Error sharing:', error));
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

function initialiseState() {
	console.log('initializing state?');
	if (Notification.permission == 'granted') {
		console.log('We can send notifications already.');
	} else if (Notification.permission === 'blocked') {
		/* the user has previously denied push. Can't reprompt. */
		console.log('User blocked notifications permanently.');
	} else {
		/* show a prompt to the user */
		console.log('asking for permission...');
		Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        console.log('notification are grated');
      } else {
				console.warn('notifications rejected');
			}
    });
	}

}
// initialiseState();
