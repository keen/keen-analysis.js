'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = require('./utils/promise');

var _promise2 = _interopRequireDefault(_promise);

var _each = require('keen-core/lib/utils/each');

var _each2 = _interopRequireDefault(_each);

var _extend = require('keen-core/lib/utils/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request(method, str) {
    _classCallCheck(this, Request);

    this.config = {
      'api_key': undefined,
      'method': method,
      'params': undefined,
      'timeout': 300 * 1000,
      'url': str,
      'headers': {
        'Authorization': '',
        'Content-type': 'application/json'
      }
    };
  }

  _createClass(Request, [{
    key: 'auth',
    value: function auth(str) {
      if (typeof str === 'string') {
        this.config.api_key = typeof str === 'string' ? str : undefined;
        this.headers({
          'Authorization': str
        });
      }
      return this;
    }
  }, {
    key: 'timeout',
    value: function timeout(num) {
      this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
      return this;
    }
  }, {
    key: 'headers',
    value: function headers(obj) {
      if (typeof obj === 'object') {
        (0, _each2.default)(obj, function (value, key) {
          this.config['headers'][key] = value;
        }.bind(this));
      }
      return this;
    }
  }, {
    key: 'timeout',
    value: function timeout(num) {
      this.config.timeout = typeof num === 'number' ? num : 300 * 1000;
      return this;
    }
  }, {
    key: 'send',
    value: function send(obj) {
      var httpHandler, httpOptions;

      this.config.params = obj && typeof obj === 'object' ? obj : {};
      httpHandler = this.constructor.httpHandlers[this.config['method']], httpOptions = (0, _extend2.default)({}, this.config);

      // Temporary mod to append analysis_type to responses
      // for generic HTTP requests to known query resources
      if (typeof httpOptions.params.analysis_type === 'undefined') {
        if (httpOptions.url.indexOf('/queries/') > -1 && httpOptions.url.indexOf('/saved/') < 0) {
          httpOptions.params.analysis_type = getAnalysisType(httpOptions.url);
        }
      }

      return new _promise2.default(function (resolve, reject, onCancel) {
        var httpRequest = httpHandler(httpOptions, function (err, res) {
          var augmentedResponse = res;
          if (err) {
            reject(err);
          } else {
            // Append query object to ad-hoc query results
            if (typeof httpOptions.params.event_collection !== 'undefined' && typeof res.query === 'undefined') {
              augmentedResponse = (0, _extend2.default)({ query: httpOptions.params }, res);
            }
            resolve(augmentedResponse);
          }
        });
        onCancel(function () {
          if (httpRequest.abort) {
            httpRequest.abort();
          }
        });
        return httpRequest;
      });
    }
  }]);

  return Request;
}();

exports.default = Request;


function getAnalysisType(str) {
  var split = str.split('/queries/');
  return split[split.length - 1];
}