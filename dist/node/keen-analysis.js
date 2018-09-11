(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("keen-core"), require("csvtojson"), require("moment"), require("crossfilter2"));
	else if(typeof define === 'function' && define.amd)
		define(["keen-core", "csvtojson", "moment", "crossfilter2"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("keen-core"), require("csvtojson"), require("moment"), require("crossfilter2")) : factory(root["keen-core"], root["csvtojson"], root["moment"], root["crossfilter2"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__9__, __WEBPACK_EXTERNAL_MODULE__12__, __WEBPACK_EXTERNAL_MODULE__14__, __WEBPACK_EXTERNAL_MODULE__15__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/finally.js
/* harmony default export */ var src_finally = (function(callback) {
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

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/index.js


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

Promise.prototype['finally'] = src_finally;

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

/* harmony default export */ var src = (Promise);

// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/polyfill.js



var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!globalNS.Promise) {
  globalNS.Promise = src;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = src_finally;
}


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var each = __webpack_require__(2),
    extend = __webpack_require__(0);

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
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEL = exports.PUT = exports.POST = exports.GET = undefined;

var _https = __webpack_require__(5);

var _https2 = _interopRequireDefault(_https);

var _url = __webpack_require__(4);

var _url2 = _interopRequireDefault(_url);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _serialize = __webpack_require__(3);

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleRequest = function handleRequest(config) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var parsedUrl = _url2.default.parse(config.url);

  var options = {
    host: parsedUrl['hostname'],
    path: parsedUrl.path,
    method: config['method'],
    headers: config['headers']
  };

  var data = '';

  if (config['method'] === 'GET' || config['method'] === 'DELETE') {
    data = '';
    if (options.path.indexOf('?') === -1) {
      options.path += '?';
    } else {
      options.path += '&';
    }
    options.path += 'api_key=' + config.api_key;
    if (config.params) {
      options.path += '&' + (0, _serialize2.default)(config.params);
    }
  } else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  var req = _https2.default.request(options, function (res) {
    if (options.method === 'DELETE' && res.statusCode === 204) {
      return args.resolve({});
    }
    var body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      var parsedBody = void 0;
      try {
        parsedBody = JSON.parse(body);
      } catch (error) {
        return args.reject(error);
      }
      if (parsedBody.error_code) {
        var error = new Error(parsedBody.message || 'Unknown error occurred');
        error.code = parsedBody.error_code;
        return args.reject(error);
      }
      args.resolve(parsedBody);
    });
  });

  req.on('error', args.reject);
  req.on('abort', function () {
    return req.abort();
  });
  req.write(data);
  req.end();

  return req;
};

var GET = exports.GET = handleRequest;
var POST = exports.POST = handleRequest;
var PUT = exports.PUT = handleRequest;
var DEL = exports.DEL = handleRequest;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ignore polyfills for env Node or Browser


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = request;

var _each = __webpack_require__(2);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

__webpack_require__(7);

__webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function request(method, httpHandlers) {
  this.httpHandlers = httpHandlers;
  return function (requestUrlAndOptions) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof requestUrlAndOptions === 'string') {
      // backward compatibility
      this.config = _extends({
        api_key: undefined,
        method: method,
        params: {},
        url: requestUrlAndOptions,
        headers: {
          'Authorization': '',
          'Content-type': 'application/json'
        }
      }, options);
      return this;
    }

    this.config = _extends({
      api_key: undefined,
      params: {},
      method: method,
      headers: {
        'Authorization': requestUrlAndOptions.api_key,
        'Content-type': 'application/json'
      }
    }, requestUrlAndOptions, options);
    return this.send();
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
  if (obj) {
    this.config.params = obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? obj : {};
  }
  var httpRequestType = this.config['method'];
  if (httpRequestType === 'DELETE') {
    // delete is a reserved word in JS, so to avoid bugs
    httpRequestType = 'DEL';
  }
  var httpHandler = this.httpHandlers[httpRequestType];
  var httpOptions = (0, _extend2.default)({}, this.config);
  var self = this;

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (this.config['method'] !== 'DELETE' && typeof httpOptions.params.analysis_type === 'undefined') {
    if (httpOptions.url.indexOf('/queries/') > -1 && httpOptions.url.indexOf('/saved/') < 0) {
      httpOptions.params.analysis_type = httpOptions.url.split('/queries/').pop();
    }
  }

  var fetchAbortController = void 0;
  if (typeof AbortController !== 'undefined') {
    fetchAbortController = new AbortController();
  }

  var httpHandlerResponse = void 0;
  var requestPromise = new Promise(function (resolve, reject) {
    var options = {};
    if (fetchAbortController) {
      options.signal = fetchAbortController.signal;
    }
    options.resolve = resolve;
    options.reject = reject;
    httpHandlerResponse = httpHandler(httpOptions, options);
    return httpHandlerResponse;
  }).then(function (response) {
    if (httpOptions.params && typeof httpOptions.params.event_collection !== 'undefined' && typeof response.query === 'undefined') {
      return (0, _extend2.default)({ query: httpOptions.params }, response);
    }
    return response;
  });

  requestPromise.abort = function () {
    if (fetchAbortController) {
      // browser
      return fetchAbortController.abort();
    }

    //node
    httpHandlerResponse.emit('abort');
  };

  return requestPromise;
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__9__;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenAnalysis = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(1);

var _keenCore = __webpack_require__(9);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(2);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

_keenCore2.default.prototype.readKey = function (str) {
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

_keenCore2.default.prototype.query = function (a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // a - analysis type or config object
  // b - params
  var analysisType = a;
  var queryParams = b;

  // all this for backward compatibility, remove in next major version
  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && !b) {
    // initialized with signle argument - config object
    var analysisTypeExtracted = a.analysis_type,
        cacheOptionsExtracted = a.cache,
        queryParamsExtracted = _objectWithoutProperties(a, ['analysis_type', 'cache']);

    analysisType = analysisTypeExtracted;
    queryParams = queryParamsExtracted;
    var cacheOptions = this.config.cache;
    if (cacheOptionsExtracted !== undefined) {
      cacheOptions = cacheOptionsExtracted;
    }
    options.cache = cacheOptions;
  }

  // for deprecated queries
  if (options.cache === undefined && this.config.cache) {
    options.cache = _extends({}, this.config.cache);
  }

  // read saved queries - DEPRECATED - to remove
  if (analysisType && queryParams && typeof queryParams === 'string') {
    if (queryParams.indexOf('/result') < 0) {
      queryParams += '/result';
    }
    return this.get({
      url: this.url('queries', analysisType, queryParams),
      api_key: this.config.readKey || this.config.masterKey
    }, options);
  }

  // read saved queries
  else if (queryParams && queryParams.saved_query_name) {
      var savedQueryResultsUrl = queryParams.saved_query_name.indexOf('/result') > -1 ? queryParams.saved_query_name : queryParams.saved_query_name + '/result';
      return this.get({
        url: this.url('queries', 'saved', savedQueryResultsUrl),
        api_key: this.config.readKey || this.config.masterKey
      }, options);
    }

    // cached datasets - DEPRECATED
    else if (analysisType === 'dataset' && (typeof queryParams === 'undefined' ? 'undefined' : _typeof(queryParams)) === 'object') {
        return this.get({
          url: this.url('datasets', queryParams.name, 'results'),
          api_key: this.config.readKey || this.config.masterKey,
          params: queryParams
        }, options);
      } else if (queryParams && queryParams.dataset_name) {
        return this.get({
          url: this.url('datasets', queryParams.dataset_name, 'results'),
          api_key: this.config.readKey || this.config.masterKey,
          params: queryParams
        }, options);
      }

      // standard queries
      else if (analysisType && queryParams && (typeof queryParams === 'undefined' ? 'undefined' : _typeof(queryParams)) === 'object') {
          // Include analysis_type for downstream use
          var queryBodyParams = (0, _extend2.default)({ analysis_type: analysisType }, queryParams);

          // Localize timezone if none is set
          if (!queryBodyParams.timezone) {
            queryBodyParams.timezone = new Date().getTimezoneOffset() * -60;
          }

          return this.post({
            url: this.url('queries', analysisType),
            api_key: this.config.readKey || this.config.masterKey,
            params: queryBodyParams
          }, options);
        } else if (analysisType && typeof analysisType === 'string' && !queryParams) {
          return Promise.reject({
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
    var queryPromise = void 0;
    if (typeof query === 'string') {
      queryPromise = self.query('saved', query + '/result');
    } else if (query instanceof _keenCore2.default.Query) {
      // Include analysis_type for downstream use
      queryPromise = self.query(query.analysis, (0, _extend2.default)({ analysis_type: query.analysis }, query.params), query.options);
    } else {
      queryPromise = query;
    }
    // query.abort = queryPromise.abort;
    promises.push(queryPromise);
  });

  if (promises.length > 1) {
    output = Promise.all(promises);
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

// DEPRECATED
function Query(analysisType) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  this.analysis = analysisType;
  this.params = {};
  -this.set(params);
  this.options = _extends({}, options);
}

Query.prototype.set = function (attributes) {
  // DEPRECATED
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
  // DEPRECATED
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
  // DEPRECATED
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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__12__;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadDataFromFile = undefined;

var _csvtojson = __webpack_require__(12);

var _csvtojson2 = _interopRequireDefault(_csvtojson);

__webpack_require__(1);

var _fs = __webpack_require__(11);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadDataFromFile = exports.loadDataFromFile = function loadDataFromFile(file) {
  var extArr = file.split('.');
  var ext = extArr.pop().toLowerCase();
  var responseBodyMethod = { json: 'json', csv: 'text' }[ext];

  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(file, { encoding: 'utf-8' }, function (err, res) {
      if (err) {
        return reject(err);
      }

      if (ext === 'json') {
        return resolve(res);
      }

      return (0, _csvtojson2.default)().fromString(res).then(function (json) {
        resolve(json);
      });
    });
  });
};

exports.default = loadDataFromFile;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__14__;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__15__;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localQuery = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _crossfilter = __webpack_require__(15);

var _crossfilter2 = _interopRequireDefault(_crossfilter);

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

var _browserLoadDataFromFile = __webpack_require__(13);

var _browserLoadDataFromFile2 = _interopRequireDefault(_browserLoadDataFromFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sharedData = void 0;

var localQuery = function localQuery(query) {
  if (query.debug && !query.startedAt) query.startedAt = Date.now();

  if (!query.data && !query.file) {
    throw 'Specify the source of the data: DATA or FILE';
    return;
  }

  if (query.data && query.file) {
    throw 'Use only one data source: DATA or FILE';
    return;
  }

  if (query.file) {
    return (0, _browserLoadDataFromFile2.default)(query.file).then(function (res) {
      return localQuery(_extends({}, query, {
        file: undefined,
        data: res
      }));
    });
  }

  return new Promise(function (resolve, reject) {
    if (!sharedData) {
      if (!query.data && query.res) {
        throw 'Use query.data instead of query.res property';
        return;
      }
      if (Array.isArray(query.data)) {
        query.data = {
          result: query.data
        };
      }

      if (!Array.isArray(query.data.result)) {
        if (query.data.query && query.data.query.analysis_type !== 'extraction') {
          throw 'Local Query can use only result of an Extraction';
          return;
        }
        throw 'query.data should be an Array';
        return;
      }

      sharedData = query.data.result;
      // don't copy this huge array - just make a reference to it
      // so queries with Intervals don't overload the browser
    }

    var rows = (0, _crossfilter2.default)(sharedData);

    if (query.debug) {
      console.log('! Welcome to the Local Query Experimental Feature !');
      console.log('* Running a local query with:');
      console.log('--', 'Number of events before filtering:', sharedData.length);
      var keysToPrint = ['analysis_type', 'filters', 'timeframe', 'interval', 'group_by', 'order_by', 'limit'];
      keysToPrint.forEach(function (key) {
        console.log('--', key, query[key]);
      });
    }

    query.combinedFilters = [].concat(_toConsumableArray(query.filters || [])) || [];
    query.analysis_type = query.analysis_type || 'extraction';

    var supportedAnalysisTypes = ['extraction', 'count', 'count_unique', 'minimum', 'maximum', 'sum', 'average', 'median', 'percentile', 'select_unique'];
    if (!supportedAnalysisTypes.find(function (item) {
      return item === query.analysis_type;
    })) {
      console.log(query.analysis_type + ' is not supported in the local queries');
      return;
    }

    // to group and be able to sort - we need to create a new dimension
    if (query.order_by && query.order_by.property_name !== 'result' && !query.combinedFilters.find(function (filter) {
      return filter.property_name === query.order_by.property_name;
    })) {
      query.combinedFilters.push({
        property_name: query.order_by.property_name,
        operator: 'true'
      });
    }

    if (query.target_property) {
      query.group_by = query.target_property;
    }

    if (query.group_by) {
      query.combinedFilters.push({
        property_name: query.group_by,
        operator: 'true'
      });
    }

    // TIMEFRAME

    if (!query.timeframe && query.data.query && query.data.query.timeframe) {
      query.timeframe = query.data.query.timeframe;
      // get timeframe from parent query (general results from cache/file)
    }

    var commonTime = Date.now(); // necessary to be able to compare dates

    var parseTimeframe = function parseTimeframe(_ref) {
      var timeframe = _ref.timeframe,
          _ref$returnPartial = _ref.returnPartial,
          returnPartial = _ref$returnPartial === undefined ? false : _ref$returnPartial,
          commonTime = _ref.commonTime;

      if (timeframe.start) {
        // absolute
        return {
          start: _moment2.default.utc(timeframe.start),
          end: _moment2.default.utc(timeframe.end)
        };
      }
      var timeframeParts = timeframe.split('_');
      var dateRelation = timeframeParts[0];
      var unitsNumber = timeframeParts[1];
      var units = timeframeParts[2];
      var unit = units.slice(0, units.length - 1);
      if (!returnPartial) {
        var start = (0, _moment2.default)().startOf(unit).subtract(unitsNumber - 1, units);
        var end = (0, _moment2.default)().startOf(unit);
        if (commonTime) {
          start = _moment2.default.utc(commonTime).subtract(unitsNumber, units);
          end = _moment2.default.utc(commonTime);
        }
        return {
          start: start,
          end: end
        };
      }
      return {
        dateRelation: dateRelation,
        unitsNumber: unitsNumber,
        units: units
      };
    };

    if (query.timeframe) {
      if (
      // check boundries only for data with metadata from a root query
      query.data.query && (parseTimeframe({ timeframe: query.timeframe, commonTime: commonTime }).start < parseTimeframe({ timeframe: query.data.query.timeframe, commonTime: commonTime }).start || parseTimeframe({ timeframe: query.data.query.timeframe, commonTime: commonTime }).end < parseTimeframe({ timeframe: query.timeframe, commonTime: commonTime }).end)) {
        if (query.debug) console.log('Local query\'s timeframe is out of the Root Query timeframe range');
        if (query.onOutOfTimeframeRange) {
          return query.onOutOfTimeframeRange();
        }
      }

      var addTimeframeFilter = function addTimeframeFilter(timeframe) {
        if (timeframe.start) {
          // ABSOLUTE timeframe
          query.combinedFilters.push({
            property_name: 'keen.timestamp',
            operator: 'gte',
            property_value: _moment2.default.utc(timeframe.start)
          });
          query.combinedFilters.push({
            property_name: 'keen.timestamp',
            operator: 'lt',
            property_value: _moment2.default.utc(timeframe.end)
          });
        } else {
          // RELATIVE timeframe
          var timestamp_parts = parseTimeframe({ timeframe: timeframe, returnPartial: true });
          var unit = timestamp_parts.units.slice(0, timestamp_parts.units.length - 1);

          var timestamp_from_value_this = parseTimeframe({ timeframe: timeframe }).start;
          var timestamp_from_value_previous = parseTimeframe({ timeframe: timeframe }).start.startOf(unit);
          if (!query.subquery) {
            timestamp_from_value_previous.subtract(1, timestamp_parts.units);
          }

          var timestamp_to_value_this = (0, _moment2.default)();
          var timestamp_to_value_previous = (0, _moment2.default)().startOf(unit);

          if (timestamp_parts.dateRelation === 'previous') {
            // previous
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'lt',
              property_value: timestamp_to_value_previous
            });
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'gte',
              property_value: timestamp_from_value_previous
            });
          } else {
            // this_
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'lt',
              property_value: timestamp_to_value_this
            });
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'gte',
              property_value: timestamp_from_value_this
            });
          }
        }
      };

      addTimeframeFilter(query.timeframe);

      if (query.rootTimeframe) {
        addTimeframeFilter(query.rootTimeframe);
      }
    }

    // INTERVAL

    var lastRow = sharedData && sharedData[sharedData.length - 1];
    var lastRowTimeStamp = lastRow && lastRow.keen.timestamp;
    var intervalFilters = [];
    if (query.interval) {
      var startTimestamp = query.combinedFilters.find(function (item) {
        return item.property_name === 'keen.timestamp' && item.operator === 'gte';
      }).property_value;
      var endTimestamp = (query.combinedFilters.find(function (item) {
        return item.property_name === 'keen.timestamp' && item.operator === 'lt';
      }) || {}).property_value || _moment2.default.utc(lastRowTimeStamp);

      var currentEndTimestamp = _moment2.default.utc(startTimestamp);
      var currentStartTimestamp = void 0;

      var timestamp_to = parseTimeframe({ timeframe: query.timeframe, returnPartial: true, commonTime: commonTime });

      var intervalToUnits = {
        secondly: 'seconds',
        minutely: 'minutes',
        hourly: 'hours',
        daily: 'days',
        weekly: 'weeks',
        monthly: 'months',
        yearly: 'years'
      };

      var intervalStrParts = query.interval.split('_');
      var units = intervalStrParts[2] || intervalToUnits[query.interval];
      var distance = intervalStrParts[1] || 1;

      var promisesArray = [];
      while (endTimestamp.diff(currentEndTimestamp, 'seconds') > 0) {
        var timeframe = {
          start: currentEndTimestamp.startOf(units).toISOString(),
          end: currentEndTimestamp.add(distance, units).toISOString()
        };
        promisesArray.push(localQuery(_extends({}, query, {
          rootTimeframe: query.timeframe,
          timeframe: _extends({}, timeframe),
          interval: null,
          extendResults: {
            timeframe: _extends({}, timeframe)
          },
          subquery: true,
          debug: false
        })));
      }
      if (query.debug) console.log('** Running ' + promisesArray.length + ' subQueries because of Interval ' + query.interval);
      return Promise.all(promisesArray).then(function (res) {
        var resultToValue = res.map(function (resItem) {
          var result = resItem.result,
              otherKeys = _objectWithoutProperties(resItem, ['result']);
          // Keen's API is responding with key called VALUE instead of RESULT,
          // so we have to map that here


          return _extends({}, otherKeys, { value: result });
        });
        printQueryTime(query);
        return resolve({
          result: resultToValue,
          query: getQueryMetadata(query)
        });
      }).catch(function (err) {
        reject(err);
      });
    }

    if (!query.combinedFilters.length) {
      // we need to specify at least one filter to create a dimension
      query.combinedFilters.push({
        property_name: 'keen.timestamp',
        operator: 'exists',
        property_value: true
      });
    }

    var dimensions = {};

    // get nested Object property accessed by string like someObj.some_property
    var getNestedObject = function getNestedObject(nestedObj, pathArr) {
      return pathArr.reduce(function (obj, key) {
        return obj && obj[key] !== 'undefined' ? obj[key] : undefined;
      }, nestedObj);
    };

    var firstFilter = void 0;
    query.combinedFilters.forEach(function (filter) {
      if (!firstFilter) firstFilter = filter.property_name;
      var keys = filter.property_name.split('.');
      dimensions[filter.property_name] = dimensions[filter.property_name] || [];
      dimensions[filter.property_name].push(rows.dimension(function (d) {
        return getNestedObject(d, keys);
      }));

      // FILTERS

      dimensions[filter.property_name][dimensions[filter.property_name].length - 1].filter(function (d) {
        if (filter.operator === 'eq' && Array.isArray(d)) {
          // mirror the strange API behaviour
          filter.operator = 'eq_in';
          if (query.debug) console.log('Mirror API\'s behaviour - change EQ to EQ_IN');
        }
        switch (filter.operator) {
          case 'eq':
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
            break;
          case 'eq_in':
            if (!d) return false;
            if (Array.isArray(d)) {
              return d.indexOf(filter.property_value) !== -1;
            }
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
            break;
          case 'strict_eq':
            // even if the D value is array
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
            break;
          case 'ne':
            return JSON.stringify(d) !== JSON.stringify(filter.property_value);
            break;
          case 'gt':
            if (filter.property_name === 'keen.timestamp') {
              return (0, _moment2.default)(d).diff(filter.property_value, 'seconds') > 0;
            }
            return d > filter.property_value;
            break;
          case 'gte':
            if (filter.property_name === 'keen.timestamp') {
              return (0, _moment2.default)(d).diff(filter.property_value, 'seconds') >= 0;
            }
            return d >= filter.property_value;
            break;
          case 'lte':
            if (filter.property_name === 'keen.timestamp') {
              return (0, _moment2.default)(d).diff(filter.property_value, 'seconds') <= 0;
            }
            return d <= filter.property_value;
            break;
          case 'lt':
            if (filter.property_name === 'keen.timestamp') {
              return (0, _moment2.default)(d).diff(filter.property_value, 'seconds') < 0;
            }
            return d < filter.property_value;
            break;
          case 'exists':
            return !!d === filter.property_value;
            break;
          case 'in':
            if (!d) return false;
            if (Array.isArray(filter.property_value) && Array.isArray(d)) {
              var found = false;
              filter.property_value.forEach(function (item) {
                if (d.find(function (itemInPropert) {
                  return itemInPropert === item;
                })) {
                  found = true;
                }
              });
              return found;
            }
            if (Array.isArray(filter.property_value)) {
              return filter.property_value.find(function (item) {
                return item === d;
              });
            }
            if (Array.isArray(d)) {
              return d.find(function (item) {
                return item === filter.property_value;
              });
            }
            break;
          case 'contains':
            return d && d.indexOf(filter.property_value) !== -1;
            break;
          case 'not_contains':
            return !d || d.indexOf(filter.property_value) === -1;
            break;
          case 'within':
            reject('not supported operator: within');
            return false; // TODO: geo coordinates
            break;
          default:
            return true;
        }
      });
    });

    if (query.debug) console.log('Dimensions created:', Object.keys(dimensions));

    var result = dimensions[firstFilter][0];

    if (query.group_by) {
      result = dimensions[query.group_by][0].group();
    }

    var limit = query.limit || Infinity;
    var directionMethod = 'top';

    if (query.debug) console.log('Order direction:', { top: 'asc', bottom: 'desc' }[directionMethod], directionMethod);

    var getValueFromNestedKey = function getValueFromNestedKey(_ref2) {
      var row = _ref2.row,
          nestedKey = _ref2.nestedKey;

      if (!row) return undefined;
      var keys = nestedKey.split('.');
      var value = getNestedObject(row, keys);
      if (isNaN(value)) {
        return value;
      }
      return value * 1;
    };
    // ANALYSIS TYPES

    if (query.analysis_type === 'minimum') {
      var resultRow = dimensions[query.group_by][0].bottom(1);
      var value = getValueFromNestedKey({
        row: resultRow[0],
        nestedKey: query.target_property
      });
      var _result = value;
      return resolve(parseLocalResponse({
        result: _result,
        query: query
      }));
    }

    if (query.analysis_type === 'maximum') {
      var _resultRow = dimensions[query.group_by][0].top(1);
      var _value = getValueFromNestedKey({
        row: _resultRow[0],
        nestedKey: query.target_property
      });
      var _result2 = _value;
      return resolve(parseLocalResponse({
        result: _result2,
        query: query
      }));
    }

    if (query.analysis_type === 'sum') {
      var reducer = function reducer() {
        var accumulator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var currentValue = arguments[1];

        return (getValueFromNestedKey({
          row: accumulator,
          nestedKey: query.target_property
        }) || accumulator) + (getValueFromNestedKey({
          row: currentValue,
          nestedKey: query.target_property
        }) || 0);
      };
      var _resultRow2 = dimensions[query.group_by][0].top(Infinity);
      var _result3 = 0;
      if (_resultRow2 && _resultRow2.length) {
        _result3 = _resultRow2.reduce(reducer);
      }
      return resolve(parseLocalResponse({
        result: _result3,
        query: query
      }));
    }

    if (query.analysis_type === 'average') {
      var _reducer = function _reducer() {
        var accumulator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var currentValue = arguments[1];

        return (getValueFromNestedKey({
          row: accumulator,
          nestedKey: query.target_property
        }) || accumulator) + (getValueFromNestedKey({
          row: currentValue,
          nestedKey: query.target_property
        }) || 0);
      };
      var _resultRow3 = dimensions[query.group_by][0].top(Infinity);
      var _result4 = 0;
      if (_resultRow3 && _resultRow3.length) {
        _result4 = _resultRow3.reduce(_reducer) / (_resultRow3.length > 0 && _resultRow3.length || 1);
      }
      return resolve(parseLocalResponse({
        result: _result4,
        query: query
      }));
    }

    if (query.analysis_type === 'median') {
      var _resultRow4 = dimensions[query.target_property][0].top(Infinity);
      var _result5 = 0;
      if (_resultRow4 && _resultRow4.length) {
        var half = Math.floor(_resultRow4.length / 2);
        if (_resultRow4.length % 2) {
          _result5 = getValueFromNestedKey({
            row: _resultRow4[half],
            nestedKey: query.target_property
          });
        } else {
          _result5 = (getValueFromNestedKey({
            row: _resultRow4[half - 1],
            nestedKey: query.target_property
          }) + getValueFromNestedKey({
            row: _resultRow4[half],
            nestedKey: query.target_property
          })) / 2.0;
        }
      }
      return resolve(parseLocalResponse({
        result: _result5,
        query: query
      }));
    }

    if (query.analysis_type === 'percentile') {
      var _resultRow5 = dimensions[query.target_property][0].bottom(Infinity);
      var _result6 = 0;
      if (_resultRow5 && _resultRow5.length) {
        var index = query.percentile / 100 * (_resultRow5.length - 1);
        if (Math.floor(index) === index) {
          _result6 = getValueFromNestedKey({
            row: _resultRow5[index],
            nestedKey: query.target_property
          });
        } else {
          var i = Math.floor(index);
          var fraction = index - i;
          _result6 = getValueFromNestedKey({
            row: _resultRow5[i],
            nestedKey: query.target_property
          }) + (getValueFromNestedKey({
            row: _resultRow5[i + 1],
            nestedKey: query.target_property
          }) - getValueFromNestedKey({
            row: _resultRow5[i],
            nestedKey: query.target_property
          })) * fraction;
        }
      }
      return resolve(parseLocalResponse({
        result: _result6,
        query: query
      }));
    }

    // ORDER BY

    if (query.order_by) {
      var order_by = {
        property_name: query.order_by.property_name || firstFilter,
        direction: query.order_by.direction || 'ASC'
      };
      if (order_by.direction.toLowerCase() === 'asc') {
        directionMethod = 'bottom';
      }
      if (query.group_by) {
        order_by.property_name = 'result';
      }
      if (order_by.property_name === 'result' || order_by.property_name === query.group_by) {
        // group
        if (directionMethod === 'bottom') {
          // fix for the bug of the crossfilter lib
          result = result.top(Infinity);
          return resolve(parseLocalResponse({
            result: result.reverse().slice(0, limit),
            parser: { group_by: query.group_by },
            query: query
          }));
        }
        return resolve(parseLocalResponse({
          result: result[directionMethod](limit),
          parser: { group_by: query.group_by },
          query: query
        }));
      }
      result = dimensions[order_by.property_name][0][directionMethod](limit);
      return resolve(parseLocalResponse({
        result: result,
        query: query
      }));
    }

    return resolve(parseLocalResponse({
      result: result[directionMethod](limit),
      query: query
    }));
  });
};

