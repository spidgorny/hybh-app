/// <reference path="../typings/index.d.ts" />
"use strict";
// import expect, { createSpy, spyOn, isSpy } from 'expect';
var expect = require('expect');
expect(1 + 1).toEqual(2);
var ApplicationState_1 = require("../src/ApplicationState");
var as = new ApplicationState_1.default();
false && expect(as.manage({}, { type: 'null' })).toEqual({
    gps: null,
    nearbyPlaces: [],
    forget: [],
});
var store = require('../src/storeFactory').default;
console.log(store.getState());
store.dispatch({
    type: 'forgetPlace',
    pageid: 123,
});
expect(store.getState()).toEqual({
    placesNearby: [],
    gps: null,
    forget: [123]
});
console.log('OK');
