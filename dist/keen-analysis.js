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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
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
/* 2 */
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



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
  globalNS.Promise = _index__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"];
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"];
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 6 */
/***/ (function(module) {

module.exports = {"name":"keen-analysis","version":"3.4.5","description":"A JavaScript client for Keen.IO","main":"dist/node/keen-analysis.js","browser":"dist/keen-analysis.js","scripts":{"start":"NODE_ENV=development webpack-dev-server","test":"NODE_ENV=test jest && npm run test:node","test:node":"NODE_ENV=test TEST_ENV=node jest","test:watch":"NODE_ENV=test jest --watch","test:node:watch":"NODE_ENV=test TEST_ENV=node jest --watch","build":"NODE_ENV=production webpack -p && NODE_ENV=production OPTIMIZE_MINIMIZE=1 webpack -p && npm run build:node && npm run build:modules && npm run build:modules:node","build:node":"TARGET=node NODE_ENV=production webpack -p","build:modules":"NODE_ENV=production webpack -p --config webpack.modules.config.js","build:modules:node":"NODE_ENV=production TARGET=node webpack -p --config webpack.modules.config.js","profile":"webpack --profile --json > stats.json","analyze":"webpack-bundle-analyzer stats.json /dist","preversion":"npm run build:node && npm run test","version":"npm run build && git add .","postversion":"git push && git push --tags && npm publish","demo":"npm run build:node && node ./test/demo/index.node.js"},"repository":{"type":"git","url":"git+https://github.com/keen/keen-analysis.js.git"},"author":"Keen IO <team@keen.io>","homepage":"https://keen.io","contributors":["Dustin Larimer <dustin@keen.io> (https://github.com/dustinlarimer)","Adam Kasprowicz <adam.kasprowicz@keen.io> (https://github.com/adamkasprowicz)","Dariusz Łacheta <dariusz.lacheta@keen.io> (https://github.com/dariuszlacheta)"],"keywords":["Analytics","Analysis","Conversion","Query","Stats","Client","Min","Max","Count","Percentile","Average","Median","Keen","Keen Query"],"license":"MIT","bugs":{"url":"https://github.com/keen/keen-analysis.js/issues"},"dependencies":{"crossfilter2":"^1.4.6","csvtojson":"^2.0.8","handlebars":"^4.1.2","js-yaml":"^3.13.1","keen-core":"^0.2.0","moment":"^2.22.2","promise-polyfill":"^8.0.0","whatwg-fetch":"^2.0.4"},"devDependencies":{"abortcontroller-polyfill":"^1.1.9","babel-loader":"^7.1.4","babel-plugin-transform-es2015-modules-commonjs":"^6.26.2","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-preset-env":"^1.7.0","del":"^2.1.0","eslint":"^4.19.1","eslint-config-airbnb":"^16.1.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.11.0","eslint-plugin-jsx-a11y":"^6.0.3","fake-indexeddb":"^2.0.4","html-loader":"^0.5.5","html-webpack-plugin":"^3.2.0","jest":"^22.4.3","jest-fetch-mock":"^1.6.5","merge":"^1.2.1","nock":"^9.2.6","regenerator-runtime":"^0.11.1","requirejs":"^2.1.22","through2":"^2.0.0","url-parse":"^1.4.3","webpack":"^4.5.0","webpack-bundle-analyzer":"^3.3.2","webpack-cli":"^2.0.13","webpack-dev-server":"^3.1.14","xhr-mock":"^2.3.2"}};

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var each = __webpack_require__(0),
    extend = __webpack_require__(2);

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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


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

/* harmony default export */ __webpack_exports__["a"] = (Promise);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(21).setImmediate))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MD5 = exports.MD5 = function MD5(d) {
  var result = M(V(Y(X(d), 8 * d.length)));return result.toLowerCase();
};function M(d) {
  for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) {
    _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
  }return f;
}function X(d) {
  for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) {
    _[m] = 0;
  }for (m = 0; m < 8 * d.length; m += 8) {
    _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
  }return _;
}function V(d) {
  for (var _ = "", m = 0; m < 32 * d.length; m += 8) {
    _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
  }return _;
}function Y(d, _) {
  d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
    var h = m,
        t = f,
        g = r,
        e = i;f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e);
  }return Array(m, f, r, i);
}function md5_cmn(d, _, m, f, r, i) {
  return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
}function md5_ff(d, _, m, f, r, i, n) {
  return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
}function md5_gg(d, _, m, f, r, i, n) {
  return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
}function md5_hh(d, _, m, f, r, i, n) {
  return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
}function md5_ii(d, _, m, f, r, i, n) {
  return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
}function safe_add(d, _) {
  var m = (65535 & d) + (65535 & _);return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
}function bit_rol(d, _) {
  return d << _ | d >>> 32 - _;
}

