(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = each;

function each(o, cb, s){
  var n;
  if (!o){
    return 0;
  }
  s = !s ? o : s;
  if (o instanceof Array){
    // Indexed arrays, needed for Safari
    for (n=0; n<o.length; n++) {
      if (cb.call(s, o[n], n, o) === false){
        return 0;
      }
    }
  } else {
    // Hashtables
    for (n in o){
      if (o.hasOwnProperty(n)) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
      }
    }
  }
  return 1;
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = extend;

function extend(target){
  for (var i = 1; i < arguments.length; i++) {
    for (var prop in arguments[i]){
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var each = __webpack_require__(0),
    extend = __webpack_require__(1);

module.exports = serialize;

function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = JSON.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(setImmediate) {/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"];

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Promise);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13).setImmediate))

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = exports.PUT = exports.POST = exports.GET = undefined;

var _promisePolyfill = __webpack_require__(4);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _serialize = __webpack_require__(3);

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GET = exports.GET = get; // import 'whatwg-fetch';
var POST = exports.POST = post;
var PUT = exports.PUT = put;
var DELETE = exports.DELETE = del;

// HTTP Handlers
// ------------------------------

function get(config, callback) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('GET', config, callback);
  } else if (xhrObject()) {
    return sendXhr('GET', config, callback);
  } else if (xdrObject()) {
    return sendXdr('GET', config, callback);
  } else {
    return sendJsonp(config, callback);
  }
}

function post(config, callback) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('POST', config, callback);
  } else if (xhrObject()) {
    return sendXhr('POST', config, callback);
  } else if (xdrObject()) {
    return sendXdr('POST', config, callback);
  } else {
    callback('XHR POST not supported', null);
  }
}

function put(config, callback) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('PUT', config, callback);
  } else if (xhrObject()) {
    return sendXhr('PUT', config, callback);
  } else {
    callback('XHR PUT not supported', null);
  }
}

function del(config, callback) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('DELETE', config, callback);
  } else if (xhrObject()) {
    return sendXhr('DELETE', config, callback);
  } else {
    callback('XHR DELETE not supported', null);
  }
}

function sendFetch(method, config) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var self = this;
  var headers = {};
  var url = config.url;

  if (method == 'GET') {
    url += '?';
    if (config.api_key) {
      url += 'api_key=' + config.api_key + '&';
    }
    if (config.params) {
      url += (0, _serialize2.default)(config.params);
    }
  }

  (0, _each2.default)(config.headers, function (value, key) {
    if (typeof value === 'string') {
      headers[key] = value;
    }
  });

  return fetch(url, {
    method: method,
    body: method !== 'GET' && config.params ? JSON.stringify(config.params) : undefined,
    mode: 'cors',
    headers: headers
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (responseJSON) {
      return _promisePolyfill2.default.reject({
        error_code: responseJSON.error_code,
        body: responseJSON.message,
        status: response.status,
        ok: false,
        statusText: response.statusText
      });
    });
  }).then(function (responseJSON) {
    if (typeof callback !== 'undefined') {
      callback.call(self, null, responseJSON);
    }
    return _promisePolyfill2.default.resolve(responseJSON);
  });
}

// XMLHttpRequest Support
// ------------------------------

function xhrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest && (!root.ActiveXObject || root.location && root.location.protocol && 'file:' !== root.location.protocol)) {
    return new XMLHttpRequest();
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  return false;
}

