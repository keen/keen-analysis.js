'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = exports.PUT = exports.POST = exports.GET = undefined;

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _extend = require('keen-core/lib/utils/extend');

var _extend2 = _interopRequireDefault(_extend);

var _serialize = require('keen-core/lib/utils/serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GET = exports.GET = handleRequest;
var POST = exports.POST = handleRequest;
var PUT = exports.PUT = handleRequest;
var DELETE = exports.DELETE = handleRequest;

function handleRequest(config, callback) {
  var parsedUrl = _url2.default.parse(config.url),
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
      options.path += '&' + (0, _serialize2.default)(config.params);
    }
  } else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  req = _https2.default.request(options, function (res) {
    var body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
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
      } else {
        callback(null, parsedBody);
      }
    });
  });

  req.on('error', callback);
  req.write(data);
  req.end();
}