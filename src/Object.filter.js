"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * http://stackoverflow.com/questions/5072136/javascript-filter-for-objects
 */
exports.default = Object.filter = function (obj, predicate) {
    var result = {}, key;
    // ---------------^---- as noted by @CMS,
    //      always declare variables with the "var" keyword
    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }
    return result;
};
