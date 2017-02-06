"use strict";
var GMaps = require('./GMaps.geolocate.js');
var LatLon = require('mt-latlon');
var mt_latlon_1 = require("mt-latlon");
var LocationService = (function () {
    function LocationService() {
        this.store = require('./storeFactory').default;
    }
    LocationService.prototype.start = function () {
        console.log('start geolocation');
        GMaps.geolocate({
            success: this.geolocated
        });
    };
    LocationService.prototype.geolocated = function (pos) {
        console.log(pos);
        //			this.lat = pos.coords.latitude;
        //			this.lon = pos.coords.longitude;
        var newLatLon = new mt_latlon_1.LatLon(pos.coords.latitude, pos.coords.longitude);
        this.store.dispatch({
            type: 'setGPS',
            latLon: newLatLon,
        });
        if (this.latLon != newLatLon) {
            var wikipediaURL = this.getWikipediaURL();
            //console.log(wikipediaURL);
            this.fetchJSON(wikipediaURL);
        }
        else {
            console.log('lat lon is the same');
        }
    };
    LocationService.prototype.getWikipediaURL = function () {
        return 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=' + this.latLon.lat() + '%7C' + this.latLon.lon() + '&ggsradius=1000&ggslimit=50&format=json&origin=*';
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
    return LocationService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocationService;
