/**
 * http://stackoverflow.com/questions/5072136/javascript-filter-for-objects
 */
export default Object.filter = function( obj, predicate) {
	let result = {}, key;
	// ---------------^---- as noted by @CMS,
	//      always declare variables with the "var" keyword

	for (key in obj) {
		if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
			result[key] = obj[key];
		}
	}

	return result;
};
