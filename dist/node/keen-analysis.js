(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("keen-core"));
	else if(typeof define === 'function' && define.amd)
		define(["keen-core"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("keen-core")) : factory(root["keen-core"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__12__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
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
/* 2 */
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
/* 3 */
/***/ (function(module) {

module.exports = {"name":"keen-analysis","version":"3.4.1","description":"A JavaScript client for Keen.IO","main":"dist/node/keen-analysis.js","browser":"dist/keen-analysis.js","scripts":{"start":"NODE_ENV=development webpack-dev-server","test":"NODE_ENV=test jest && npm run test:node","test:node":"NODE_ENV=test TEST_ENV=node jest","test:watch":"NODE_ENV=test jest --watch","test:node:watch":"NODE_ENV=test TEST_ENV=node jest --watch","build":"NODE_ENV=production webpack -p && NODE_ENV=production OPTIMIZE_MINIMIZE=1 webpack -p && npm run build:node && npm run build:modules && npm run build:modules:node","build:node":"TARGET=node NODE_ENV=production webpack -p","build:modules":"NODE_ENV=production webpack -p --config webpack.modules.config.js","build:modules:node":"NODE_ENV=production TARGET=node webpack -p --config webpack.modules.config.js","profile":"webpack --profile --json > stats.json","analyze":"webpack-bundle-analyzer stats.json /dist","preversion":"npm run build:node && npm run test","version":"npm run build && git add .","postversion":"git push && git push --tags && npm publish","demo":"npm run build:node && node ./test/demo/index.node.js"},"repository":{"type":"git","url":"git+https://github.com/keen/keen-analysis.js.git"},"author":"Keen IO <team@keen.io>","homepage":"https://keen.io","contributors":["Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)","Adam Kasprowicz <adam.kasprowicz@keen.io> (https://github.com/adamkasprowicz)","Dariusz Łacheta <dariusz.lacheta@keen.io> (https://github.com/dariuszlacheta)"],"keywords":["Analytics","Analysis","Conversion","Query","Stats","Client","Min","Max","Count","Percentile","Average","Median","Keen","Keen Query"],"license":"MIT","bugs":{"url":"https://github.com/keen/keen-analysis.js/issues"},"dependencies":{"crossfilter2":"^1.4.6","csvtojson":"^2.0.8","keen-core":"^0.2.0","moment":"^2.22.2","promise-polyfill":"^8.0.0","whatwg-fetch":"^2.0.4"},"devDependencies":{"abortcontroller-polyfill":"^1.1.9","babel-loader":"^7.1.4","babel-plugin-transform-es2015-modules-commonjs":"^6.26.2","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-preset-env":"^1.7.0","del":"^2.1.0","eslint":"^4.19.1","eslint-config-airbnb":"^16.1.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.11.0","eslint-plugin-jsx-a11y":"^6.0.3","fake-indexeddb":"^2.0.4","html-loader":"^0.5.5","html-webpack-plugin":"^3.2.0","jest":"^22.4.3","jest-fetch-mock":"^1.6.5","merge":"^1.2.1","nock":"^9.2.6","regenerator-runtime":"^0.11.1","requirejs":"^2.1.22","through2":"^2.0.0","url-parse":"^1.4.3","webpack":"^4.5.0","webpack-bundle-analyzer":"^3.3.2","webpack-cli":"^2.0.13","webpack-dev-server":"^3.1.14","xhr-mock":"^2.3.2"}};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.mapKeysToUnderscore = mapKeysToUnderscore;
function mapKeysToUnderscore(obj) {
    var exludedKeys = ['cache'];

    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;

    var keys = Object.keys(obj) || [];
    var convertedObj = {};
    keys.forEach(function (key) {
        var value = obj[key];
        if (exludedKeys.includes(key)) {
            return convertedObj[key] = value;
        }

        if (key.match(new RegExp('[A-Z]'))) {
            key = key.replace(/[A-Z]/g, function (k) {
                return '_' + k.toLowerCase();
            });
        }

        if (Array.isArray(value)) {
            return convertedObj[key] = value.map(function (item) {
                return mapKeysToUnderscore(item);
            });
        }

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            return convertedObj[key] = mapKeysToUnderscore(value);
        }

        convertedObj[key] = value;
    });

    return convertedObj;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var each = __webpack_require__(1),
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
/* 6 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEL = exports.PUT = exports.POST = exports.GET = undefined;

var _https = __webpack_require__(7);

var _https2 = _interopRequireDefault(_https);

var _url = __webpack_require__(6);

var _url2 = _interopRequireDefault(_url);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _serialize = __webpack_require__(5);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ignore polyfills for env Node or Browser


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = request;

var _each = __webpack_require__(1);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

__webpack_require__(9);

__webpack_require__(2);

var _keysToUnderscore = __webpack_require__(4);

var _package = __webpack_require__(3);

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
          'Content-type': 'application/json',
          'keen-sdk': 'javascript-' + _package.version
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
        'Content-type': 'application/json',
        'keen-sdk': 'javascript-' + _package.version
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
  var _this = this;

  if (this.config && !this.config.api_key) throw new Error('Please provide valid API key');
  if (obj) {
    this.config.params = obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? (0, _keysToUnderscore.mapKeysToUnderscore)(obj) : {};
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
    //Making sure that result is a number when should be
    if (Array.isArray(response.result)) {
      if (_this.config.params.interval) {
        if (_this.config.params.group_by) {
          //interval and group by result
          response.result.forEach(function (val) {
            val.value.forEach(function (res) {
              if (!isNaN(Number(res.result))) {
                res.result = Number(res.result);
              }
            });
          });
        } else {
          //interval result
          response.result.forEach(function (val) {
            if (!isNaN(Number(val.value))) {
              val.value = Number(val.value);
            }
          });
        }
      } else {
        //group by result
        response.result.forEach(function (res) {
          if (!isNaN(Number(res.result))) {
            res.result = Number(res.result);
          }
        });
      }
    } else {
      //simple result
      if (!isNaN(Number(response.result))) {
        response.result = Number(response.result);
      }
    }
    //math round values config check
    if (_this.config.resultParsers) {
      if (Array.isArray(response.result)) {
        if (_this.config.params.interval) {
          if (_this.config.params.group_by) {
            //interval and group by result
            response.result.forEach(function (val) {
              val.value.forEach(function (res) {
                var parsedValue = void 0;
                _this.config.resultParsers.forEach(function (func) {
                  parsedValue = parsedValue ? func(parsedValue) : func(res.result);
                });
                res.result = parsedValue;
              });
            });
          } else {
            //interval result
            response.result.forEach(function (val) {
              var parsedValue = void 0;
              _this.config.resultParsers.forEach(function (func) {
                parsedValue = parsedValue ? func(parsedValue) : func(val.value);
              });
              val.value = parsedValue;
            });
          }
        } else {
          //group by result
          response.result.forEach(function (res) {
            var parsedValue = void 0;
            _this.config.resultParsers.forEach(function (func) {
              parsedValue = parsedValue ? func(parsedValue) : func(res.result);
            });
            res.result = parsedValue;
          });
        }
      } else if (_typeof(response.result) === 'object') {
        Object.keys(response.result).forEach(function (res) {
          var parsedValue = void 0;
          _this.config.resultParsers.forEach(function (func) {
            parsedValue = parsedValue ? func(parsedValue) : func(response.result[res]);
          });
          response.result[res] = parsedValue;
        });
      } else {
        //simple result
        var parsedValue = void 0;
        _this.config.resultParsers.forEach(function (func) {
          parsedValue = parsedValue ? func(parsedValue) : func(response.result);
        });
        response.result = func(response.result);
      }
    }
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validateAuthCredentials = validateAuthCredentials;
function validateAuthCredentials(config) {
    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object') return;
    if (!config.projectId) throw new Error('Please provide valid project ID');
    if (!config.masterKey && !config.readKey) throw new Error('Please provide valid API key');
    return true;
}

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
exports.KeenAnalysis = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(2);

var _keenCore = __webpack_require__(12);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(1);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _validateAuthCredentials = __webpack_require__(11);

var _keysToUnderscore = __webpack_require__(4);

var _package = __webpack_require__(3);

var _package2 = _interopRequireDefault(_package);

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

  (0, _validateAuthCredentials.validateAuthCredentials)(this.config);
  // a - analysis type or config object
  // b - params
  var mapObj = {
    a: (0, _keysToUnderscore.mapKeysToUnderscore)(a),
    b: (0, _keysToUnderscore.mapKeysToUnderscore)(b)
  };
  var analysisType = mapObj.a;
  var queryParams = mapObj.b;

  // all this for backward compatibility, remove in next major version
  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && !b) {
    // initialized with single argument - config object
    var _mapObj$a = mapObj.a,
        analysisTypeExtracted = _mapObj$a.analysis_type,
        cacheOptionsExtracted = _mapObj$a.cache,
        queryParamsExtracted = _objectWithoutProperties(_mapObj$a, ['analysis_type', 'cache']);

    analysisType = analysisTypeExtracted;
    queryParams = queryParamsExtracted;
    var cacheOptions = this.config.cache;
    if (cacheOptionsExtracted !== undefined) {
      cacheOptions = cacheOptionsExtracted;
    }
    options.cache = cacheOptions;
  }
  //math round values boolean for request.js
  options.resultParsers = this.config.resultParsers;

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

_keenCore2.default.version = _package2.default.version;

var KeenAnalysis = exports.KeenAnalysis = _keenCore2.default;
exports.default = KeenAnalysis;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keen = undefined;

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(13);

var _index2 = _interopRequireDefault(_index);

var _request = __webpack_require__(10);

var _request2 = _interopRequireDefault(_request);

var _httpServer = __webpack_require__(8);

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-analysis.js.map