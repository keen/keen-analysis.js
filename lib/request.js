var Promise = require('./utils/promise');

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

  return new Promise(function(resolve, reject, onCancel) {
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
