/// <reference path="../typings/index.d.ts" />
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var assign = Object.assign;
var md5 = require('js-md5');
var store = require("store");
var LatLon = require("mt-latlon");
var ApplicationState = (function () {
    function ApplicationState() {
        this.initialState = {
            placesNearby: [],
            gps: null,
            forget: [],
            options: {
                radius: 1000,
            },
        };
        var state = store.get('appState');
        console.log('loaded state', state);
        if (state && state != {}) {
            this.initialState = this.manage(state, { type: 'null' });
        }
        else {
        }
    }
    ApplicationState.prototype.manage = function (state, action) {
        console.warn('ApplicationState.manage', action);
        if (typeof state == 'undefined') {
            state = this.initialState;
        }
        else
            switch (action.type) {
                case 'null':
                    state = assign({}, state);
                    state.gps = new LatLon(state.gps._lat, state.gps._lon, state.gps._radius);
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
                    var forget = state.forget || [];
                    state = assign({}, state, {
                        forget: forget.concat(action.pageid),
                    });
                    break;
                case 'setRadius':
                    state = assign({}, state, {
                        options: __assign({}, state.options, { radius: action.radius })
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
            if (stateHash != '{}') {
                console.log('saving state to appState', md5(stateHash));
                store.set('appState', state);
            }
        }
    };
    return ApplicationState;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationState;
