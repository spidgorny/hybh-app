/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/redux/index.d.ts" />

import HYBH from "./HYBH";
const hybh = require('./hybh.tag');
const h1_places_nearby = require('./h1-places-nearby.tag');
const panels = require('./panels.tag');
const card = require('./card.tag');
const about = require('./about.tag');
const details = require('./details.tag');

// console.log(store.getState());
// store.dispatch({type: 'setGPS', latLon: new LatLon(0, 1)});
// console.log(store.getState());


global.shareMe = () => {
	if (navigator.share) {
		navigator.share({
			title: document.title,
			text: 'Find interesting places nearby where-ever you are.',
			url: window.location.href
		}).then(() => console.log('Successful share'))
		.catch(error => console.log('Error sharing:', error));
	}
	return false;
};

const hybh = new HYBH();
