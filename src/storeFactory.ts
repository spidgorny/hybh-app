const redux = require('redux');

import ApplicationState from './ApplicationState';

let as = new ApplicationState();
let normalStore = redux.createStore((state, action) => {
	return as.manage(state, action);
});

export default normalStore;
