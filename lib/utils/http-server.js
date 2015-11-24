var https = require('https'),
    url = require('url');

module.exports = {
  'GET'    : handleRequest,
  'POST'   : handleRequest,
  'PUT'    : handleRequest,
  'DELETE' : handleRequest
};

function handleRequest(config, callback){
  var data = JSON.stringify(config.params),
      parsedUrl = url.parse(config.url),
      options,
      req;

  options = {
    host: parsedUrl.hostname,
    path: parsedUrl.path,
    method: config.method,
    headers: {
      'Authorization': config.api_key,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function() {
      var res = JSON.parse(body), error;
      if (res.error_code) {
        error = new Error(res.message || 'Unknown error occurred');
        error.code = res.error_code;
        callback(error, null);
      }
      else {
        callback(null, res);
      }
    });
  });
  req.on('error', callback);
  req.write(data);
  req.end();
}
