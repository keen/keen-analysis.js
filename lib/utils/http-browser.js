module.exports = {
  'GET'    : get,
  'POST'   : post,
  'PUT'    : put,
  'DELETE' : del
};


// HTTP Handlers
// ------------------------------

function get(config, callback){
  if (xhrObject()) {
    return sendXhr('GET', config, callback);
  }
  else if (xdrObject()){
    return sendXdr('GET', config, callback);
  }
  else {
    return sendJsonp(config, callback);
  }
}

function post(config, callback){
  if (xhrObject()) {
    return sendXhr('POST', config, callback);
  }
  else if (xdrObject()){
    return sendXdr('POST', config, callback);
  }
  else {
    callback('XHR POST not supported', null);
  }
}

function put(config, callback) {
  if (xhrObject()) {
    return sendXhr('PUT', config, callback);
  }
  else {
    callback('XHR PUT not supported', null);
  }
}

function del(config, callback) {
  if (xhrObject()) {
    return sendXhr('DELETE', config, callback);
  }
  else {
    callback('XHR DELETE not supported', null);
  }
}


// XMLHttpRequest Support
// ------------------------------

function xhrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XMLHttpRequest && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

function sendXhr(method, config, callback){
  var xhr = xhrObject(),
      cb = callback,
      payload;

  callback = null;

  xhr.onreadystatechange = function() {
    var response;
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          response = json.parse( xhr.responseText );
        } catch (e) {
          if (cb) {
            cb(xhr, null);
          }
        }
        if (cb && response) {
          cb(null, response);
        }
      }
      else {
        if (cb) {
          cb(xhr, null);
        }
      }
    }
  };

  xhr.open(config['method'], config.url, true);
  xhr.setRequestHeader('Authorization', config.api_key);
  xhr.setRequestHeader('Content-Type', 'application/json');

  if (config['data']) {
    payload = serialize(config['data']);
  }

  if (method.toUpperCase() !== 'GET' && payload) {
    xhr.send(payload);
  }
  else {
    xhr.send();
  }

}


// XDomainRequest Support
// ------------------------------

function xdrObject() {
  var root = 'undefined' == typeof window ? this : window;
  if (root.XDomainRequest) {
    return new root.XDomainRequest();
  }
  return false;
}

function sendXdr(method, config, callback) {
  var xdr = xdrObject(),
      cb = callback,
      payload;

  if (xdr) {
    xdr.timeout = config.timeout || 300 * 1000;

    xdr.ontimeout = function () {
      handleResponse(xdr, null);
    };

    xdr.onerror = function () {
      handleResponse(xdr, null);
    };

    xdr.onload = function() {
      var response = json.parse(xdr.responseText);
      handleResponse(null, response);
    };

    xdr.open(method.toLowerCase(), config.url);

    setTimeout(function () {
      if (config['data']) {
        payload = serialize(config['data']);
        xdr.send(payload);
      }
      else {
        xdr.send();
      }
    }, 0);
  }

  function handleResponse(a, b){
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
  }

}


// JSON-P Support
// ------------------------------

function sendJsonp(config, callback){
  var url = config.url,
      cb = callback,
      timestamp = new Date().getTime(),
      script = document.createElement('script'),
      parent = document.getElementsByTagName('head')[0],
      callbackName = 'keenJSONPCallback',
      loaded = false;

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
  script.onreadystatechange = function() {
    if (loaded === false && this.readyState === 'loaded') {
      handleResponse('An error occurred', null);
    }
  };

  // Not IE
  script.onerror = function() {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      handleResponse('An error occurred', null);
    }
  };

  script.src = url + '&jsonp=' + callbackName;
  parent.appendChild(script);

  function handleResponse(a, b){
    loaded = true;
    if (cb && typeof cb === 'function') {
      cb(a, b);
      callback = cb = void 0;
    }
    window[callbackName] = undefined;
    try {
      delete window[callbackName];
    } catch(e){};
    parent.removeChild(script);
  }

}


function serialize(data){
  var query = [];
  each(data, function(value, key){
    if ('string' !== typeof value) {
      value = json.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
}
