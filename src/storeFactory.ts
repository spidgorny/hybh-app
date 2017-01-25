const redux = require('redux');

import ApplicationState from './ApplicationState';

export default redux.createStore((state, action) => {
	return ApplicationState.manage(state, action);
});

