module.exports = {
  'GET'    : get,
  'POST'   : post,
  'PUT'    : put,
  'DELETE' : del
};


function get(config, callback){

  setTimeout(function(){
    console.log('GET RESPONSE');
    callback(null, { result: 1234 });
  }, 1000);
  return;

  if (xhrObject()) {
    return sendXhr('GET', config.url, config.params, config.api_key, callback);
  }
  else {
    return sendJsonp(config.url, config.params, config.api_key, callback);
  }
}

function post(config, callback){

  // setTimeout(function(){
  //   console.log('POST RESPONSE');
  //   callback(null, { result: 2450 });
  // }, 2000);

  if (xhrObject()) {
    return sendXhr('POST', config.url, config.params, config.api_key, callback);
  }
  else {
    // console.log(this);
    callback('XHR POST not supported', null);
  }
}

function put(config, callback) {
  if (xhrObject()) {
    return sendXhr('PUT', config.url, config.params, config.api_key, callback);
  }
  else {
    callback('XHR PUT not supported', null);
  }
}

function del(config, callback) {
  if (xhrObject()) {
    return sendXhr('DELETE', config.url, config.params, config.api_key, callback);
  }
  else {
    callback('XHR DELETE not supported', null);
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

function sendXhr(method, url, data, api_key, callback){
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
          // K.emit('error', 'Could not parse HTTP response: ' + xhr.responseText);
          if (cb) {
            cb(xhr, null);
          }
        }
        if (cb && response) {
          cb(null, response);
        }
      }
      else {
        // Keen.emit('error', 'HTTP request failed.');
        if (cb) {
          cb(xhr, null);
        }
      }
    }
  };

  xhr.open(method, url, true);
  xhr.setRequestHeader('Authorization', api_key);
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
  var cb = callback,
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
      cb(null, response);
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
      cb('An error occurred!', null);
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
