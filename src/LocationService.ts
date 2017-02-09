import GMaps from "./GMaps.geolocate";
//import {LatLon} from 'mt-latlon';
import LatLon = require('mt-latlon');
import jQuery = require('jquery');

export default class LocationService {

	latLon: LatLon = new LatLon(0, 0);

	store;

	//gmaps: GMaps;

	constructor() {
		this.store = require('./storeFactory').default;
		console.log('store in LocationService', this.store);
		console.log('state in LocationService', this.store.getState());
		//this.gmaps = new GMaps();
	}

	start() {
		console.log('start geolocation');
		GMaps.geolocate({
			success: this.geolocated.bind(this),
			not_supported: this.geoError.bind(this),
			error: this.geoError.bind(this),
		});
	}

	geolocated(pos) {
		console.log(pos);
//			this.lat = pos.coords.latitude;
//			this.lon = pos.coords.longitude;

		const newLatLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
		if (this.latLon.lat() != newLatLon.lat() ||
			this.latLon.lon() != newLatLon.lon()) {

			this.store.dispatch({
				type: 'setGPS',
				latLon: newLatLon,
			});

			let wikipediaURL = this.getWikipediaURL(newLatLon);
			//console.log(wikipediaURL);
			this.fetchJSON(wikipediaURL);

			this.latLon = newLatLon;
		} else {
			console.log('lat lon is the same');
		}
	}

	getWikipediaURL(latLon: LatLon) {
		let radius = this.store.getState().options.radius || 1000;
		return 'https://en.wikipedia.org/w/api.php?action=query'+
		'&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance%7Cinfo%7Cextracts'+
		'&exintro=1'+
		'&srprop=titlesnippet'+
		'&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50'+
		'&wbptterms=description'+
		'&inprop=url'+
		'&iwurl=1'+
		'&list=alllinks'+
		'&generator=geosearch'+
		'&ggscoord='+latLon.lat()+'%7C'+latLon.lon()+
		'&ggsradius='+radius+
		'&ggslimit=50&format=json&origin=*';
		//+encodeURIComponent('http://localhost:8081');
	}

	fetchJSON(url) {
		fetch(url, {
//				mode: 'no-cors',
			cache: 'force-cache',
			headers: {
//					'Origin': 'http://localhost:8081'
			},
		})
			.then(response => {
				return response.text();
//				return response.json();
			})
			.then(text => {
				return JSON.parse(text);
			})
			.then(json => {
				this.store.dispatch({
					type: 'setPlaces',
					places: json.query.pages,
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	geoError(errorMessage) {
		console.error(errorMessage);
		jQuery.getJSON("http://ipinfo.io", (ipinfo) => {
			console.log("Found location ["+ipinfo.loc+"] by ipinfo.io");
			let latLong = ipinfo.loc.split(",");
			if (latLong) {
				this.geolocated({
					coords: {
						latitude: latLong[0],
						longitude: latLong[1],
					}
				});
			}
		});
	}

}
