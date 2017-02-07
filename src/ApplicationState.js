/// <reference path="../typings/index.d.ts" />
"use strict";
var assign = Object.assign;
var md5 = require('js-md5');
var store = require("store");
var ApplicationState = (function () {
    function ApplicationState() {
        var state = store.get('appState');
        console.log('loaded state', state);
        if (state) {
            this.manage(state, { type: 'null' });
        }
        else {
            this.manage(ApplicationState.initialState, { type: 'null' });
        }
    }
    ApplicationState.prototype.manage = function (state, action) {
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
    };
    ApplicationState.prototype.saveState = function (state) {
        if (state) {
            var stateHash = JSON.stringify(state);
            console.log('saving state to appState', md5(stateHash));
            store.set('appState', state);
        }
    };
    return ApplicationState;
}());
ApplicationState.initialState = {
    placesNearby: [],
    gps: null,
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationState;
