/// <reference path="../typings/index.d.ts" />

const assign = Object.assign;

export default class ApplicationState {

	static initialState = {
		placesNearby: [],
		gps: null,
	};

	constructor() {

	}


	static manage(state = ApplicationState.initialState, action) {
		console.warn(action);
		switch (action.type) {
			case 'setGPS':
				return assign({}, state, {
					gps: action.latLon
				});
			case 'setPlaces':
				return assign({}, state, {
					placesNearby: action.places,
				});
		}
		return state;
	}

}

