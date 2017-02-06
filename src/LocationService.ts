const GMaps = require('./GMaps.geolocate.js');
const LatLon = require('mt-latlon');
import {LatLon} from 'mt-latlon';

export default class LocationService {

	latLon: LatLon;

	store;

	constructor() {
		this.store = require('./storeFactory').default;
	}

	start() {
		console.log('start geolocation');
		GMaps.geolocate({
			success: this.geolocated
		});
	}

	geolocated(pos) {
		console.log(pos);
//			this.lat = pos.coords.latitude;
//			this.lon = pos.coords.longitude;

		const newLatLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
		this.store.dispatch({
			type: 'setGPS',
			latLon: newLatLon,
		});

		if (this.latLon != newLatLon) {
			let wikipediaURL = this.getWikipediaURL();
			//console.log(wikipediaURL);
			this.fetchJSON(wikipediaURL);
		} else {
			console.log('lat lon is the same');
		}
	}

	getWikipediaURL() {
		return 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50&wbptterms=description&generator=geosearch&ggscoord='+this.latLon.lat()+'%7C'+this.latLon.lon()+'&ggsradius=1000&ggslimit=50&format=json&origin=*';
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

}