function sendXhr(method, config, callback) {
  var xhr = xhrObject();
  var cb = callback;
  var url = config.url;

  xhr.onreadystatechange = function () {
    var response = void 0;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.status === 204) {
          if (cb) {
            cb(null, xhr);
          }
        } else {
          try {
            response = JSON.parse(xhr.responseText);
            if (cb && response) {
              cb(null, response);
            }
          } catch (e) {
            if (cb) {
              cb(xhr, null);
            }
          }
        }
      } else {
        try {
          response = JSON.parse(xhr.responseText);
          if (cb && response) {
            cb(response, null);
          }
        } catch (e) {
          if (cb) {
            cb(xhr, null);
          }
        }
      }
    }
  };

  if (method !== 'GET') {
    xhr.open(method, url, true);
    (0, _each2.default)(config.headers, function (value, key) {
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    if (config.params) {
      xhr.send(JSON.stringify(config.params));
    } else {
      xhr.send();
    }
  } else {
    url += '?';
    if (config.api_key) {
      url += 'api_key=' + config.api_key + '&';
    }
    if (config.params) {
      url += (0, _serialize2.default)(config.params);
    }
    xhr.open(method, url, true);
    (0, _each2.default)(config.headers, function (value, key) {
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    xhr.send();
  }

  return xhr;
}

// XDomainRequest Support
// ------------------------------

function xdrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XDomainRequest) {
    return new root.XDomainRequest();
  }
  return false;
}

function sendXdr(method, config, callback) {
  var xdr = xdrObject();
  var cb = callback;

  if (xdr) {
    xdr.timeout = config.timeout || 300 * 1000;

    xdr.ontimeout = function () {
      handleResponse(xdr, null);
    };

    xdr.onerror = function () {
      handleResponse(xdr, null);
    };

    xdr.onload = function () {
      var response = JSON.parse(xdr.responseText);
      handleResponse(null, response);
    };

    xdr.open(method.toLowerCase(), config.url);

    setTimeout(function () {
      if (config['params']) {
        xdr.send((0, _serialize2.default)(config['params']));
      } else {
        xdr.send();
      }
    }, 0);
  }

  function handleResponse(a, b) {
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
  }

  return xdr;
}

// JSON-P Support
// ------------------------------

function sendJsonp(config, callback) {
  var url = config.url;
  var cb = callback;
  var timestamp = new Date().getTime();
  var scriptTag = document.createElement('script');
  var parent = document.getElementsByTagName('head')[0];
  var callbackName = 'keenJSONPCallback';
  var loaded = false;

  callbackName += timestamp;
  while (callbackName in window) {
    callbackName += 'a';
  }

  window[callbackName] = function (response) {
    if (loaded === true) {
      return;
    }
    handleResponse(null, response);
  };

  if (config.params) {
    url += (0, _serialize2.default)(config.params);
  }

  // Early IE (no onerror event)
  scriptTag.onreadystatechange = function () {
    if (loaded === false && this.readyState === 'loaded') {
      handleResponse('An error occurred', null);
    }
  };

  // Not IE
  scriptTag.onerror = function () {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      handleResponse('An error occurred', null);
    }
  };

  scriptTag.src = url + '&jsonp=' + callbackName;
  parent.appendChild(scriptTag);

  function handleResponse(a, b) {
    loaded = true;
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch (e) {};
    parent.removeChild(scriptTag);
  }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = request;
exports.getAnalysisType = getAnalysisType;

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function request(method, httpHandlers) {
  this.httpHandlers = httpHandlers;
  return function (str) {
    this.config = {
      'api_key': undefined,
      'method': method,
      'params': undefined,
      'timeout': 300 * 1000,
      'url': str,
      'headers': {
        'Authorization': '',
        'Content-type': 'application/json'
      }
    };
    return this;
  }.bind(this);
}

request.prototype.auth = function (str) {
  if (typeof str === 'string') {
    this.config.api_key = typeof str === 'string' ? str : undefined;
    this.headers({
      'Authorization': str
    });
  }
  return this;
};

request.prototype.headers = function (obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    (0, _each2.default)(obj, function (value, key) {
      this.config['headers'][key] = value;
    }.bind(this));
  }
  return this;
};

request.prototype.timeout = function (num) {
  this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
  return this;
};

request.prototype.send = function (obj) {
  this.config.params = obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? obj : {};
  var httpHandler = this.httpHandlers[this.config['method']];
  var httpOptions = (0, _extend2.default)({}, this.config);

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (typeof httpOptions.params.analysis_type === 'undefined') {
    if (httpOptions.url.indexOf('/queries/') > -1 && httpOptions.url.indexOf('/saved/') < 0) {
      httpOptions.params.analysis_type = getAnalysisType(httpOptions.url);
    }
  }

  return new Promise(function (resolve, reject, onCancel) {
    var httpRequest = httpHandler(httpOptions, function (err, res) {
      var augmentedResponse = res;
      if (err) {
        reject(err);
      } else {
        // Append query object to ad-hoc query results
        if (typeof httpOptions.params.event_collection !== 'undefined' && typeof res.query === 'undefined') {
          augmentedResponse = (0, _extend2.default)({ query: httpOptions.params }, res);
        }
        resolve(augmentedResponse);
      }
    });
    console.log(onCancel);
    if (onCancel) {
      console.log('ooo');
      onCancel(function () {
        if (httpRequest.abort) {
          httpRequest.abort();
        }
      });
    }
    return httpRequest;
  });
};

