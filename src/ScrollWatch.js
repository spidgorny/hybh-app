/**
 * Created by DEPIDSVY on 09.02.2017.
 */
"use strict";
var ScrollWatch = (function () {
    function ScrollWatch() {
        var _this = this;
        this.history = [];
        document.addEventListener('beforeunload', function () {
            _this.saveScroll();
        });
        document.addEventListener('popstate', function () {
            _this.restoreScroll();
        });
    }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollWatch;
