import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export default function request(method, httpHandlers){
  this.httpHandlers = httpHandlers;
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
      },
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
  this.config.params = (obj && typeof obj === 'object') ? obj : {};
  const httpHandler = this.httpHandlers[this.config['method']];
  const httpOptions = extend({}, this.config);
  const self = this;

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (typeof httpOptions.params.analysis_type === 'undefined') {
    if (httpOptions.url.indexOf('/queries/') > -1
      && httpOptions.url.indexOf('/saved/') < 0) {
        httpOptions.params.analysis_type = getAnalysisType(httpOptions.url);
    }
  }

  let fetchAbortController;
  if (typeof AbortController !== 'undefined') {
    fetchAbortController = new AbortController();
  }

  let httpHandlerResponse;
  const requestPromise = new Promise(function(resolve, reject) {
    const options = {};
    if (fetchAbortController) {
      options.signal = fetchAbortController.signal;
    }
    options.callback = function(err, res){
      let augmentedResponse = res;
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
    };
    httpHandlerResponse = httpHandler(httpOptions, options);
    return httpHandlerResponse;
  });

  requestPromise.abort = function(){
    if (fetchAbortController) {
      // browser
      return fetchAbortController.abort();
    }

    //node
    httpHandlerResponse.emit('abort');
  }
  return requestPromise;
};

function abortExecutor(){

}

export function getAnalysisType(str){
  const split = str.split('/queries/');
  return split[split.length-1];
}
