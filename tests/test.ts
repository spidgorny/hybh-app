/// <reference path="../typings/index.d.ts" />

// import expect, { createSpy, spyOn, isSpy } from 'expect';

const expect = require('expect');

expect(
	1 + 1
).toEqual(2);

import ApplicationState from '../src/ApplicationState';

let as = new ApplicationState();

false && expect(as.manage({}, {type:'null'})).toEqual({
	gps: null,
	nearbyPlaces: [],
	forget: [],
});

const store = require('../src/storeFactory').default;
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
