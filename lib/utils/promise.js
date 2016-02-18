var Bluebird = require('bluebird/js/browser/bluebird.core');
Bluebird.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});
module.exports = Bluebird;
