"use strict";
var redux = require('redux');
var ApplicationState_1 = require("./ApplicationState");
var as = new ApplicationState_1.default();
var normalStore = redux.createStore(function (state, action) {
    return as.manage(state, action);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = normalStore;
