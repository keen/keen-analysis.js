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

    this.config = {
      api_key : undefined,
      params  : {},
      method,
      headers : {
        'Authorization' : requestUrlAndOptions.api_key,
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
  if (this.config && !this.config.api_key) throw new Error('Please provide valid API key');
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
  .then(response => {
    //Making sure that result is a number when should be
    if(Array.isArray(response.result)){
      if(this.config.params.interval){
        if(this.config.params.group_by){
          //interval and group by result
          response.result.forEach((val) => {
            val.value.forEach((res) => {
              if(!isNaN(Number(res.result))){
                res.result = Number(res.result);
              }
            })
          })
        }
        else {
          //interval result
          response.result.forEach((val) => {
            if(!isNaN(Number(val.value))){
              val.value = Number(val.value);
            }
          })
        }
      }
      else {
        //group by result
        response.result.forEach((res) => {
          if(!isNaN(Number(res.result))){
            res.result = Number(res.result);
          }
        })
      }
    }
    else {
      //simple result
      if(!isNaN(Number(response.result))){
        response.result = Number(response.result);
      }
    }
    //math round values config check
    if(this.config.resultParsers){
      if(Array.isArray(response.result)){
          if(this.config.params.interval){
            if(this.config.params.group_by){
              //interval and group by result
              response.result.forEach((val) => {
                val.value.forEach((res) => {
                  let parsedValue;
                  this.config.resultParsers.forEach((func) => {
                    parsedValue = parsedValue ? func(parsedValue) : func(res.result);
                  })
                  res.result = parsedValue;
                })
              })
            }
            else {
              //interval result
              response.result.forEach((val) => {
                let parsedValue;
                this.config.resultParsers.forEach((func) => {
                  parsedValue = parsedValue ? func(parsedValue) : func(val.value);
                })
                val.value = parsedValue;
              })
            }
          }
          else {
            //group by result
            response.result.forEach((res) => {
              let parsedValue;
              this.config.resultParsers.forEach((func) => {
                parsedValue = parsedValue ? func(parsedValue) : func(res.result);
              })
              res.result = parsedValue;
            })
          }
      } else if (typeof response.result === 'object') {
        Object.keys(response.result).forEach((res) => {
          let parsedValue;
          this.config.resultParsers.forEach((func) => {
            parsedValue = parsedValue ? func(parsedValue) : func(response.result[res]);
          });
          response.result[res] = parsedValue;
        });
      } else {
        //simple result
        let parsedValue;
        this.config.resultParsers.forEach((func) => {
          parsedValue = parsedValue ? func(parsedValue) : func(response.result);
        });
        response.result = parsedValue;
      }
    }
    if (httpOptions.params &&
      typeof httpOptions.params.event_collection !== 'undefined'
      && typeof response.query === 'undefined') {
        return extend({ query: httpOptions.params }, response);
    }
    return response;
  });

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
