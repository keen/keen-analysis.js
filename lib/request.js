import Promise from './utils/promise'

import each from 'keen-core/lib/utils/each'
import extend from 'keen-core/lib/utils/extend'
import * as httpHandlers from './utils/http-server'

export var get  = new request('GET')
export var post = new request('POST')
export var put  = new request('PUT')
export var del  = new request('DELETE')

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
