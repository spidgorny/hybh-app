"use strict";
/// <reference path="../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assign = Object.assign;
const md5 = require('js-md5');
const store = require("store");
const LatLon = require("mt-latlon");
class ApplicationState {
    constructor() {
        this.initialState = {
            placesNearby: [],
            gps: null,
            forget: [],
            options: {
                radius: 1000,
            },
        };
        let state = store.get('appState');
        //console.log('loaded state', state);
        if (state && state != {}) {
            this.initialState = this.manage(state, { type: 'null' });
        }
        else {
            //this.initialState = this.initialState;
        }
    }
    manage(state, action) {
        console.warn('ApplicationState.manage', action);
        if (typeof state == 'undefined') {
            state = this.initialState;
        }
        else
            switch (action.type) {
                case 'null':
                    state = assign({}, state);
                    if (state.gps) {
                        state.gps = new LatLon(state.gps._lat, state.gps._lon, state.gps._radius);
                    }
                    break;
                case '@@redux/INIT':
                    state = assign({}, this.initialState);
                    break;
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
                case 'forgetPlace':
                    let forget = state.forget || [];
                    state = assign({}, state, {
                        forget: forget.concat(action.pageid),
                    });
                    break;
                case 'setRadius':
                    state = assign({}, state, {
                        options: {
                            ...state.options,
                            radius: action.radius,
                        }
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
            if (stateHash != '{}') {
                console.log('saving state to appState', md5(stateHash));
                store.set('appState', state);
            }
        }
    }
}
exports.default = ApplicationState;
