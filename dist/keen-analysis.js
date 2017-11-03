(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('keen-core'), require('bluebird/js/browser/bluebird.core'), require('keen-core/lib/utils/each'), require('keen-core/lib/utils/extend'), require('https'), require('url'), require('keen-core/lib/utils/serialize')) :
	typeof define === 'function' && define.amd ? define(['keen-core', 'bluebird/js/browser/bluebird.core', 'keen-core/lib/utils/each', 'keen-core/lib/utils/extend', 'https', 'url', 'keen-core/lib/utils/serialize'], factory) :
	(global['keen-analysis'] = factory(global.KeenLibrary,global.Bluebird,global.each,global.extend,global.https,global.url,global.serialize));
}(this, (function (KeenLibrary,Bluebird,each,extend,https,url,serialize) { 'use strict';

KeenLibrary = KeenLibrary && KeenLibrary.hasOwnProperty('default') ? KeenLibrary['default'] : KeenLibrary;
Bluebird = Bluebird && Bluebird.hasOwnProperty('default') ? Bluebird['default'] : Bluebird;
each = each && each.hasOwnProperty('default') ? each['default'] : each;
extend = extend && extend.hasOwnProperty('default') ? extend['default'] : extend;
https = https && https.hasOwnProperty('default') ? https['default'] : https;
url = url && url.hasOwnProperty('default') ? url['default'] : url;
serialize = serialize && serialize.hasOwnProperty('default') ? serialize['default'] : serialize;

Bluebird.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});

var GET    = handleRequest;
var POST   = handleRequest;
var PUT    = handleRequest;
var DELETE = handleRequest;

function handleRequest(config, callback){
  var parsedUrl = url.parse(config.url),
      data,
      options,
      req;

  options = {
    host: parsedUrl['hostname'],
    path: parsedUrl.path,
    method: config['method'],
    headers: config['headers']
  };

  if (config['method'] === 'GET') {
    data = '';
    options.path += '?api_key=' + config.api_key;
    if (config.params) {
      options.path += '&' + serialize(config.params);
    }
  }
  else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function() {
      var parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (error) {
        return callback(error, null);
      }
      if (parsedBody.error_code) {
        error = new Error(parsedBody.message || 'Unknown error occurred');
        error.code = parsedBody.error_code;
        callback(error, null);
      }
      else {
        callback(null, parsedBody);
      }
    });
  });

  req.on('error', callback);
  req.write(data);
  req.end();
}


var httpHandlers = Object.freeze({
	GET: GET,
	POST: POST,
	PUT: PUT,
	DELETE: DELETE
});

var get  = new request('GET');
var post = new request('POST');
var put  = new request('PUT');
var del  = new request('DELETE');

function request(method){
  return function(str){
    this.config = {
      'api_key' : undefined,
      'method'  : method,
      'params'  : undefined,
      'timeout' : 300 * 1000,
      'url'     : str,
      'headers' : {
        'Authorization' : '',
        'Content-type'  : 'application/json'
      }
    };
    return this;
  }.bind(this);
}

request.prototype.auth = function(str){
  if (typeof str === 'string') {
    this.config.api_key = typeof str === 'string' ? str : undefined;
    this.headers({
      'Authorization': str
    });
  }
  return this;
};

request.prototype.headers = function(obj){
  if (typeof obj === 'object') {
    each(obj, function(value, key){
      this.config['headers'][key] = value;
    }.bind(this));
  }
  return this;
};

request.prototype.timeout = function(num){
  this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
  return this;
};

