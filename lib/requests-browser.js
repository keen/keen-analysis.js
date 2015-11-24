var each = require('keen-tracking/lib/utils/each'),
    json = require('keen-tracking/lib/utils/json');

module.exports = {
  'get'  : get,
  'post' : post,
  'put'  : put,
  'del'  : del
};

function get(url, params, callback){
  if (xhrObject()) {
    return sendXhr.call(this, 'GET', url, params, callback);
  }
  else {
    return sendJsonp.call(this, url, params, callback);
  }
}

function post(url, params, callback){
  if (xhrObject()) {
    return sendXhr.call(this, 'POST', url, params, callback);
  }
  else {
    this.emit('error', 'XHR POST not supported');
  }
}

function put(url, params, callback) {
  if (xhrObject()) {
    return sendXhr.call(this, 'PUT', url, params, callback);
  }
  else {
    this.emit('error', 'XHR PUT not supported');
  }
}

function del(url, params, callback) {
  if (xhrObject()) {
    return sendXhr.call(this, 'DELETE', url, params, callback);
  }
  else {
    this.emit('error', 'XHR DELETE not supported');
  }
}


function xhrObject() {
  // yay, superagent!
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

function sendXhr(method, url, data, callback){
  var self = this,
      xhr = xhrObject(),
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
          // K.emit('error', 'Could not parse HTTP response: ' + xhr.responseText);
          if (cb) {
            cb.call(self, xhr, null);
          }
        }
        if (cb && response) {
          cb.call(self, null, response);
        }
      }
      else {
        // Keen.emit('error', 'HTTP request failed.');
        if (cb) {
          cb.call(self, xhr, null);
        }
      }
    }
  };

  xhr.open(method, url, true);
  xhr.setRequestHeader('Authorization', self.writeKey());
  xhr.setRequestHeader('Content-Type', 'application/json');

  if (data) {
    payload = serialize(data);
  }

  if (method.toUpperCase() !== 'GET' && payload) {
    xhr.send(payload);
  }
  else {
    xhr.send();
  }

}

function sendJsonp(url, params, callback){
  var self = this,
      cb = callback,
      timestamp = new Date().getTime(),
      script = document.createElement('script'),
      parent = document.getElementsByTagName('head')[0],
      callbackName = 'keenJSONPCallback',
      loaded = false;

  callback = null;

  callbackName += timestamp;
  while (callbackName in window) {
    callbackName += 'a';
  }
  window[callbackName] = function(response) {
    if (loaded === true) return;
    loaded = true;
    if (cb) {
      cb.call(self, null, response);
    }
    cleanup();
  };
  script.src = url + '&jsonp=' + callbackName;
  parent.appendChild(script);

  // for early IE w/ no onerror event
  script.onreadystatechange = function() {
    if (loaded === false && this.readyState === 'loaded') {
      loaded = true;
      handleError();
      cleanup();
    }
  };
  // non-ie, etc
  script.onerror = function() {
    // on IE9 both onerror and onreadystatechange are called
    if (loaded === false) {
      loaded = true;
      handleError();
      cleanup();
    }
  };

  function handleError(){
    if (cb) {
      cb.call(self, 'An error occurred!', null);
    }
  }

  function cleanup(){
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