exports.default = MD5;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFromCache = exports.saveToCache = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(3);

__webpack_require__(5);

var _md = __webpack_require__(10);

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indexedDBAvailable = 'indexedDB' in self;
var cachingEnabled = true;

if (!indexedDBAvailable) {
  // console.log("Your browser doesn't support a stable version of IndexedDB.");
  cachingEnabled = false; // graceful degradation
}

var db = void 0;
var cacheConfig = {
  dbName: 'keenAnalysisIndexedDB',
  dbCollectionName: 'requests',
  dbCollectionKey: 'url',
  maxAge: 60000
};

function initializeIndexedDb() {
  var requestCacheConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (db) {
    return Promise.resolve();
  }
  if (!cachingEnabled) {
    return Promise.resolve();
  }
  cacheConfig = _extends({}, cacheConfig, requestCacheConfig);
  return new Promise(function (resolve, reject) {
    var dbConnectionRequest = self.indexedDB.open(cacheConfig.dbName);
    dbConnectionRequest.onerror = function (event) {
      cachingEnabled = false;
      resolve();
    };

    dbConnectionRequest.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore(cacheConfig.dbCollectionName, { keyPath: cacheConfig.dbCollectionKey });
      objectStore.createIndex(cacheConfig.dbCollectionKey, cacheConfig.dbCollectionKey, { unique: true });
      objectStore.createIndex('expiryTime', 'expiryTime', { unique: false });
    };

    dbConnectionRequest.onsuccess = function (event) {
      db = event.target.result;
      db.onerror = function (event) {
        cachingEnabled = false; // graceful degradation
      };
      resolve(db);
    };
  });
}

var urlWithBodyHash = function urlWithBodyHash(url, fetchOptions) {
  return (0, _md2.default)(url + '&body=' + JSON.stringify(fetchOptions.body));
};

var saveToCache = exports.saveToCache = function saveToCache(url, fetchOptions, responseJson) {
  return initializeIndexedDb().then(function () {
    var transactionSave = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
    var requestSave = transactionSave.add({
      url: urlWithBodyHash(url, fetchOptions),
      expiryTime: Date.now() + cacheConfig.maxAge,
      responseJson: responseJson
    });
    requestSave.onsuccess = function (event) {};
    requestSave.onerror = function (event) {
      cachingEnabled = false;
    };
  });
};

var getFromCache = exports.getFromCache = function getFromCache(url, fetchOptions) {
  var configOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return initializeIndexedDb(configOptions.cache).then(function () {
    return new Promise(function (resolve, reject) {
      if (!cachingEnabled) {
        return resolve(null);
      }

      var transactionCleanUp = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
      var indexCleanUp = transactionCleanUp.index('expiryTime');
      var upperBoundOpenKeyRange = IDBKeyRange.upperBound(Date.now(), true);
      indexCleanUp.openCursor(upperBoundOpenKeyRange).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          var transactionDelete = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName).delete(event.target.result.value[cacheConfig.dbCollectionKey]);
          cursor.continue();
        }
      };

      var transactionIndex = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
      var index = transactionIndex.index(cacheConfig.dbCollectionKey);
      var responseFromCache = index.get(urlWithBodyHash(url, fetchOptions));
      responseFromCache.onsuccess = function (event) {
        if (!event.target.result || event.target.result.expiryTime < Date.now()) {
          if (event.target.result && event.target.result.expiryTime < Date.now()) {
            var transactionDelete = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName).delete(event.target.result[cacheConfig.dbCollectionKey]);
            transactionDelete.onsuccess = function (event) {
              resolve(getFromCache(url, fetchOptions, configOptions));
            };
            transactionDelete.onerror = function (event) {
              cachingEnabled = false;
              resolve(getFromCache(url, fetchOptions, configOptions));
            };
            return resolve(null);
          }
          return resolve(null);
        } else {
          return resolve(event.target.result.responseJson);
        }
      };
      responseFromCache.onerror = function (event) {
        cachingEnabled = false;
        resolve(getFromCache(url, fetchOptions, configOptions));
      };
    });
  });
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEL = exports.PUT = exports.POST = exports.GET = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(3);

__webpack_require__(5);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _serialize = __webpack_require__(8);

var _serialize2 = _interopRequireDefault(_serialize);

