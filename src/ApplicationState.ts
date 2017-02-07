/// <reference path="../typings/index.d.ts" />

const assign = Object.assign;

const md5 = require('js-md5');

import store = require('store');

export default class ApplicationState {

	static initialState = {
		placesNearby: [],
		gps: null,
	};

	constructor() {
		let state = store.get('appState');
		console.log('loaded state', state);
		if (state) {
			this.manage(state, {type: 'null'});
		} else {
			this.manage(ApplicationState.initialState, {type: 'null'});
		}
	}

	manage(state, action) {
		console.warn(action);
		switch (action.type) {
			case 'setGPS':
				state = assign({}, state, {
					gps: action.latLon
				});
				break;
			case 'setPlaces':
				state = assign({}, state, {
					placesNearby: action.places,
				});
				break;
			default:
				state = assign({}, state);
				break;
		}
		this.saveState(state);
		return state;
	}

	saveState(state) {
		if (state) {
			let stateHash = JSON.stringify(state);
			console.log('saving state to appState', md5(stateHash));
			store.set('appState', state);
		}
	}

}

