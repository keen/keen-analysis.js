import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import each from 'keen-core/lib/utils/each';
import serialize from 'keen-core/lib/utils/serialize';

export const GET = get;
export const POST = post;
export const PUT = put;
export const DELETE = del;

// HTTP Handlers
// ------------------------------

function get(config, options){
  if (typeof fetch !== 'undefined') {
    return sendFetch('GET', config, options);
  }
  else if (xhrObject()) {
    return sendXhr('GET', config, options);
  }
  else if (xdrObject()){
    return sendXdr('GET', config, options);
  }
  else {
    return sendJsonp(config, options);
  }
}

function post(config, options){
  if (typeof fetch !== 'undefined') {
    return sendFetch('POST', config, options);
  }
  else if (xhrObject()) {
    return sendXhr('POST', config, options);
  }
  else if (xdrObject()){
    return sendXdr('POST', config, options);
  }
  else {
    options.callback('XHR POST not supported', null);
  }
}

function put(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('PUT', config, options);
  }
  else if (xhrObject()) {
    return sendXhr('PUT', config, options);
  }
  else {
    options.callback('XHR PUT not supported', null);
  }
}

function del(config, options) {
  if (typeof fetch !== 'undefined') {
    return sendFetch('DELETE', config, options);
  }
  else if (xhrObject()) {
    return sendXhr('DELETE', config, options);
  }
  else {
    options.callback('XHR DELETE not supported', null);
  }
}

function sendFetch(method, config, options = {}){
  const headers = {};
  let url = config.url;

  if (method == 'GET') {
    url += '?';
    if (config.api_key) {
      url += 'api_key=' + config.api_key + '&';
    }
    if (config.params) {
      url += serialize(config.params);
    }
  }

  each(config.headers, function(value, key){
    if (typeof value === 'string') {
      headers[key] = value;
    }
  });

  return fetch(url, {
      method,
      body: (method !== 'GET' && config.params) ? JSON.stringify(config.params) : undefined,
      mode: 'cors',
      headers,
      signal: options.signal
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then(responseJSON => {
        return Promise.reject({
          error_code: responseJSON.error_code,
          body: responseJSON.message,
          status: response.status,
          ok: false,
          statusText: response.statusText
        });
      });
    }).then(responseJSON => {
      if (typeof options.callback !== 'undefined') {
        options.callback.call(self, null, responseJSON);
      }
      return Promise.resolve(responseJSON);
    });
}

// XMLHttpRequest Support
// ------------------------------

function xhrObject() {
  const root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest &&
       (
         !root.ActiveXObject ||
         (root.location && root.location.protocol
           && 'file:' !== root.location.protocol)
       )
  ) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

function sendXhr(method, config, options = {}){
  const xhr = xhrObject();
  const cb = options.callback;
  let url = config.url;

  xhr.onreadystatechange = function() {
    let response;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.status === 204) {
          if (cb) {
            cb(null, xhr);
          }
        }
        else {
          try {
            response = JSON.parse( xhr.responseText );
            if (cb && response) {
              cb(null, response);
            }
          }
          catch (e) {
            if (cb) {
              cb(xhr, null);
            }
          }
        }
      }
      else {
        try {
          response = JSON.parse( xhr.responseText );
          if (cb && response) {
            cb(response, null);
          }
        }
        catch (e) {
          if (cb) {
            cb(xhr, null);
          }
        }
      }
    }
  };

  if (method !== 'GET') {
    xhr.open(method, url, true);
    each(config.headers, function(value, key){
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    if (config.params) {
      xhr.send( JSON.stringify(config.params) );
    }
    else {
      xhr.send();
    }
  }
  else {
    url += '?';
    if (config.api_key) {
      url += 'api_key=' + config.api_key + '&';
    }
    if (config.params) {
      url += serialize(config.params);
    }
    xhr.open(method, url, true);
    each(config.headers, function(value, key){
      if (typeof value === 'string') {
        xhr.setRequestHeader(key, value);
      }
    });
    xhr.send();
  }

  return xhr;
}


// XDomainRequest Support
// ------------------------------

function xdrObject() {
  const root = 'undefined' == typeof window ? this : window;
  if (root.XDomainRequest) {
    return new root.XDomainRequest();
  }
  return false;
}

function sendXdr(method, config, options = {}) {
  const xdr = xdrObject();
  let cb = options.callback;

  if (xdr) {
    xdr.timeout = config.timeout || 300 * 1000;

    xdr.ontimeout = function () {
      handleResponse(xdr, null);
    };

    xdr.onerror = function () {
      handleResponse(xdr, null);
    };

    xdr.onload = function() {
      var response = JSON.parse(xdr.responseText);
      handleResponse(null, response);
    };

    xdr.open(method.toLowerCase(), config.url);

    setTimeout(function () {
      if (config['params']) {
        xdr.send( serialize(config['params']) );
      }
      else {
        xdr.send();
      }
    }, 0);
  }

  function handleResponse(a, b){
    if (cb && typeof cb === 'function') {
      cb(a, b);
      cb = void 0;
    }
  }

  return xdr;
}


// JSON-P Support
// ------------------------------

function sendJsonp(config, options = {}){
  let url = config.url;
  let cb = options.callback;
  const timestamp = new Date().getTime();
  const scriptTag = document.createElement('script');
  const parent = document.getElementsByTagName('head')[0];
  let callbackName = 'keenJSONPCallback';
  let loaded = false;

  callbackName += timestamp;
  while (callbackName in window) {
    callbackName += 'a';
  }

  window[callbackName] = function(response) {
    if (loaded === true) {
      return;
    }
    handleResponse(null, response);
  };

  if (config.params) {
    url += serialize(config.params);
  }

  // Early IE (no onerror event)
  scriptTag.onreadystatechange = function() {
    if (loaded === false && this.readyState === 'loaded') {
      handleResponse('An error occurred', null);
    }
  };

  // Not IE
  scriptTag.onerror = function() {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      handleResponse('An error occurred', null);
    }
  };

  scriptTag.src = url + '&jsonp=' + callbackName;
  parent.appendChild(scriptTag);

  function handleResponse(a, b){
    loaded = true;
    if (cb && typeof cb === 'function') {
      cb(a, b);
      cb = void 0;
    }
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch(e){};
    parent.removeChild(scriptTag);
  }

}