exports.localQuery = localQuery;
var sortAlpha = function sortAlpha(a, b) {
  var textA = a.toUpperCase();
  var textB = b.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
};

var printQueryTime = function printQueryTime(query) {
  if (query.debug) console.log('** Query time: ', Date.now() - query.startedAt, 'ms');
};

function getQueryMetadata(query) {
  var rootQuery = query && query.data && query.data.query;
  var queryBodyParams = {};
  if (rootQuery) {
    queryBodyParams = _extends({}, rootQuery);
  } else {
    queryBodyParams = {
      analysis_type: query.analysis_type,
      event_collection: query.event_collection,
      timeframe: query.timeframe,
      interval: query.interval
    };
  }
  queryBodyParams.timezone = new Date().getTimezoneOffset() * -60;
  return queryBodyParams;
}

function parseLocalResponse(_ref3) {
  var result = _ref3.result,
      _ref3$parser = _ref3.parser,
      parser = _ref3$parser === undefined ? {} : _ref3$parser,
      _ref3$query = _ref3.query,
      query = _ref3$query === undefined ? {} : _ref3$query;

  query.extendResults = query.extendResults || {};
  if (!query.subquery) {
    query.extendResults.query = getQueryMetadata(query);
  }
  if (!Array.isArray(result)) {
    printQueryTime(query);
    return _extends({
      result: result
    }, query.extendResults);
  }

  var resultParsed = result;
  if (parser.group_by) {
    resultParsed = [];
    var i = 0;
    result.forEach(function (item) {
      var _resultParsed;

      resultParsed[i++] = (_resultParsed = {}, _defineProperty(_resultParsed, parser.group_by, item.key), _defineProperty(_resultParsed, 'result', item.value), _resultParsed);
    });
  }

  if (query.analysis_type === 'count' && !query.group_by) {
    resultParsed = resultParsed.length;
  }

  if (query.analysis_type === 'select_unique') {
    resultParsed = resultParsed.map(function (value) {
      return value[Object.keys(value)[0]];
    });
    if (typeof resultParsed[0] === 'string') {
      resultParsed.sort(sortAlpha);
    } else {
      resultParsed.sort(function (a, b) {
        return a - b;
      });
    }
    if (query.order_by && query.order_by.direction === 'desc') {
      resultParsed = resultParsed.reverse();
    }
  }

  printQueryTime(query);

  return _extends({
    result: resultParsed
  }, query.extendResults);
}

exports.default = localQuery;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keen = exports.localQuery = undefined;

var _localQuery = __webpack_require__(16);

Object.defineProperty(exports, 'localQuery', {
  enumerable: true,
  get: function get() {
    return _localQuery.localQuery;
  }
});

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(10);

var _index2 = _interopRequireDefault(_index);

var _request = __webpack_require__(8);

var _request2 = _interopRequireDefault(_request);

var _httpServer = __webpack_require__(6);

var httpHandlers = _interopRequireWildcard(_httpServer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.prototype.get = new _request2.default('GET', httpHandlers);
_index2.default.prototype.post = new _request2.default('POST', httpHandlers);
_index2.default.prototype.put = new _request2.default('PUT', httpHandlers);
_index2.default.prototype.del = new _request2.default('DELETE', httpHandlers);

var Keen = exports.Keen = _index2.default.extendLibrary(_index2.default);
module.exports = Keen;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-analysis.js.map