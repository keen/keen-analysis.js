var Bluebird = require('bluebird/js/browser/bluebird.core');
Bluebird.config({
  cancellation: true
  // longStackTraces: true,
  // warnings: true
});
module.exports = Bluebird;
