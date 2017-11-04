import https from 'https'
import url from 'url'

import extend from 'keen-core/lib/utils/extend';
import serialize from 'keen-core/lib/utils/serialize';

export var GET    = handleRequest
export var POST   = handleRequest
export var PUT    = handleRequest
export var DELETE = handleRequest

function handleRequest(config, callback){
  var parsedUrl = url.parse(config.url),
      data,
      options,
      req;

  options = {
    host: parsedUrl['hostname'],
    path: parsedUrl.path,
    method: config['method'],
    headers: config['headers']
  };

  if (config['method'] === 'GET') {
    data = '';
    options.path += '?api_key=' + config.api_key;
    if (config.params) {
      options.path += '&' + serialize(config.params);
    }
  }
  else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function() {
      var parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (error) {
        return callback(error, null);
      }
      if (parsedBody.error_code) {
        error = new Error(parsedBody.message || 'Unknown error occurred');
        error.code = parsedBody.error_code;
        callback(error, null);
      }
      else {
        callback(null, parsedBody);
      }
    });
  });

  req.on('error', callback);
  req.write(data);
  req.end();
}
