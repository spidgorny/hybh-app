"use strict";
/// <reference path="../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
// import expect, { createSpy, spyOn, isSpy } from 'expect';
var expect = require('expect');
expect(1 + 1).toEqual(2);
var ApplicationState_1 = require("../src/ApplicationState");
var as = new ApplicationState_1.default();
false && expect(as.manage({}, { type: 'null' })).toEqual({
    gps: null,
    placesNearby: [],
    forget: [],
});
var store = require('../src/storeFactory').default;
console.log(store.getState());
store.dispatch({
    type: 'forgetPlace',
    pageid: 123,
});
expect(store.getState()).toInclude({
    placesNearby: [],
    gps: null,
    forget: [123]
});
var assign = Object.assign;
var willOverwrite = assign({}, {
    places: [1, 2, 3],
}, {
    places: [4, 5, 6],
});
expect(willOverwrite).toEqual({
    places: [4, 5, 6],
});
console.log('OK');
