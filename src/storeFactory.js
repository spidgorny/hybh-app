"use strict";
var redux = require('redux');
var ApplicationState_1 = require('./ApplicationState');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux.createStore(function (state, action) {
    return ApplicationState_1.default.manage(state, action);
});
