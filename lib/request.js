var Promise = require('promise');

var each = require('keen-tracking/lib/utils/each'),
    extend = require('keen-tracking/lib/utils/extend'),
    json = require('keen-tracking/lib/utils/json');

var httpHandlers = require('./utils/http-server');

module.exports = {
  'get'  : request('GET'),
  'post' : request('POST'),
  'put'  : request('PUT'),
  'del'  : request('DELETE')
};

function request(method){
  var self;
  if (this instanceof request === false) {
    return new request(method);
  }
  this.config = {
    'api_key' : '',
    'method'  : method,
    'params'  : undefined,
    'timeout' : 300 * 1000,
    'url'     : ''
  };

  self = this;
  return function(str){
    self.config.url = str;
    return self;
  }
}

request.prototype.auth = function(str){
  this.config.api_key = typeof str === 'string' ? str : null;
  return this;
};

request.prototype.timeout = function(num){
  this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
  return this;
};

request.prototype.send = function(obj){
  var self = this,
      httpHandler,
      httpOptions;

  this.config.params = (obj && typeof obj === 'object') ? obj : undefined;
  httpHandler = httpHandlers[this.config['method']],
  httpOptions = extend({}, this.config);

  return new Promise(function(resolve, reject) {
    httpHandler(httpOptions, function(err, res){
      if (err) {
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  });
};
