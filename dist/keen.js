'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Query = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keenCore = require('keen-core');

var _keenCore2 = _interopRequireDefault(_keenCore);

var _each = require('keen-core/lib/utils/each');

var _each2 = _interopRequireDefault(_each);

var _extend = require('keen-core/lib/utils/extend');

var _extend2 = _interopRequireDefault(_extend);

var _promise = require('./utils/promise');

var _promise2 = _interopRequireDefault(_promise);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Keen = function (_KeenCore) {
  _inherits(Keen, _KeenCore);

  function Keen() {
    _classCallCheck(this, Keen);

    return _possibleConstructorReturn(this, (Keen.__proto__ || Object.getPrototypeOf(Keen)).apply(this, arguments));
  }

  _createClass(Keen, [{
    key: 'get',
    value: function get(str) {
      return new this.constructor.Request('GET', str);
    }
  }, {
    key: 'post',
    value: function post(str) {
      return new this.constructor.Request('POST', str);
    }
  }, {
    key: 'put',
    value: function put(str) {
      return new this.constructor.Request('PUT', str);
    }
  }, {
    key: 'del',
    value: function del(str) {
      return new this.constructor.Request('DELETE', str);
    }
  }, {
    key: 'readKey',
    value: function readKey(str) {
      if (!arguments.length) return this.config.readKey;
      this.config.readKey = str ? String(str) : null;
      return this;
    }
  }, {
    key: 'query',
    value: function query(a, b) {
      if (a && b && typeof b === 'string') {
        if (b.indexOf('/result') < 0) {
          b += '/result';
        }
        return this.get(this.url('queries', a, b)).auth(this.readKey()).send();
      } else if (a === 'dataset' && typeof b === 'object') {
        return this.get(this.url('datasets', b.name, 'results')).auth(this.readKey()).send(b);
      } else if (a && b && typeof b === 'object') {
        // Include analysis_type for downstream use
        var q = (0, _extend2.default)({ analysis_type: a }, b);
        return this.post(this.url('queries', a)).auth(this.readKey()).send(q);
      } else if (a && !b) {
        return _promise2.default.reject({
          error_code: 'SDKError',
          message: ".query() called with incorrect arguments"
        });
      }
    }
  }, {
    key: 'run',
    value: function run(q, callback) {
      var self = this,
          cb = callback,
          queries,
          promises,
          output;

      callback = null;
      queries = q instanceof Array ? q : [q];
      promises = [];

      (0, _each2.default)(queries, function (query, i) {
        if (typeof query === 'string') {
          promises.push(self.query('saved', query + '/result'));
        } else if (query instanceof _query2.default) {
          // Include analysis_type for downstream use
          promises.push(self.query(query.analysis, (0, _extend2.default)({ analysis_type: query.analysis }, query.params)));
        }
      });

      if (promises.length > 1) {
        output = _promise2.default.all(promises);
      } else {
        // Only return single
        output = promises[0];
      }

      if (cb) {
        // Manually handle callback, as
        // Promise.nodeify drops nulls
        output.then(function (res) {
          cb(null, res);
        });
        output['catch'](function (err) {
          cb(err, null);
        });
      }

      return output;
    }
  }]);

  return Keen;
}(_keenCore2.default);

// Keen.Query handler
// --------------------------------


exports.default = Keen;
Keen.Query = _query2.default;

exports.Query = _query2.default;