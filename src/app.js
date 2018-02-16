"use strict";
/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/redux/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var HYBH_1 = require("./HYBH");
var hybh = require('./hybh.tag');
var h1_places_nearby = require('./h1-places-nearby.tag');
var panels = require('./panels.tag');
var card = require('./card.tag');
var about = require('./about.tag');
var raw = require('./raw.tag');
var details = require('./details.tag');
// console.log(store.getState());
// store.dispatch({type: 'setGPS', latLon: new LatLon(0, 1)});
// console.log(store.getState());
global.shareMe = function () {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Find interesting places nearby where-ever you are.',
            url: window.location.href
        }).then(function () { return console.log('Successful share'); })
            .catch(function (error) { return console.log('Error sharing:', error); });
    }
    return false;
};
var hybh = new HYBH_1.default();
