"use strict";
/**
 * Created by DEPIDSVY on 09.02.2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ScrollWatch = /** @class */ (function () {
    function ScrollWatch(route) {
        this.history = [];
        this.route = route;
    }
    /**
     * we can not distinguish route going back so we don't use
     * automatic saving and restoring.
     * @deprecated
     */
    ScrollWatch.prototype.start = function () {
        // not called because it's SPA
        document.addEventListener('beforeunload', function () {
            // this.saveScroll();
        });
        this.route(function (p1, p2, p3) {
            console.log(p1, p2, p3);
            //this.saveScroll();
        });
        // this runs too early
        window.addEventListener('popstate', function () {
            // this runs too soon, but we will call it manually in mount
            //setTimeout(() => {
            //	this.restoreScroll();
            //}, 10);	// to allow route to mount
        });
    };
    ScrollWatch.prototype.saveScroll = function () {
        this.history.push(window.scrollY);
        console.log('saveScroll', this.history);
    };
    ScrollWatch.prototype.restoreScroll = function () {
        console.log('restoreScroll', this.history);
        if (this.history.length) {
            var scroll_1 = this.history.pop();
            window.scrollTo(0, scroll_1);
        }
    };
    return ScrollWatch;
}());
exports.default = ScrollWatch;
