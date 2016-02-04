var Bluebird = require('bluebird');
Bluebird.config({
  cancellation: true
});
module.exports = Bluebird;
