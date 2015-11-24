var Promise = require('bluebird/js/release/promise')();
var each = require('keen-tracking/lib/utils/each'),
    extend = require('keen-tracking/lib/utils/extend'),
    json = require('keen-tracking/lib/utils/json');

var httpHandlers = require('./utils/http-server');

module.exports = {
  'get'  : new Request('GET'),
  'post' : new Request('POST'),
  'put'  : new Request('PUT'),
  'del'  : new Request('DELETE')
};

function Request(method){
  var self;
  if (this instanceof Request === false) {
    return new Request(method);
  }
  this.config = {
    'api_key' : '',
    'method'  : method,
    'params'  : {},
    'url'     : ''
  };

  self = this;
  return function(str){
    self.config.url = str;
    return self;
  }
}

Request.prototype.auth = function(str){
  this.config.api_key = typeof str === 'string' ? str : null;
  return this;
};

Request.prototype.send = function(obj){
  var self, httpHandler, httpOptions;
  this.config.params = typeof obj === 'object' ? obj : {};

  httpHandler = httpHandlers[this.config['method']],
  httpOptions = extend({}, this.config);
  self = this;
  return new Promise(function(resolve, reject) {
    httpHandler.call(self, httpOptions, function(err, res){
      if (err) {
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  });
};
