var K = require('keen-tracking');
var each = require('keen-tracking/lib/utils/each'),
    extend = require('keen-tracking/lib/utils/extend'),
    request = require('./request');

// Extend default configurations
// --------------------------------

K.resources.queries = '{protocol}://{host}/3.0/projects/{projectId}/queries';

// Extend client instance methods
// --------------------------------

K.prototype.masterKey = function(str){
  if (!arguments.length) return this.config.masterKey;
  this.config.masterKey = str ? String(str) : null;
  return this;
};

K.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
}

K.prototype.query = function(a, b){
  if (a && !b) {
    return this
      .get(this.url('queries', a))
      .auth(this.readKey())
      .send();
  }
  else if (a && b && typeof b === 'string') {
    return this
      .get(this.url('queries', a, b))
      .auth(this.readKey())
      .send();
  }
  else {
    return this
      .post(this.url('queries', a))
      .auth(this.readKey())
      .send(b);
  }
}

extend(K.prototype, request);

module.exports = K;