function getAnalysisType(str) {
  var split = str.split('/queries/');
  return split[split.length - 1];
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = parseParams;

function parseParams(str){
  // via: http://stackoverflow.com/a/2880929/2511985
  var urlParams = {},
      match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = str.split("?")[1];

  while (!!(match=search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function(env){
  var previousKeen = env.Keen || undefined;
  var each = __webpack_require__(0),
      extend = __webpack_require__(1),
      parseParams = __webpack_require__(9),
      serialize = __webpack_require__(3);

  var Emitter = __webpack_require__(8);

  function Client(props){
    if (this instanceof Client === false) {
      return new Client(props);
    }
    this.configure(props);

    // Set up event handling
    if (Client.debug) {
      this.on('error', Client.log);
    }
    this.emit('ready');
    Client.emit('client', this);
  }

  if (previousKeen && typeof previousKeen.resources === 'undefined') {
    Client.legacyVersion = previousKeen;
  }

  Emitter(Client);
  Emitter(Client.prototype);

  extend(Client, {
    debug: false,
    enabled: true,
    loaded: false,
    version: '__VERSION__'
  });

  // Set or extend helpers
  Client.helpers = Client.helpers || {};

  // Set or extend resources
  Client.resources = Client.resources || {};
  extend(Client.resources, {
    'base'      : '{protocol}://{host}',
    'version'   : '{protocol}://{host}/3.0',
    'projects'  : '{protocol}://{host}/3.0/projects',
    'projectId' : '{protocol}://{host}/3.0/projects/{projectId}',
    'events'    : '{protocol}://{host}/3.0/projects/{projectId}/events',
    'queries'   : '{protocol}://{host}/3.0/projects/{projectId}/queries',
    'datasets'  : '{protocol}://{host}/3.0/projects/{projectId}/datasets'
  });

  // Set or extend utils
  Client.utils = Client.utils || {};
  extend(Client.utils, {
    'each'        : each,
    'extend'      : extend,
    'parseParams' : parseParams,
    'serialize'   : serialize
  });

  Client.extendLibrary = function(target, source) {
    var previous = previousKeen || source;
    if (isDefined(previous) && isDefined(previous.resources)) {
      each(previous, function(value, key) {
        if (typeof value === 'object') {
          target[key] = target[key] || {};
          extend(target[key], value);
        }
        else {
          target[key] = target[key] || value;
        }
      });
      extend(target.prototype, previous.prototype);
    }
    return target;
  };

  Client.log = function(str){
    if (Client.debug && typeof console === 'object') {
      console.log('[Keen]', str);
    }
  };

  Client.noConflict = function(){
    if (typeof env.Keen !== 'undefined') {
      env.Keen = Client.legacyVersion || previousKeen;
    }
    return Client;
  };

  Client.ready = function(fn){
    if (Client.loaded) {
      fn();
    }
    else {
      Client.once('ready', fn);
    }
  };

  Client.prototype.configure = function(obj){
    var config = obj || {};
    this.config = this.config || {
      projectId    : undefined,
      writeKey     : undefined,
      host         : 'api.keen.io',
      protocol     : 'https',
      requestType  : 'jsonp',
      resources    : extend({}, Client.resources)
    };

    // IE<10 request shim
    if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1) {
      config.protocol = document.location.protocol.replace(':', '');
    }

    if (config.host) {
      config.host.replace(/.*?:\/\//g, '');
    }

    extend(this.config, config);
    return this;
  };

  Client.prototype.masterKey = function(str){
    if (!arguments.length) return this.config.masterKey;
    this.config.masterKey = str ? String(str) : null;
    return this;
  };

  Client.prototype.projectId = function(str){
    if (!arguments.length) return this.config.projectId;
    this.config.projectId = (str ? String(str) : null);
    return this;
  };

  Client.prototype.resources = function(obj){
    if (!arguments.length) return this.config.resources;
    var self = this;
    if (typeof obj === 'object') {
      each(obj, function(value, key){
        self.config.resources[key] = (value ? value : null);
      });
    }
    return self;
  };

  Client.prototype.url = function(name){
    var args = Array.prototype.slice.call(arguments, 1),
        baseUrl = this.config.resources.base || '{protocol}://{host}',
        path;

    if (name && typeof name === 'string') {
      if (this.config.resources[name]) {
        path = this.config.resources[name];
      }
      else {
        path = baseUrl + name;
      }
    }
    else {
      path = baseUrl;
    }

    each(this.config, function(value, key){
      if (typeof value !== 'object') {
        path = path.replace('{' + key + '}', value);
      }
    });

    each(args, function(arg, i){
      if (typeof arg === 'string') {
        path += '/' + arg;
      }
      else if (typeof arg === 'object') {
        path += '?';
        each(arg, function(value, key){
          path += key + '=' + value + '&';
        });
        path = path.slice(0, -1);
      }
    });

    return path;
  };

  domReady(function(){
    Client.loaded = true;
    Client.emit('ready');
  });

  function domReady(fn){
    if (Client.loaded || typeof document === 'undefined') {
      fn();
      return;
    }
    // Firefox 3.5 shim
    if(document.readyState == null && document.addEventListener){
      document.addEventListener('DOMContentLoaded', function DOMContentLoaded(){
        document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        document.readyState = 'complete';
      }, false);
      document.readyState = 'loading';
    }
    testDom(fn);
  }

  function testDom(fn){
    if (/in/.test(document.readyState)) {
      setTimeout(function(){
        testDom(fn);
      }, 9);
    }
    else {
      fn();
    }
  }

  function isDefined(target) {
    return typeof target !== 'undefined';
  }

  function isUndefined(target) {
    return typeof target === 'undefined';
  }

  module.exports = Client;

}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(11)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(12);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenAnalysis = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
//"browsers": ["last 2 versions", "safari >= 7"]


var _promisePolyfill = __webpack_require__(4);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _keenCore = __webpack_require__(10);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_keenCore2.default.prototype.readKey = function (str) {
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

_keenCore2.default.prototype.query = function (a, b) {
  if (a && b && typeof b === 'string') {
    if (b.indexOf('/result') < 0) {
      b += '/result';
    }
    return this.get(this.url('queries', a, b)).auth(this.readKey()).send();
  } else if (a === 'dataset' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
    return this.get(this.url('datasets', b.name, 'results')).auth(this.readKey()).send(b);
  } else if (a && b && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
    // Include analysis_type for downstream use
    var q = (0, _extend2.default)({ analysis_type: a }, b);
    return this.post(this.url('queries', a)).auth(this.readKey()).send(q);
  } else if (a && !b) {
    return _promisePolyfill2.default.reject({
      error_code: 'SDKError',
      message: ".query() called with incorrect arguments"
    });
  }
};

// Keen.Query handler
// --------------------------------
_keenCore2.default.Query = Query;

_keenCore2.default.prototype.run = function (q, callback) {
  var self = this;
  var cb = callback;
  var output = void 0;

  var queries = q instanceof Array ? q : [q];
  var promises = [];

  (0, _each2.default)(queries, function (query, i) {
    if (typeof query === 'string') {
      promises.push(self.query('saved', query + '/result'));
    } else if (query instanceof _keenCore2.default.Query) {
      // Include analysis_type for downstream use
      promises.push(self.query(query.analysis, (0, _extend2.default)({ analysis_type: query.analysis }, query.params)));
    }
  });

  if (promises.length > 1) {
    output = _promisePolyfill2.default.all(promises);
  } else {
    // Only return single
    output = promises[0];
  }

  if (cb) {
    // Manually handle callback, as
    // Promise.nodeify drops nulls
    output.then(function (res) {
      cb(null, res);
    });
    output['catch'](function (err) {
      cb(err, null);
    });
  }

  return output;
};

function Query(analysisType, params) {
  this.analysis = analysisType;
  this.params = {};
  this.set(params);

  // Localize timezone if none is set
  if (this.params.timezone === void 0) {
    this.params.timezone = new Date().getTimezoneOffset() * -60;
  }
}

Query.prototype.set = function (attributes) {
  var self = this;
  (0, _each2.default)(attributes, function (v, k) {
    var key = k;
    var value = v;
    if (k.match(new RegExp('[A-Z]'))) {
      key = k.replace(/([A-Z])/g, function ($1) {
        return '_' + $1.toLowerCase();
      });
    }
    self.params[key] = value;
    if (value instanceof Array) {
      (0, _each2.default)(value, function (dv, index) {
        if (dv instanceof Array == false && (typeof dv === 'undefined' ? 'undefined' : _typeof(dv)) === 'object') {
          (0, _each2.default)(dv, function (deepValue, deepKey) {
            if (deepKey.match(new RegExp('[A-Z]'))) {
              var _deepKey = deepKey.replace(/([A-Z])/g, function ($1) {
                return '_' + $1.toLowerCase();
              });
              delete self.params[key][index][deepKey];
              self.params[key][index][_deepKey] = deepValue;
            }
          });
        }
      });
    }
  });
  return self;
};

Query.prototype.get = function (attribute) {
  var key = attribute;
  if (key.match(new RegExp('[A-Z]'))) {
    key = key.replace(/([A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase();
    });
  }
  if (this.params) {
    return this.params[key] || null;
  }
};

Query.prototype.addFilter = function (property, operator, value) {
  this.params.filters = this.params.filters || [];
  this.params.filters.push({
    'property_name': property,
    'operator': operator,
    'property_value': value
  });
  return this;
};

var KeenAnalysis = exports.KeenAnalysis = _keenCore2.default;
exports.default = KeenAnalysis;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keen = undefined;

var _extend = __webpack_require__(1);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _request = __webpack_require__(7);

var _request2 = _interopRequireDefault(_request);

var _httpBrowser = __webpack_require__(6);

var httpHandlers = _interopRequireWildcard(_httpBrowser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.prototype.get = new _request2.default('GET', httpHandlers);
_index2.default.prototype.post = new _request2.default('POST', httpHandlers);
_index2.default.prototype.put = new _request2.default('PUT', httpHandlers);
_index2.default.prototype.del = new _request2.default('DELETE', httpHandlers);

var Keen = exports.Keen = _index2.default.extendLibrary(_index2.default);
exports.default = Keen;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-analysis.js.map