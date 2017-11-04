'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird/js/browser/bluebird.core');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});

exports.default = _bluebird2.default;