var _cacheBrowser = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendFetch = function sendFetch(method, config) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var headers = {};
  var url = config.url;

  if (method === 'GET' || method === 'DELETE') {
    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }
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

  var fetchOptions = {
    method: method,
    body: method !== 'GET' && config.params ? JSON.stringify(config.params) : undefined,
    mode: 'cors',
    headers: headers
  };

  if (config.cache && method !== 'DELETE' && method !== 'PUT' && !options.notFoundInCache) {
    return (0, _cacheBrowser.getFromCache)(url, fetchOptions, config).then(function (responseJSONFromCache) {
      if (responseJSONFromCache) {
        return options.resolve(responseJSONFromCache);
      }
      sendFetch(method, config, _extends({}, options, { notFoundInCache: true }));
    });
  }

  var apiResponse = void 0;

  fetch(url, _extends({}, fetchOptions, {
    signal: options.signal // abort signal
  })).catch(function (connectionError) {
    options.reject(connectionError);
    return;
  }).then(function (response) {
    if (!response) return;
    apiResponse = response;
    if (response.ok && method === 'DELETE') {
      return {};
    }
    return response.json();
  }).then(function (responseJSON) {
    if (!responseJSON) return;
    if (responseJSON.error_code || !apiResponse.ok) {
      return options.reject({
        ok: false,
        error_code: responseJSON.error_code,
        body: responseJSON.message,
        status: apiResponse.status,
        statusText: apiResponse.statusText
      });
    }
    if (config.cache && method !== 'DELETE' && method !== 'PUT') {
      (0, _cacheBrowser.saveToCache)(url, fetchOptions, responseJSON);
    }
    options.resolve(responseJSON);
  });
};

// XMLHttpRequest Support
// ------------------------------
// DEPRECATED - WILL BE REMOVED
var xhrObject = function xhrObject() {
  var root = window || undefined;
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
};

var sendXhr = function sendXhr(method, config) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var xhr = xhrObject();
  var cb = options.callback;
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
};

// JSON-P Support
// DEPRECATED - WILL BE REMOVED
var sendJsonp = function sendJsonp(config) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var url = config.url;
  var cb = options.callback;
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

  var handleResponse = function handleResponse(a, b) {
    loaded = true;
    if (cb && typeof cb === 'function') {
      cb(a, b);
      cb = void 0;
    }
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch (e) {};
    parent.removeChild(scriptTag);
  };
};

// HTTP Handlers
// ------------------------------

var GET = exports.GET = function GET(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('GET', config, options);
  } else if (xhrObject()) {
    return sendXhr('GET', config, options);
  } else {
    return sendJsonp(config, options);
  }
};

var POST = exports.POST = function POST(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('POST', config, options);
  } else if (xhrObject()) {
    return sendXhr('POST', config, options);
  } else {
    options.reject('XHR POST not supported');
  }
};

var PUT = exports.PUT = function PUT(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('PUT', config, options);
  } else if (xhrObject()) {
    return sendXhr('PUT', config, options);
  } else {
    options.reject('XHR PUT not supported');
  }
};

var DEL = exports.DEL = function DEL(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('DELETE', config, options);
  } else if (xhrObject()) {
    return sendXhr('DELETE', config, options);
  } else {
    options.reject('XHR DELETE not supported');
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Emitter = function () {
  function Emitter() {
    classCallCheck(this, Emitter);

    this.listeners = {};
  }

  createClass(Emitter, [{
    key: 'addEventListener',
    value: function addEventListener(type, callback) {
      if (!(type in this.listeners)) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, callback) {
      if (!(type in this.listeners)) {
        return;
      }
      var stack = this.listeners[type];
      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      var _this = this;

      if (!(event.type in this.listeners)) {
        return;
      }
      var debounce = function debounce(callback) {
        setTimeout(function () {
          return callback.call(_this, event);
        });
      };
      var stack = this.listeners[event.type];
      for (var i = 0, l = stack.length; i < l; i++) {
        debounce(stack[i]);
      }
      return !event.defaultPrevented;
    }
  }]);
  return Emitter;
}();

var AbortSignal = function (_Emitter) {
  inherits(AbortSignal, _Emitter);

  function AbortSignal() {
    classCallCheck(this, AbortSignal);

    var _this2 = possibleConstructorReturn(this, (AbortSignal.__proto__ || Object.getPrototypeOf(AbortSignal)).call(this));

    _this2.aborted = false;
    _this2.onabort = null;
    return _this2;
  }

  createClass(AbortSignal, [{
    key: 'toString',
    value: function toString() {
      return '[object AbortSignal]';
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      if (event.type === 'abort') {
        this.aborted = true;
        if (typeof this.onabort === 'function') {
          this.onabort.call(this, event);
        }
      }

      get(AbortSignal.prototype.__proto__ || Object.getPrototypeOf(AbortSignal.prototype), 'dispatchEvent', this).call(this, event);
    }
  }]);
  return AbortSignal;
}(Emitter);

var AbortController = function () {
  function AbortController() {
    classCallCheck(this, AbortController);

    this.signal = new AbortSignal();
  }

  createClass(AbortController, [{
    key: 'abort',
    value: function abort() {
      var event = void 0;
      try {
        event = new Event('abort');
      } catch (e) {
        if (typeof document !== 'undefined') {
          // For Internet Explorer 11:
          event = document.createEvent('Event');
          event.initEvent('abort', false, false);
        } else {
          // Fallback where document isn't available:
          event = {
            type: 'abort',
            bubbles: false,
            cancelable: false
          };
        }
      }
      this.signal.dispatchEvent(event);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[object AbortController]';
    }
  }]);
  return AbortController;
}();

if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  // These are necessary to make sure that we get correct output for:
  // Object.prototype.toString.call(new AbortController())
  AbortController.prototype[Symbol.toStringTag] = 'AbortController';
  AbortSignal.prototype[Symbol.toStringTag] = 'AbortSignal';
}

