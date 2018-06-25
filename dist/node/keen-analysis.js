(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("keen-core"));
	else if(typeof define === 'function' && define.amd)
		define(["keen-core"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("keen-core")) : factory(root["keen-core"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function(__WEBPACK_EXTERNAL_MODULE__7__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
/* 3 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = exports.PUT = exports.POST = exports.GET = undefined;

var _https = __webpack_require__(4);

var _https2 = _interopRequireDefault(_https);

var _url = __webpack_require__(3);

var _url2 = _interopRequireDefault(_url);

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _serialize = __webpack_require__(2);

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GET = exports.GET = handleRequest;
var POST = exports.POST = handleRequest;
var PUT = exports.PUT = handleRequest;
var DELETE = exports.DELETE = handleRequest;

function handleRequest(config, callback) {
  var parsedUrl = _url2.default.parse(config.url);

  var options = {
    host: parsedUrl['hostname'],
    path: parsedUrl.path,
    method: config['method'],
    headers: config['headers']
  };

  var data = '';

  if (config['method'] === 'GET') {
    data = '';
    options.path += '?api_key=' + config.api_key;
    if (config.params) {
      options.path += '&' + (0, _serialize2.default)(config.params);
    }
  } else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  var req = _https2.default.request(options, function (res) {
    if (options.method === 'DELETE' && res.statusCode === 204) {
      return callback(null, {});
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
        return callback(error, null);
      }
      if (parsedBody.error_code) {
        var error = new Error(parsedBody.message || 'Unknown error occurred');
        error.code = parsedBody.error_code;
        callback(error, null);
      } else {
        callback(null, parsedBody);
      }
    });
  });

  req.on('error', callback);
  req.write(data);
  req.end();
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = request;
exports.getAnalysisType = getAnalysisType;

var _each = __webpack_require__(1);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

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
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__7__;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeenAnalysis = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // import Promise from 'promise-polyfill';

//"browsers": ["last 2 versions", "safari >= 7"]


var _keenCore = __webpack_require__(7);

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = __webpack_require__(1);

var _each2 = _interopRequireDefault(_each);

var _extend = __webpack_require__(0);

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
    if (typeof query === 'string') {
      promises.push(self.query('saved', query + '/result'));
    } else if (query instanceof _keenCore2.default.Query) {
      // Include analysis_type for downstream use
      promises.push(self.query(query.analysis, (0, _extend2.default)({ analysis_type: query.analysis }, query.params)));
    }
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keen = undefined;

var _extend = __webpack_require__(0);

var _extend2 = _interopRequireDefault(_extend);

var _index = __webpack_require__(8);

var _index2 = _interopRequireDefault(_index);

var _request = __webpack_require__(6);

var _request2 = _interopRequireDefault(_request);

var _httpServer = __webpack_require__(5);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ })
/******/ ]);
});
//# sourceMappingURL=keen-analysis.js.map