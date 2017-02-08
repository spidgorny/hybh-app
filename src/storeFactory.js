"use strict";
var redux = require('redux');
var ApplicationState_1 = require("./ApplicationState");
var as = new ApplicationState_1.default();
var normalStore = redux.createStore(function (state, action) {
    console.warn('redux.createStore', state);
    state = as.manage(state, action);
    console.log(state);
    return state;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = normalStore;