/**
 * Note: the "fetch.Request" default value is available for fetch imported from
 * the "node-fetch" package and not in browsers. This is OK since browsers
 * will be importing umd-polyfill.js from that path "self" is passed the
 * decorator so the default value will not be used (because browsers that define
 * fetch also has Request). One quirky setup where self.fetch exists but
 * self.Request does not is when the "unfetch" minimal fetch polyfill is used
 * on top of IE11; for this case the browser will try to use the fetch.Request
 * default value which in turn will be undefined but then then "if (Request)"
 * will ensure that you get a patched fetch but still no Request (as expected).
 * @param {fetch, Request = fetch.Request}
 * @returns {fetch: abortableFetch, Request: AbortableRequest}
 */
function abortableFetchDecorator(patchTargets) {
  if ('function' === typeof patchTargets) {
    patchTargets = { fetch: patchTargets };
  }
  var _patchTargets = patchTargets,
      fetch = _patchTargets.fetch,
      _patchTargets$Request = _patchTargets.Request,
      NativeRequest = _patchTargets$Request === undefined ? fetch.Request : _patchTargets$Request,
      _patchTargets$AbortCo = _patchTargets.AbortController,
      NativeAbortController = _patchTargets$AbortCo === undefined ? AbortController : _patchTargets$AbortCo;


  var Request = NativeRequest;
  // Note that the "unfetch" minimal fetch polyfill defines fetch() without
  // defining window.Request, and this polyfill need to work on top of unfetch
  // so the below feature detection is wrapped in if (Request)
  if (Request) {
    // Do feature detecting
    var controller = new NativeAbortController();
    var signal = controller.signal;
    var request = new Request('/', { signal: signal });

    // Browser already supports abortable fetch (like FF v57 and fetch-polyfill)
    if (request.signal) {
      return { fetch: fetch, Request: Request };
    }

    Request = function Request(input, init) {
      var request = new NativeRequest(input, init);
      if (init && init.signal) {
        request.signal = init.signal;
      }
      return request;
    };
    Request.prototype = NativeRequest.prototype;
  }

  var realFetch = fetch;
  var abortableFetch = function abortableFetch(input, init) {
    var signal = Request && Request.prototype.isPrototypeOf(input) ? input.signal : init ? init.signal : undefined;

    if (signal) {
      var abortError = void 0;
      try {
        abortError = new DOMException('Aborted', 'AbortError');
      } catch (err) {
        // IE 11 does not support calling the DOMException constructor, use a
        // regular error object on it instead.
        abortError = new Error('Aborted');
        abortError.name = 'AbortError';
      }

      // Return early if already aborted, thus avoiding making an HTTP request
      if (signal.aborted) {
        return Promise.reject(abortError);
      }

      // Turn an event into a promise, reject it once `abort` is dispatched
      var cancellation = new Promise(function (_, reject) {
        signal.addEventListener('abort', function () {
          return reject(abortError);
        }, { once: true });
      });

      // Return the fastest promise (don't need to wait for request to finish)
      return Promise.race([cancellation, realFetch(input, init)]);
    }

    return realFetch(input, init);
  };

  return { fetch: abortableFetch, Request: Request };
}

(function (self) {

  if (self.AbortController) {
    return;
  }

  self.AbortController = AbortController;
  self.AbortSignal = AbortSignal;

  if (!self.fetch) {
    console.warn('fetch() is not available, cannot install abortcontroller-polyfill');
    return;
  }

  var _abortableFetch = abortableFetchDecorator(self),
      fetch = _abortableFetch.fetch,
      Request = _abortableFetch.Request;

  self.fetch = fetch;
  self.Request = Request;
})(typeof self !== 'undefined' ? self : global);

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = request;

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(2);

