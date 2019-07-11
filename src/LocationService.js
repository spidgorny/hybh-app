"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GMaps_geolocate_1 = require("./GMaps.geolocate");
//import {LatLon} from 'mt-latlon';
const LatLon = require("mt-latlon");
const jQuery = require("jquery");
const $ = require("jquery");
console.log('jQuery', Object.keys(jQuery));
console.log('$', Object.keys($));
console.log('$', $);
class LocationService {
    //gmaps: GMaps;
    constructor() {
        this.latLon = new LatLon(0, 0);
        this.store = require('./storeFactory').default;
        // console.log('store in LocationService', this.store);
        // console.log('state in LocationService', this.store.getState());
        //this.gmaps = new GMaps();
    }
    start() {
        console.log('start geolocation');
        return new Promise((resolve, reject) => {
            GMaps_geolocate_1.default.geolocate({
                success: (pos) => {
                    let promise = this.geolocated(pos);
                    resolve(promise);
                },
                not_supported: (err) => {
                    this.geoError(err);
                    reject(err);
                },
                error: (err) => {
                    this.geoError(err);
                    reject(err);
                },
            });
        });
    }
    geolocated(pos) {
        return new Promise((resolve, reject) => {
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
                this.latLon = newLatLon;
                let radius = this.store.getState().options.radius || 1000;
                let wikipediaURL = this.getWikipediaURL(newLatLon, radius);
                //console.log(wikipediaURL);
                let promise = this.fetchJSON(wikipediaURL, radius);
                resolve(promise);
            }
            else {
                console.log('lat lon is the same');
                reject('lat lon is the same');
            }
        });
    }
    getWikipediaURL(latLon, radius = 1000) {
        radius = this.store.getState().options.radius || radius;
        return 'https://en.wikipedia.org/w/api.php?action=query' +
            '&prop=coordinates%7Cpageimages%7Cpageterms%7Cinfo%7Cextracts' +
            '&exintro=1' +
            // '&srprop=titlesnippet'+
            '&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50' +
            '&wbptterms=description' +
            '&inprop=url' +
            '&iwurl=1' +
            '&list=alllinks' +
            '&generator=geosearch' +
            '&ggscoord=' + latLon.lat() + '%7C' + latLon.lon() +
            '&ggsradius=' + radius +
            '&ggslimit=50&format=json&origin=*';
        //+encodeURIComponent('http://localhost:8081');
    }
    fetchJSON(url, radius) {
        return new Promise((resolve, reject) => {
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
                // let radius = this.store.getState().options.radius;
                console.log('json', json);
                if (json.query && json.query.pages) {
                    this.store.dispatch({
                        type: 'setPlaces',
                        places: json.query.pages,
                    });
                    console.log('resolve', json.query.pages);
                    resolve(json.query.pages);
                }
                else if (radius < 1000) {
                    // call again with a wider range
                    let wikipediaURL = this.getWikipediaURL(this.latLon, 1000);
                    return this.fetchJSON(wikipediaURL, 1000);
                }
                else {
                    console.log('wikipedia has no results for ', this.latLon.toString('d'));
                    reject('wikipedia has no results for ' + this.latLon.toString('d'));
                }
            })
                .catch(err => {
                console.error('catch on fetch wiki', err);
                reject(err);
            });
        });
    }
    geoError(errorMessage) {
        console.error(errorMessage);
        fetch("http://ipinfo.io/json")
            .then(response => {
            return response.text();
            //				return response.json();
        })
            .then(text => {
            return JSON.parse(text);
        })
            .then((ipinfo) => {
            console.log('ipinfo', ipinfo);
            console.log("Found location [" + ipinfo.loc + "] by ipinfo.io");
            let latLong = ipinfo.loc.split(",");
            if (latLong) {
                this.geolocated({
                    coords: {
                        latitude: latLong[0],
                        longitude: latLong[1],
                    }
                });
            }
        })
            .catch(error => {
            console.error('catch on fetch ipinfo.io', error);
        });
    }
}
exports.default = LocationService;
