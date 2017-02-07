(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":9}],3:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":2,"./_getRawTag":6,"./_objectToString":7}],4:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":8}],6:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":2}],7:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],8:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],9:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":4}],10:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],11:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":3,"./_getPrototype":5,"./isObjectLike":10}],12:[function(require,module,exports){
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Geodesy representation conversion functions (c) Chris Veness 2002-2012                        */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var lat = Geo.parseDMS('51° 28′ 40.12″ N');                                                 */
/*    var lon = Geo.parseDMS('000° 00′ 05.31″ W');                                                */
/*    var p1 = new LatLon(lat, lon);                                                              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

(function(root) {
  'use strict';

  var Geo = {};  // Geo namespace, representing static class

  /**
   * Parses string representing degrees/minutes/seconds into numeric degrees
   *
   * This is very flexible on formats, allowing signed decimal degrees, or deg-min-sec optionally
   * suffixed by compass direction (NSEW). A variety of separators are accepted (eg 3º 37' 09"W) 
   * or fixed-width format without separators (eg 0033709W). Seconds and minutes may be omitted. 
   * (Note minimal validation is done).
   *
   * @param   {String|Number} dmsStr: Degrees or deg/min/sec in variety of formats
   * @returns {Number} Degrees as decimal number
   * @throws  {TypeError} dmsStr is an object, perhaps DOM object without .value?
   */
  Geo.parseDMS = function(dmsStr) {
    if (typeof deg == 'object') throw new TypeError('Geo.parseDMS - dmsStr is [DOM?] object');
    
    // check for signed decimal degrees without NSEW, if so return it directly
    if (typeof dmsStr === 'number' && isFinite(dmsStr)) return Number(dmsStr);
    
    // strip off any sign or compass dir'n & split out separate d/m/s
    var dms = String(dmsStr).trim().replace(/^-/,'').replace(/[NSEW]$/i,'').split(/[^0-9.,]+/);
    if (dms[dms.length-1]=='') dms.splice(dms.length-1);  // from trailing symbol
    
    if (dms == '') return NaN;
    
    // and convert to decimal degrees...
    switch (dms.length) {
      case 3:  // interpret 3-part result as d/m/s
        var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; 
        break;
      case 2:  // interpret 2-part result as d/m
        var deg = dms[0]/1 + dms[1]/60; 
        break;
      case 1:  // just d (possibly decimal) or non-separated dddmmss
        var deg = dms[0];
        // check for fixed-width unseparated format eg 0033709W
        //if (/[NS]/i.test(dmsStr)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
        //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600; 
        break;
      default:
        return NaN;
    }
    if (/^-|[WS]$/i.test(dmsStr.trim())) deg = -deg; // take '-', west and south as -ve
    return Number(deg);
  };


  /**
   * Convert decimal degrees to deg/min/sec format
   *  - degree, prime, double-prime symbols are added, but sign is discarded, though no compass
   *    direction is added
   *
   * @private
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
   * @returns {String} deg formatted as deg/min/secs according to specified format
   * @throws  {TypeError} deg is an object, perhaps DOM object without .value?
   */
  Geo.toDMS = function(deg, format, dp) {
    if (typeof deg == 'object') throw new TypeError('Geo.toDMS - deg is [DOM?] object');
    if (isNaN(deg)) return null;  // give up here if we can't make a number from deg
    
      // default values
    if (typeof format == 'undefined') format = 'dms';
    if (typeof dp == 'undefined') {
      switch (format) {
        case 'd': dp = 4; break;
        case 'dm': dp = 2; break;
        case 'dms': dp = 0; break;
        default: format = 'dms'; dp = 0;  // be forgiving on invalid format
      }
    }
    
    deg = Math.abs(deg);  // (unsigned result ready for appending compass dir'n)
    var dms;
    
    switch (format) {
      case 'd':
        d = deg.toFixed(dp);     // round degrees
        if (d<100) d = '0' + d;  // pad with leading zeros
        if (d<10) d = '0' + d;
        dms = d + '\u00B0';      // add º symbol
        break;
      case 'dm':
        var min = (deg*60).toFixed(dp);  // convert degrees to minutes & round
        var d = Math.floor(min / 60);    // get component deg/min
        var m = (min % 60).toFixed(dp);  // pad with trailing zeros
        if (d<100) d = '0' + d;          // pad with leading zeros
        if (d<10) d = '0' + d;
        if (m<10) m = '0' + m;
        dms = d + '\u00B0' + m + '\u2032';  // add º, ' symbols
        break;
      case 'dms':
        var sec = (deg*3600).toFixed(dp);  // convert degrees to seconds & round
        var d = Math.floor(sec / 3600);    // get component deg/min/sec
        var m = Math.floor(sec/60) % 60;
        var s = (sec % 60).toFixed(dp);    // pad with trailing zeros
        if (d<100) d = '0' + d;            // pad with leading zeros
        if (d<10) d = '0' + d;
        if (m<10) m = '0' + m;
        if (s<10) s = '0' + s;
        dms = d + '\u00B0' + m + '\u2032' + s + '\u2033';  // add º, ', " symbols
        break;
    }
    
    return dms;
  };


  /**
   * Convert numeric degrees to deg/min/sec latitude (suffixed with N/S)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toLat = function(deg, format, dp) {
    var lat = Geo.toDMS(deg, format, dp);
    return lat==null ? '–' : lat.slice(1) + (deg<0 ? 'S' : 'N');  // knock off initial '0' for lat!
  };


  /**
   * Convert numeric degrees to deg/min/sec longitude (suffixed with E/W)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toLon = function(deg, format, dp) {
    var lon = Geo.toDMS(deg, format, dp);
    return lon==null ? '–' : lon + (deg<0 ? 'W' : 'E');
  };


  /**
   * Convert numeric degrees to deg/min/sec as a bearing (0º..360º)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toBearing = function(deg, format, dp) {
    deg = (Number(deg)+360) % 360;  // normalise -ve values to 180º..360º
    var brng = Geo.toDMS(deg, format, dp);
    return brng==null ? '–' : brng.replace('360', '0');  // just in case rounding took us up to 360º!
  };


  // Add support for AMD, Node and plain JS
  if (typeof define === 'function' && define.amd) {
      define(Geo);
  } else if (typeof exports === 'object') {
      module.exports = Geo;
  } else {
      root.Geo = Geo;
  }

})(this);

},{}],13:[function(require,module,exports){

'use strict';

var geo = require('mt-geo');
var latlon = require('./mt-latlon')(geo);

module.exports = latlon;

},{"./mt-latlon":14,"mt-geo":12}],14:[function(require,module,exports){
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2012            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var p1 = new LatLon(51.5136, -0.0983);                                                      */
/*    var p2 = new LatLon(51.4778, -0.0015);                                                      */
/*    var dist = p1.distanceTo(p2);          // in km                                             */
/*    var brng = p1.bearingTo(p2);           // in degrees clockwise from north                   */
/*    ... etc                                                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Note that minimal error checking is performed in this example code!                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


(function (root) {
  'use strict';


  var wrapper = function(Geo) {

    /**
     * Creates a point on the earth's surface at the supplied latitude / longitude
     *
     * @constructor
     * @param {Number} lat: latitude in numeric degrees
     * @param {Number} lon: longitude in numeric degrees
     * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
     */
    function LatLon(lat, lon, rad) {
      if (typeof(rad) == 'undefined') rad = 6371;  // earth's mean radius in km
      // only accept numbers or valid numeric strings
      this._lat = typeof(lat)=='number' ? lat : typeof(lat)=='string' && lat.trim()!='' ? +lat : NaN;
      this._lon = typeof(lon)=='number' ? lon : typeof(lon)=='string' && lon.trim()!='' ? +lon : NaN;
      this._radius = typeof(rad)=='number' ? rad : typeof(rad)=='string' && trim(lon)!='' ? +rad : NaN;
    }


    /**
     * Returns the distance from this point to the supplied point, in km
     * (using Haversine formula)
     *
     * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
     *       Sky and Telescope, vol 68, no 2, 1984
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @param   {Number} [precision=4]: no of significant digits to use for returned value
     * @returns {Number} Distance in km between this point and destination point
     */
    LatLon.prototype.distanceTo = function(point, precision) {
      // default 4 sig figs reflects typical 0.3% accuracy of spherical model
      if (typeof precision == 'undefined') precision = 4;

      var R = this._radius;
      var lat1 = toRad(this._lat), lon1 = toRad(this._lon);
      var lat2 = toRad(point._lat), lon2 = toRad(point._lon);
      var dLat = lat2 - lat1;
      var dLon = lon2 - lon1;

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return toPrecisionFixed(d, precision);
    }


    /**
     * Returns the (initial) bearing from this point to the supplied point, in degrees
     *   see http://williams.best.vwh.net/avform.htm#Crs
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {Number} Initial bearing in degrees from North
     */
    LatLon.prototype.bearingTo = function(point) {
      var lat1 = toRad(this._lat), lat2 = toRad(point._lat);
      var dLon = toRad(point._lon-this._lon);

      var y = Math.sin(dLon) * Math.cos(lat2);
      var x = Math.cos(lat1)*Math.sin(lat2) -
              Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
      var brng = Math.atan2(y, x);

      return (toDeg(brng)+360) % 360;
    }


    /**
     * Returns final bearing arriving at supplied destination point from this point; the final bearing
     * will differ from the initial bearing by varying degrees according to distance and latitude
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {Number} Final bearing in degrees from North
     */
    LatLon.prototype.finalBearingTo = function(point) {
      // get initial bearing from supplied point back to this point...
      var lat1 = toRad(point._lat), lat2 = toRad(this._lat);
      var dLon = toRad(this._lon-point._lon);

      var y = Math.sin(dLon) * Math.cos(lat2);
      var x = Math.cos(lat1)*Math.sin(lat2) -
              Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
      var brng = Math.atan2(y, x);

      // ... & reverse it by adding 180°
      return (toDeg(brng)+180) % 360;
    }


    /**
     * Returns the midpoint between this point and the supplied point.
     *   see http://mathforum.org/library/drmath/view/51822.html for derivation
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {LatLon} Midpoint between this point and the supplied point
     */
    LatLon.prototype.midpointTo = function(point) {
      var lat1 = toRad(this._lat), lon1 = toRad(this._lon);
      var lat2 = toRad(point._lat);
      var dLon = toRad(point._lon-this._lon);

      var Bx = Math.cos(lat2) * Math.cos(dLon);
      var By = Math.cos(lat2) * Math.sin(dLon);

      var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2),
                        Math.sqrt( (Math.cos(lat1)+Bx)*(Math.cos(lat1)+Bx) + By*By) );
      var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
      var lon3 = (lon3+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

      return toLatLonDeg(lat3, lon3, this._radius);
    }


    /**
     * Returns the destination point from this point having travelled the given distance (in km) on the
     * given initial bearing (bearing may vary before destination is reached)
     *
     *   see http://williams.best.vwh.net/avform.htm#LL
     *
     * @param   {Number} brng: Initial bearing in degrees
     * @param   {Number} dist: Distance in km
     * @returns {LatLon} Destination point
     */
    LatLon.prototype.destinationPoint = function(brng, dist) {
      dist = typeof(dist)=='number' ? dist : typeof(dist)=='string' && dist.trim()!='' ? +dist : NaN;
      dist = dist/this._radius;  // convert dist to angular distance in radians
      brng = toRad(brng);  //
      var lat1 = toRad(this._lat), lon1 = toRad(this._lon);

      var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) +
                            Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
      var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1),
                                   Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
      lon2 = (lon2+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

      return toLatLonDeg(lat2, lon2, this._radius);
    }


    /**
     * Returns the point of intersection of two paths defined by point and bearing
     *
     *   see http://williams.best.vwh.net/avform.htm#Intersection
     *
     * @param   {LatLon} p1: First point
     * @param   {Number} brng1: Initial bearing from first point
     * @param   {LatLon} p2: Second point
     * @param   {Number} brng2: Initial bearing from second point
     * @returns {LatLon} Destination point (null if no unique intersection defined)
     */
    LatLon.intersection = function(p1, brng1, p2, brng2) {
      brng1 = typeof brng1 == 'number' ? brng1 : typeof brng1 == 'string' && trim(brng1)!='' ? +brng1 : NaN;
      brng2 = typeof brng2 == 'number' ? brng2 : typeof brng2 == 'string' && trim(brng2)!='' ? +brng2 : NaN;
      var lat1 = toRad(p1._lat), lon1 = toRad(p1._lon);
      var lat2 = toRad(p2._lat), lon2 = toRad(p2._lon);
      var brng13 = toRad(brng1), brng23 = toRad(brng2);
      var dLat = lat2-lat1, dLon = lon2-lon1;

      var dist12 = 2*Math.asin( Math.sqrt( Math.sin(dLat/2)*Math.sin(dLat/2) +
        Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)*Math.sin(dLon/2) ) );
      if (dist12 == 0) return null;

      // initial/final bearings between points
      var brngA = Math.acos( ( Math.sin(lat2) - Math.sin(lat1)*Math.cos(dist12) ) /
        ( Math.sin(dist12)*Math.cos(lat1) ) );
      if (isNaN(brngA)) brngA = 0;  // protect against rounding
      var brngB = Math.acos( ( Math.sin(lat1) - Math.sin(lat2)*Math.cos(dist12) ) /
        ( Math.sin(dist12)*Math.cos(lat2) ) );

      var brng12, brng21;
      if (Math.sin(lon2-lon1) > 0) {
        brng12 = brngA;
        brng21 = 2*Math.PI - brngB;
      } else {
        brng12 = 2*Math.PI - brngA;
        brng21 = brngB;
      }

      var alpha1 = (brng13 - brng12 + Math.PI) % (2*Math.PI) - Math.PI;  // angle 2-1-3
      var alpha2 = (brng21 - brng23 + Math.PI) % (2*Math.PI) - Math.PI;  // angle 1-2-3

      if (Math.sin(alpha1)==0 && Math.sin(alpha2)==0) return null;  // infinite intersections
      if (Math.sin(alpha1)*Math.sin(alpha2) < 0) return null;       // ambiguous intersection

      //alpha1 = Math.abs(alpha1);
      //alpha2 = Math.abs(alpha2);
      // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

      var alpha3 = Math.acos( -Math.cos(alpha1)*Math.cos(alpha2) +
                           Math.sin(alpha1)*Math.sin(alpha2)*Math.cos(dist12) );
      var dist13 = Math.atan2( Math.sin(dist12)*Math.sin(alpha1)*Math.sin(alpha2),
                           Math.cos(alpha2)+Math.cos(alpha1)*Math.cos(alpha3) )
      var lat3 = Math.asin( Math.sin(lat1)*Math.cos(dist13) +
                        Math.cos(lat1)*Math.sin(dist13)*Math.cos(brng13) );
      var dLon13 = Math.atan2( Math.sin(brng13)*Math.sin(dist13)*Math.cos(lat1),
                           Math.cos(dist13)-Math.sin(lat1)*Math.sin(lat3) );
      var lon3 = lon1+dLon13;
      lon3 = (lon3+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

      return toLatLonDeg(lat3, lon3, this._radius);
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    /**
     * Returns the distance from this point to the supplied point, in km, travelling along a rhumb line
     *
     *   see http://williams.best.vwh.net/avform.htm#Rhumb
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {Number} Distance in km between this point and destination point
     */
    LatLon.prototype.rhumbDistanceTo = function(point) {
      var R = this._radius;
      var lat1 = toRad(this._lat), lat2 = toRad(point._lat);
      var dLat = toRad(point._lat-this._lat);
      var dLon = toRad(Math.abs(point._lon-this._lon));

      var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
      var q = (isFinite(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0

      // if dLon over 180° take shorter rhumb across anti-meridian:
      if (Math.abs(dLon) > Math.PI) {
        dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
      }

      var dist = Math.sqrt(dLat*dLat + q*q*dLon*dLon) * R;

      return toPrecisionFixed(dist, 4);  // 4 sig figs reflects typical 0.3% accuracy of spherical model
    }

    /**
     * Returns the bearing from this point to the supplied point along a rhumb line, in degrees
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {Number} Bearing in degrees from North
     */
    LatLon.prototype.rhumbBearingTo = function(point) {
      var lat1 = toRad(this._lat), lat2 = toRad(point._lat);
      var dLon = toRad(point._lon-this._lon);

      var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
      if (Math.abs(dLon) > Math.PI) dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
      var brng = Math.atan2(dLon, dPhi);

      return (toDeg(brng)+360) % 360;
    }

    /**
     * Returns the destination point from this point having travelled the given distance (in km) on the
     * given bearing along a rhumb line
     *
     * @param   {Number} brng: Bearing in degrees from North
     * @param   {Number} dist: Distance in km
     * @returns {LatLon} Destination point
     */
    LatLon.prototype.rhumbDestinationPoint = function(brng, dist) {
      var R = this._radius;
      var d = parseFloat(dist)/R;  // d = angular distance covered on earth’s surface
      var lat1 = toRad(this._lat), lon1 = toRad(this._lon);
      brng = toRad(brng);

      var dLat = d*Math.cos(brng);
      // nasty kludge to overcome ill-conditioned results around parallels of latitude:
      if (Math.abs(dLat) < 1e-10) dLat = 0; // dLat < 1 mm

      var lat2 = lat1 + dLat;
      var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
      var q = (isFinite(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
      var dLon = d*Math.sin(brng)/q;

      // check for some daft bugger going past the pole, normalise latitude if so
      if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -Math.PI-lat2;

      var lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;

      return toLatLonDeg(lat2, lon2, this._radius);
    }

    /**
     * Returns the loxodromic midpoint (along a rhumb line) between this point and the supplied point.
     *   see http://mathforum.org/kb/message.jspa?messageID=148837
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @returns {LatLon} Midpoint between this point and the supplied point
     */
    LatLon.prototype.rhumbMidpointTo = function(point) {
      var lat1 = toRad(this._lat), lon1 = toRad(this._lon);
      var lat2 = toRad(point._lat), lon2 = toRad(point._lon);

      if (Math.abs(lon2-lon1) > Math.PI) lon1 += 2*Math.PI; // crossing anti-meridian

      var lat3 = (lat1+lat2)/2;
      var f1 = Math.tan(Math.PI/4 + lat1/2);
      var f2 = Math.tan(Math.PI/4 + lat2/2);
      var f3 = Math.tan(Math.PI/4 + lat3/2);
      var lon3 = ( (lon2-lon1)*Math.log(f3) + lon1*Math.log(f2) - lon2*Math.log(f1) ) / Math.log(f2/f1);

      if (!isFinite(lon3)) lon3 = (lon1+lon2)/2; // parallel of latitude

      var lon3 = (lon3+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

      return toLatLonDeg(lat3, lon3, this._radius);
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


    /**
     * Returns the latitude of this point; signed numeric degrees if no format, otherwise format & dp
     * as per Geo.toLat()
     *
     * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to display
     * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
     */
    LatLon.prototype.lat = function(format, dp) {
      if (typeof format == 'undefined') return this._lat;

      return Geo.toLat(this._lat, format, dp);
    }

    /**
     * Returns the longitude of this point; signed numeric degrees if no format, otherwise format & dp
     * as per Geo.toLon()
     *
     * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to display
     * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
     */
    LatLon.prototype.lon = function(format, dp) {
      if (typeof format == 'undefined') return this._lon;

      return Geo.toLon(this._lon, format, dp);
    }

    /**
     * Returns a string representation of this point; format and dp as per lat()/lon()
     *
     * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to display
     * @returns {String} Comma-separated latitude/longitude
     */
    LatLon.prototype.toString = function(format, dp) {
      if (typeof format == 'undefined') format = 'dms';

      return Geo.toLat(this._lat, format, dp) + ', ' + Geo.toLon(this._lon, format, dp);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    // ---- helper functions for converting degrees/radians

    /** Converts numeric degrees to radians */
    function toRad(value) {
      return value * Math.PI / 180;
    }

    /** Converts radians to numeric (signed) degrees */
    function toDeg(value) {
      return value * 180 / Math.PI;
    }

    /**
     * Formats the significant digits of a number, using only fixed-point notation (no exponential)
     *
     * @param   {Number} value: The number to convert
     * @param   {Number} precision: Number of significant digits to appear in the returned string
     * @returns {String} A string representation of number which contains precision significant digits
     */
    function toPrecisionFixed(value, precision) {
      // use standard toPrecision method
      var n = value.toPrecision(precision);

      // ... but replace +ve exponential format with trailing zeros
      n = n.replace(/(.+)e\+(.+)/, function(n, sig, exp) {
        sig = sig.replace(/\./, '');       // remove decimal from significand
        var l = sig.length - 1;
        while (exp-- > l) sig = sig + '0'; // append zeros from exponent
        return sig;
      });

      // ... and replace -ve exponential format with leading zeros
      n = n.replace(/(.+)e-(.+)/, function(n, sig, exp) {
        sig = sig.replace(/\./, '');       // remove decimal from significand
        while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
        return '0.' + sig;
      });

      return n;
    }

    function toLatLonDeg(latRad, lonRad, radius) {
      return new LatLon(toDeg(latRad), toDeg(lonRad), radius)
    }

    return LatLon;
  };

  // Add support for AMD, Node and plain JS
  if (typeof exports === 'object') {
      module.exports = wrapper;
  } else if (typeof define === 'function' && define.amd) {
      define(wrapper);
  } else {
      root.LatLon = wrapper(Geo);
  }

})(this);

},{}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":18}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],17:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2['default'])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if (process.env.NODE_ENV !== 'production') {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2['default'])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))
},{"./createStore":19,"./utils/warning":21,"_process":1,"lodash/isPlainObject":11}],18:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}
},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
},{"lodash/isPlainObject":11,"symbol-observable":22}],20:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2['default'];
exports.combineReducers = _combineReducers2['default'];
exports.bindActionCreators = _bindActionCreators2['default'];
exports.applyMiddleware = _applyMiddleware2['default'];
exports.compose = _compose2['default'];
}).call(this,require('_process'))
},{"./applyMiddleware":15,"./bindActionCreators":16,"./combineReducers":17,"./compose":18,"./createStore":19,"./utils/warning":21,"_process":1}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],22:[function(require,module,exports){
module.exports = require('./lib/index');

},{"./lib/index":23}],23:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill":24}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],25:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";

