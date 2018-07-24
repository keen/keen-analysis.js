import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export default function request(method, httpHandlers){
  this.httpHandlers = httpHandlers;
  return function(requestUrlAndOptions, options = {}){
    if (typeof requestUrlAndOptions === 'string') {
      // backward compatibility
      this.config = {
        api_key : undefined,
        method  : method,
        params  : {},
        timeout : 300 * 1000, // fetch api doesn't support timeouts
        url: requestUrlAndOptions,
        headers : {
          'Authorization' : '',
          'Content-type'  : 'application/json'
        },
        ...options
      };
      return this;
    }

    this.config = {
      api_key : undefined,
      params  : {},
      method  : method,
      headers : {
        'Authorization' : requestUrlAndOptions.api_key,
        'Content-type'  : 'application/json'
      },
      ...requestUrlAndOptions,
      ...options
    };
    return this.send();
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
  if (obj) {
    this.config.params = (obj && typeof obj === 'object') ? obj : {};
  }
  const httpHandler = this.httpHandlers[this.config['method']];
  const httpOptions = extend({}, this.config);
  const self = this;

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (this.config['method'] !== 'DELETE'
    && typeof httpOptions.params.analysis_type === 'undefined') {
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
        if (httpOptions.params &&
          typeof httpOptions.params.event_collection !== 'undefined'
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

export function getAnalysisType(str){
  const split = str.split('/queries/');
  return split[split.length-1];
}
