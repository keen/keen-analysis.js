import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'promise-polyfill/src/polyfill';
import { mapKeysToUnderscore } from './utils/keys-to-underscore';

import { version } from '../package.json';

export default function request(method, httpHandlers){
  this.httpHandlers = httpHandlers;
  return function(requestUrlAndOptions, options = {}){
    if (typeof requestUrlAndOptions === 'string') {
      // backward compatibility
      this.config = {
        api_key : undefined,
        method,
        params  : {},
        url: requestUrlAndOptions,
        headers : {
          'Authorization' : '',
          'Content-type'  : 'application/json',
          'keen-sdk': `javascript-${version}`
        },
        ...options
      };
      return this;
    }

    if (requestUrlAndOptions && requestUrlAndOptions.params) {
      requestUrlAndOptions.params = mapKeysToUnderscore(requestUrlAndOptions.params);
    }

    if (method === 'DELETE') {
      // handle dated code example from the api reference docs
      const { url } = requestUrlAndOptions;
      let urlWithParams = url;
      let urlParamsString = '';
      const paramKeys = ['filters', 'timeframe', 'timezone'];
      paramKeys.forEach(key => {
        if (requestUrlAndOptions[key]) {
          let urlParam = requestUrlAndOptions[key];
          try {
            urlParam = JSON.parse(decodeURIComponent(requestUrlAndOptions[key]));
          } catch (e) {
            urlParam = requestUrlAndOptions[key];
          }
          if (Array.isArray(urlParam)) {
            urlParam = mapKeysToUnderscore({ vals: urlParam }).vals;
          }
          else if (typeof urlParam !== 'string') {
            urlParam = mapKeysToUnderscore(urlParam);
          }
          urlParamsString += `${key}=${encodeURIComponent(JSON.stringify(urlParam))}&`;
        }
      });
      if (urlWithParams.indexOf('?') === -1) {
        urlWithParams += '?';
      }
      urlWithParams += urlParamsString;

      this.config = {
        api_key : undefined,
        params  : {},
        method,
        headers : {
          'Authorization' : (requestUrlAndOptions.api_key || requestUrlAndOptions.apiKey),
          'Content-type'  : 'application/json',
          'keen-sdk': `javascript-${version}`
        },
        ...requestUrlAndOptions,
        ...options,
        url: urlWithParams
      };
      return this.send();
    }

    this.config = {
      api_key : undefined,
      params  : {},
      method,
      headers : {
        'Authorization' : (requestUrlAndOptions.api_key || requestUrlAndOptions.apiKey),
        'Content-type'  : 'application/json',
        'keen-sdk': `javascript-${version}`
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
  if (this.config && !this.config.api_key && !this.config.apiKey) throw new Error('Please provide a valid API key');
  if (obj) {
    this.config.params = (obj && typeof obj === 'object') ? mapKeysToUnderscore(obj) : {};
  }
  let httpRequestType = this.config['method'];
  if (httpRequestType === 'DELETE') {
    // delete is a reserved word in JS, so to avoid bugs
    httpRequestType = 'DEL';
  }
  const httpHandler = this.httpHandlers[httpRequestType];
  const httpOptions = extend({}, this.config);
  const self = this;

  // Temporary mod to append analysis_type to responses
  // for generic HTTP requests to known query resources
  if (this.config['method'] !== 'DELETE'
    && typeof httpOptions.params.analysis_type === 'undefined') {
    if (httpOptions.url.indexOf('/queries/') > -1
      && httpOptions.url.indexOf('/saved/') < 0) {
        httpOptions.params.analysis_type =
          httpOptions.url.split('/queries/').pop();
    }
  }

  let fetchAbortController;
  if (typeof AbortController !== 'undefined') {
    fetchAbortController = new AbortController();
  }

  let httpHandlerResponse;
  const requestPromise = new Promise((resolve, reject) => {
    const options = {};
    if (fetchAbortController) {
      options.signal = fetchAbortController.signal;
    }
    options.resolve = resolve;
    options.reject = reject;
    httpHandlerResponse = httpHandler(httpOptions, options);
    return httpHandlerResponse;
  })
  .then(response => response)

  requestPromise.abort = () => {
    if (fetchAbortController) {
      // browser
      return fetchAbortController.abort();
    }

    //node
    httpHandlerResponse.emit('abort');
  }

  return requestPromise;
};
