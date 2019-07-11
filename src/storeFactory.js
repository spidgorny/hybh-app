"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux = require('redux');
const ApplicationState_1 = require("./ApplicationState");
let as = new ApplicationState_1.default();
let normalStore = redux.createStore((state, action) => {
    //console.warn('redux.createStore', state);
    state = as.manage(state, action);
    //console.log(state);
    return state;
});
exports.default = normalStore;
