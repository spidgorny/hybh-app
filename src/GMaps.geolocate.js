// copy/paste from
// https://github.com/hpneo/gmaps/blob/master/lib/gmaps.utils.js
// because npm module is not ready
"use strict";
var GMaps = (function () {
    function GMaps() {
    }
    GMaps.geolocate = function (options) {
        var complete_callback = options.always || options.complete;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                options.success(position);
                if (complete_callback) {
                    complete_callback();
                }
            }, function (error) {
                options.error(error);
                if (complete_callback) {
                    complete_callback();
                }
            }, options.options);
        }
        else {
            options.not_supported();
            if (complete_callback) {
                complete_callback();
            }
        }
    };
    return GMaps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GMaps;
