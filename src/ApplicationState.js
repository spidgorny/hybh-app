/// <reference path="../typings/index.d.ts" />
"use strict";
var assign = Object.assign;
var ApplicationState = (function () {
    function ApplicationState() {
    }
    ApplicationState.manage = function (state, action) {
        if (state === void 0) { state = ApplicationState.initialState; }
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
    };
    ApplicationState.initialState = {
        placesNearby: [],
        gps: null,
    };
    return ApplicationState;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationState;
