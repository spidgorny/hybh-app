"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GMaps_geolocate_1 = require("./GMaps.geolocate");
//import {LatLon} from 'mt-latlon';
var LatLon = require("mt-latlon");
var jQuery = require("jquery");
var $ = require("jquery");
console.log('jQuery', Object.keys(jQuery));
console.log('$', Object.keys($));
console.log('$', $);
var LocationService = /** @class */ (function () {
    //gmaps: GMaps;
    function LocationService() {
        this.latLon = new LatLon(0, 0);
        this.store = require('./storeFactory').default;
        // console.log('store in LocationService', this.store);
        // console.log('state in LocationService', this.store.getState());
        //this.gmaps = new GMaps();
    }
    LocationService.prototype.start = function () {
        var _this = this;
        console.log('start geolocation');
        return new Promise(function (resolve, reject) {
            GMaps_geolocate_1.default.geolocate({
                success: function (pos) {
                    var promise = _this.geolocated(pos);
                    resolve(promise);
                },
                not_supported: function (err) {
                    _this.geoError(err);
                    reject(err);
                },
                error: function (err) {
                    _this.geoError(err);
                    reject(err);
                },
            });
        });
    };
    LocationService.prototype.geolocated = function (pos) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(pos);
            //			this.lat = pos.coords.latitude;
            //			this.lon = pos.coords.longitude;
            var newLatLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
            if (_this.latLon.lat() != newLatLon.lat() ||
                _this.latLon.lon() != newLatLon.lon()) {
                _this.store.dispatch({
                    type: 'setGPS',
                    latLon: newLatLon,
                });
                _this.latLon = newLatLon;
                var radius = _this.store.getState().options.radius || 1000;
                var wikipediaURL = _this.getWikipediaURL(newLatLon, radius);
                //console.log(wikipediaURL);
                var promise = _this.fetchJSON(wikipediaURL, radius);
                resolve(promise);
            }
            else {
                console.log('lat lon is the same');
                reject('lat lon is the same');
            }
        });
    };
    LocationService.prototype.getWikipediaURL = function (latLon, radius) {
        if (radius === void 0) { radius = 1000; }
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
    };
    LocationService.prototype.fetchJSON = function (url, radius) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fetch(url, {
                //				mode: 'no-cors',
                cache: 'force-cache',
                headers: {
                //					'Origin': 'http://localhost:8081'
                },
            })
                .then(function (response) {
                return response.text();
                //				return response.json();
            })
                .then(function (text) {
                return JSON.parse(text);
            })
                .then(function (json) {
                // let radius = this.store.getState().options.radius;
                console.log('json', json);
                if (json.query && json.query.pages) {
                    _this.store.dispatch({
                        type: 'setPlaces',
                        places: json.query.pages,
                    });
                    console.log('resolve', json.query.pages);
                    resolve(json.query.pages);
                }
                else if (radius < 1000) {
                    // call again with a wider range
                    var wikipediaURL = _this.getWikipediaURL(_this.latLon, 1000);
                    return _this.fetchJSON(wikipediaURL, 1000);
                }
                else {
                    console.log('wikipedia has no results for ', _this.latLon.toString('d'));
                    reject('wikipedia has no results for ' + _this.latLon.toString('d'));
                }
            })
                .catch(function (err) {
                console.error('catch on fetch wiki', err);
                reject(err);
            });
        });
    };
    LocationService.prototype.geoError = function (errorMessage) {
        var _this = this;
        console.error(errorMessage);
        fetch("http://ipinfo.io/json")
            .then(function (response) {
            return response.text();
            //				return response.json();
        })
            .then(function (text) {
            return JSON.parse(text);
        })
            .then(function (ipinfo) {
            console.log('ipinfo', ipinfo);
            console.log("Found location [" + ipinfo.loc + "] by ipinfo.io");
            var latLong = ipinfo.loc.split(",");
            if (latLong) {
                _this.geolocated({
                    coords: {
                        latitude: latLong[0],
                        longitude: latLong[1],
                    }
                });
            }
        })
            .catch(function (error) {
            console.error('catch on fetch ipinfo.io', error);
        });
    };
    return LocationService;
}());
exports.default = LocationService;