var _extend2 = _interopRequireDefault(_extend);

__webpack_require__(13);

__webpack_require__(3);

var _keysToUnderscore = __webpack_require__(7);

var _package = __webpack_require__(6);

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

    if (requestUrlAndOptions && requestUrlAndOptions.params) {
      requestUrlAndOptions.params = (0, _keysToUnderscore.mapKeysToUnderscore)(requestUrlAndOptions.params);
    }

    if (method === 'DELETE') {
      // handle dated code example from the api reference docs
      var url = requestUrlAndOptions.url;

      var urlWithParams = url;
      var urlParamsString = '';
      var paramKeys = ['filters', 'timeframe', 'timezone'];
      paramKeys.forEach(function (key) {
        if (requestUrlAndOptions[key]) {
          var urlParam = requestUrlAndOptions[key];
          try {
            urlParam = JSON.parse(decodeURIComponent(requestUrlAndOptions[key]));
          } catch (e) {
            urlParam = requestUrlAndOptions[key];
          }
          if (Array.isArray(urlParam)) {
            urlParam = (0, _keysToUnderscore.mapKeysToUnderscore)({ vals: urlParam }).vals;
          } else if (typeof urlParam !== 'string') {
            urlParam = (0, _keysToUnderscore.mapKeysToUnderscore)(urlParam);
          }
          urlParamsString += key + '=' + encodeURIComponent(JSON.stringify(urlParam)) + '&';
        }
      });
      if (urlWithParams.indexOf('?') === -1) {
        urlWithParams += '?';
      }
      urlWithParams += urlParamsString;

      this.config = _extends({
        api_key: undefined,
        params: {},
        method: method,
        headers: {
          'Authorization': requestUrlAndOptions.api_key || requestUrlAndOptions.apiKey,
          'Content-type': 'application/json',
          'keen-sdk': 'javascript-' + _package.version
        }
      }, requestUrlAndOptions, options, {
        url: urlWithParams
      });
      return this.send();
    }

    this.config = _extends({
      api_key: undefined,
      params: {},
      method: method,
      headers: {
        'Authorization': requestUrlAndOptions.api_key || requestUrlAndOptions.apiKey,
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

  if (this.config && !this.config.api_key && !this.config.apiKey) throw new Error('Please provide a valid API key');
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
        response.result = parsedValue;
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function(env){
  var previousKeen = env.Keen || undefined;
  var each = __webpack_require__(0),
      extend = __webpack_require__(2),
      parseParams = __webpack_require__(17),
      serialize = __webpack_require__(8);

  var Emitter = __webpack_require__(16);

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 19 */
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
/* 20 */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1), __webpack_require__(19)))

/***/ }),
/* 21 */
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
__webpack_require__(20);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenAnalysis = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(3);

var _keenCore = __webpack_require__(18);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(0);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(2);

var _extend2 = _interopRequireDefault(_extend);

var _validateAuthCredentials = __webpack_require__(15);

var _keysToUnderscore = __webpack_require__(7);

var _package = __webpack_require__(6);

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

  if ((typeof queryParams === 'undefined' ? 'undefined' : _typeof(queryParams)) === 'object' && (this.config.includeMetadata || this.config.include_metadata)) {
    queryParams.includeMetadata = true;
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenAnalysis = exports.Keen = exports.keenGlobals = undefined;

var _extend = __webpack_require__(2);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(22);

var _index2 = _interopRequireDefault(_index);

var _request = __webpack_require__(14);

var _request2 = _interopRequireDefault(_request);

var _httpBrowser = __webpack_require__(12);

var httpHandlers = _interopRequireWildcard(_httpBrowser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.prototype.get = new _request2.default('GET', httpHandlers);
_index2.default.prototype.post = new _request2.default('POST', httpHandlers);
_index2.default.prototype.put = new _request2.default('PUT', httpHandlers);
_index2.default.prototype.del = new _request2.default('DELETE', httpHandlers);

var keenGlobals = exports.keenGlobals = undefined;
if (typeof webpackKeenGlobals !== 'undefined') {
  exports.keenGlobals = keenGlobals = webpackKeenGlobals;
}

var Keen = exports.Keen = _index2.default.extendLibrary(_index2.default);
var KeenAnalysis = exports.KeenAnalysis = Keen; // backward compatibility - CDN
exports.default = Keen;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(23);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-analysis.js.map