var assign = Object.assign;
var ApplicationState = function () {
    function ApplicationState() {}
    ApplicationState.manage = function (state, action) {
        if (state === void 0) {
            state = ApplicationState.initialState;
        }
        console.warn(action);
        switch (action.type) {
            case 'setGPS':
                return assign({}, state, {
                    gps: action.latLon
                });
            case 'setPlaces':
                return assign({}, state, {
                    placesNearby: action.places
                });
        }
        return state;
    };
    return ApplicationState;
}();
ApplicationState.initialState = {
    placesNearby: [],
    gps: null
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationState;

},{}],26:[function(require,module,exports){
// copy/paste from
// https://github.com/hpneo/gmaps/blob/master/lib/gmaps.utils.js
// because npm module is not ready
"use strict";

var GMaps = function () {
    function GMaps() {}
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
        } else {
            options.not_supported();
            if (complete_callback) {
                complete_callback();
            }
        }
    };
    return GMaps;
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GMaps;

},{}],27:[function(require,module,exports){
"use strict";

var GMaps_geolocate_1 = require("./GMaps.geolocate");
//import {LatLon} from 'mt-latlon';
var LatLon = require("mt-latlon");
var LocationService = function () {
    //gmaps: GMaps;
    function LocationService() {
        this.store = require('./storeFactory').default;
        console.log('store', this.store);
        //this.gmaps = new GMaps();
    }
    LocationService.prototype.start = function () {
        console.log('start geolocation');
        GMaps_geolocate_1.default.geolocate({
            success: this.geolocated.bind(this),
            not_supported: this.geoError.bind(this)
        });
    };
    LocationService.prototype.geolocated = function (pos) {
        console.log(pos);
        //			this.lat = pos.coords.latitude;
        //			this.lon = pos.coords.longitude;
        var newLatLon = new LatLon(pos.coords.latitude, pos.coords.longitude);
        this.store.dispatch({
            type: 'setGPS',
            latLon: newLatLon
        });
        if (this.latLon.lat() != newLatLon.lat() || this.latLon.lon() != newLatLon.lon()) {
            var wikipediaURL = this.getWikipediaURL(newLatLon);
            //console.log(wikipediaURL);
            this.fetchJSON(wikipediaURL);
        } else {
            console.log('lat lon is the same');
        }
    };
    LocationService.prototype.getWikipediaURL = function (latLon) {
        return 'https://en.wikipedia.org/w/api.php?action=query&prop=coordinates%7Cpageimages%7Cpageterms%7Cdistance&colimit=50&piprop=thumbnail&pithumbsize=708&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=' + latLon.lat() + '%7C' + latLon.lon() + '&ggsradius=1000&ggslimit=50&format=json&origin=*';
        //+encodeURIComponent('http://localhost:8081');
    };
    LocationService.prototype.fetchJSON = function (url) {
        var _this = this;
        fetch(url, {
            //				mode: 'no-cors',
            cache: 'force-cache',
            headers: {}
        }).then(function (response) {
            return response.text();
            //				return response.json();
        }).then(function (text) {
            return JSON.parse(text);
        }).then(function (json) {
            _this.store.dispatch({
                type: 'setPlaces',
                places: json.query.pages
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    LocationService.prototype.geoError = function () {
        console.log('geolocation is not supported');
    };
    return LocationService;
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocationService;

},{"./GMaps.geolocate":26,"./storeFactory":29,"mt-latlon":13}],28:[function(require,module,exports){
"use strict";

var LocationService_1 = require("./LocationService");
/**
 * This was implemented in order to watch user's location
 * even when the browser is closed. Since SW navigator object
 * does not support GL - we don't need SW.
 */
var ServiceWorker = function () {
    /**
     * Self is a special SW context
     * @param self
     */
    function ServiceWorker(self) {
        var _this = this;
        this.title = 'Have you been here?';
        this.CACHE_NAME = 'my-site-cache-v1';
        this.urlsToCache = [];
        console.log('service worker constructor');
        self.addEventListener('install', function (event) {
            // Perform install steps
            console.log('service worker installed');
            event.waitUntil(caches.open(_this.CACHE_NAME).then(function (cache) {
                console.log('Opened cache');
                //return cache.addAll(this.urlsToCache);
            }));
        });
        // auto cache everything
        // disabled for development
        self.addEventListener('no-fetch', this.cacheAllFetch.bind(this));
        this.ls = new LocationService_1.default();
        self.addEventListener('activate', function (event) {
            console.log('activated');
            //this.notify();
            setInterval(_this.periodicUpdater.bind(_this), 10000);
        });
        this.periodicUpdater();
        self.addEventListener('push', function (event) {
            _this.notify();
            event.waitUntil(function () {
                // Process the event and display a notification.
                //this.notify();
            });
        });
        self.addEventListener('notificationclick', function (event) {
            // Do something with the event
            event.notification.close();
            console.log('clicked');
        });
        self.addEventListener('notificationclose', function (event) {
            // Do something with the event
            console.log('closed');
        });
    }
    ServiceWorker.prototype.notify = function () {
        self.registration.showNotification(this.title, {
            body: 'We found some interesting places nearby Want to see details?',
            icon: 'img/map_blue.png',
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: 'request',
            _actions: [{ action: 'yes', title: 'Yes!', icon: 'images/thumb-up.png' }, { action: 'no', title: 'No', icon: 'images/thumb-down.png' }]
        });
    };
    ServiceWorker.prototype.cacheAllFetch = function (event) {
        var _this = this;
        event.respondWith(caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(function (response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();
                caches.open(_this.CACHE_NAME).then(function (cache) {
                    if (response.method == 'GET') {
                        cache.put(event.request, responseToCache);
                    }
                });
                return response;
            });
        }));
    };
    ServiceWorker.prototype.periodicUpdater = function () {
        console.log('10000 seconds passed');
        this.ls.start();
    };
    return ServiceWorker;
}();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceWorker;

},{"./LocationService":27}],29:[function(require,module,exports){
"use strict";

var redux = require('redux');
var ApplicationState_1 = require("./ApplicationState");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux.createStore(function (state, action) {
    return ApplicationState_1.default.manage(state, action);
});

},{"./ApplicationState":25,"redux":20}],30:[function(require,module,exports){
/// <reference path="typings/index.d.ts" />
/// <reference path="typings/service-worker.d.ts" />
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
"use strict";

var ServiceWorker_1 = require("./src/ServiceWorker");
var sw = new ServiceWorker_1.default(self);

},{"./src/ServiceWorker":28}]},{},[30]);
