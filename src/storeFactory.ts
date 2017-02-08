const redux = require('redux');

import ApplicationState from './ApplicationState';

let as = new ApplicationState();
let normalStore = redux.createStore((state, action) => {
	console.warn('redux.createStore', state);
	state = as.manage(state, action);
	console.log(state);
	return state;
});

export default normalStore;
