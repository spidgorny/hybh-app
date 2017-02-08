"use strict";
var GMaps_geolocate_1 = require("./GMaps.geolocate");
//import {LatLon} from 'mt-latlon';
var LatLon = require("mt-latlon");
var LocationService = (function () {
    //gmaps: GMaps;
    function LocationService() {
        this.latLon = new LatLon(0, 0);
        this.store = require('./storeFactory').default;
        console.log('store in LocationService', this.store);
        console.log('state in LocationService', this.store.getState());
        //this.gmaps = new GMaps();
    }
    LocationService.prototype.start = function () {
        console.log('start geolocation');
        GMaps_geolocate_1.default.geolocate({
            success: this.geolocated.bind(this),
            not_supported: this.geoError.bind(this),
        });
    };
    LocationService.prototype.geolocated = function (pos) {
        console.log(pos);
        //			this.lat = pos.coords.latitude;
        //			this.lon = pos.coords.longitude;
        var newLatLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
        if (this.latLon.lat() != newLatLon.lat() ||
            this.latLon.lon() != newLatLon.lon()) {
            this.store.dispatch({
                type: 'setGPS',
                latLon: newLatLon,
            });
            var wikipediaURL = this.getWikipediaURL(newLatLon);
            //console.log(wikipediaURL);
            this.fetchJSON(wikipediaURL);
            this.latLon = newLatLon;
        }
        else {
            console.log('lat lon is the same');
        }
    };
    LocationService.prototype.getWikipediaURL = function (latLon) {
        return 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=' + latLon.lat() + '%7C' + latLon.lon() + '&ggsradius=1000&ggslimit=50&format=json&origin=*';
        //+encodeURIComponent('http://localhost:8081');
    };
    LocationService.prototype.fetchJSON = function (url) {
        var _this = this;
        fetch(url, {
            //				mode: 'no-cors',
            cache: 'force-cache',
            headers: {},
        })
            .then(function (response) {
            return response.text();
            //				return response.json();
        })
            .then(function (text) {
            return JSON.parse(text);
        })
            .then(function (json) {
            _this.store.dispatch({
                type: 'setPlaces',
                places: json.query.pages,
            });
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    LocationService.prototype.geoError = function () {
        console.log('geolocation is not supported');
    };
    return LocationService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocationService;