request.prototype.send = function(obj){
  var httpHandler,
      httpOptions;

  this.config.params = (obj && typeof obj === 'object') ? obj : {};
  httpHandler = httpHandlers[this.config['method']],
  httpOptions = extend({}, this.config);

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (typeof httpOptions.params.analysis_type === 'undefined') {
    if (httpOptions.url.indexOf('/queries/') > -1
      && httpOptions.url.indexOf('/saved/') < 0) {
        httpOptions.params.analysis_type = getAnalysisType(httpOptions.url);
    }
  }

  return new Bluebird(function(resolve, reject, onCancel) {
    var httpRequest = httpHandler(httpOptions, function(err, res){
      var augmentedResponse = res;
      if (err) {
        reject(err);
      }
      else {
        // Append query object to ad-hoc query results
        if (typeof httpOptions.params.event_collection !== 'undefined'
          && typeof res.query === 'undefined') {
            augmentedResponse = extend({ query: httpOptions.params }, res);
        }
        resolve(augmentedResponse);
      }
    });
    onCancel(function(){
      if (httpRequest.abort) {
        httpRequest.abort();
      }
    });
    return httpRequest;
  });
};

function getAnalysisType(str){
  var split = str.split('/queries/');
  return split[split.length-1];
}


var request$1 = Object.freeze({
	get: get,
	post: post,
	put: put,
	del: del
});

extend(KeenLibrary.prototype, request$1);

KeenLibrary.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

KeenLibrary.prototype.query = function(a, b){
  if (a && b && typeof b === 'string') {
    if (b.indexOf('/result') < 0) {
      b += '/result';
    }
    return this
      .get(this.url('queries', a, b))
      .auth(this.readKey())
      .send();
  }
  else if (a === 'dataset' && typeof b === 'object') {
    return this
      .get(this.url('datasets', b.name, 'results'))
      .auth(this.readKey())
      .send(b);
  }
  else if (a && b && typeof b === 'object') {
    // Include analysis_type for downstream use
    var q = extend({ analysis_type: a }, b);
    return this
      .post(this.url('queries', a))
      .auth(this.readKey())
      .send(q);
  }
  else if (a && !b) {
    return Bluebird.reject({
      error_code: 'SDKError',
      message: ".query() called with incorrect arguments"
    });
  }
};

// Keen.Query handler
// --------------------------------
KeenLibrary.Query = Query;

KeenLibrary.prototype.run = function(q, callback){
  var self = this,
      cb = callback,
      queries,
      promises,
      output;

  callback = null;
  queries = q instanceof Array? q : [q];
  promises = [];

  each(queries, function(query, i){
    if (typeof query === 'string') {
      promises.push(self.query('saved', query + '/result'));
    }
    else if (query instanceof KeenLibrary.Query) {
      // Include analysis_type for downstream use
      promises.push(self.query(query.analysis, extend({ analysis_type: query.analysis }, query.params)));
    }
  });

  if (promises.length > 1) {
    output = Bluebird.all(promises);
  }
  else {
    // Only return single
    output = promises[0];
  }

  if (cb) {
    // Manually handle callback, as
    // Promise.nodeify drops nulls
    output.then(function(res){
      cb(null, res);
    });
    output['catch'](function(err){
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

Query.prototype.set = function(attributes) {
  var self = this;
  each(attributes, function(v, k){
    var key = k, value = v;
    if (k.match(new RegExp('[A-Z]'))) {
      key = k.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
    }
    self.params[key] = value;
    if (value instanceof Array) {
      each(value, function(dv, index){
        if (dv instanceof Array == false && typeof dv === 'object') {
          each(dv, function(deepValue, deepKey){
            if (deepKey.match(new RegExp('[A-Z]'))) {
              var _deepKey = deepKey.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
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

Query.prototype.get = function(attribute) {
  var key = attribute;
  if (key.match(new RegExp('[A-Z]'))) {
    key = key.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
  }
  if (this.params) {
    return this.params[key] || null;
  }
};

Query.prototype.addFilter = function(property, operator, value) {
  this.params.filters = this.params.filters || [];
  this.params.filters.push({
    'property_name': property,
    'operator': operator,
    'property_value': value
  });
  return this;
};

return KeenLibrary;

})));
