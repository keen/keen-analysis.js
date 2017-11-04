'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each = require('keen-core/lib/utils/each');

var _each2 = _interopRequireDefault(_each);

var _extend = require('keen-core/lib/utils/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
  function Query(analysisType, params) {
    _classCallCheck(this, Query);

    this.analysis = analysisType;
    this.params = {};
    this.set(params);

    // Localize timezone if none is set
    if (this.params.timezone === void 0) {
      this.params.timezone = new Date().getTimezoneOffset() * -60;
    }
  }

  _createClass(Query, [{
    key: 'set',
    value: function set(attributes) {
      var self = this;
      (0, _each2.default)(attributes, function (v, k) {
        var key = k,
            value = v;
        if (k.match(new RegExp('[A-Z]'))) {
          key = k.replace(/([A-Z])/g, function ($1) {
            return '_' + $1.toLowerCase();
          });
        }
        self.params[key] = value;
        if (value instanceof Array) {
          (0, _each2.default)(value, function (dv, index) {
            if (dv instanceof Array == false && typeof dv === 'object') {
              (0, _each2.default)(dv, function (deepValue, deepKey) {
                if (deepKey.match(new RegExp('[A-Z]'))) {
                  var _deepKey = deepKey.replace(/([A-Z])/g, function ($1) {
                    return '_' + $1.toLowerCase();
                  });
                  delete self.params[key][index][deepKey];
                  self.params[key][index][_deepKey] = deepValue;
                }
              });
            }
          });
        }
      });
      return self;
    }
  }, {
    key: 'get',
    value: function get(attribute) {
      var key = attribute;
      if (key.match(new RegExp('[A-Z]'))) {
        key = key.replace(/([A-Z])/g, function ($1) {
          return '_' + $1.toLowerCase();
        });
      }
      if (this.params) {
        return this.params[key] || null;
      }
    }
  }, {
    key: 'addFilter',
    value: function addFilter(property, operator, value) {
      this.params.filters = this.params.filters || [];
      this.params.filters.push({
        'property_name': property,
        'operator': operator,
        'property_value': value
      });
      return this;
    }
  }]);

  return Query;
}();

exports.default = Query;