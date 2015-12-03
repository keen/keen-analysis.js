var K = require('keen-tracking'),
    Promise = require('promise');

var each = require('keen-tracking/lib/utils/each'),
    extend = require('keen-tracking/lib/utils/extend');

var request = require('./request');

// Extend default configurations
// --------------------------------
K.resources.queries = '{protocol}://{host}/3.0/projects/{projectId}/queries';

// Extend client instance methods
// --------------------------------
extend(K.prototype, request);

K.prototype.masterKey = function(str){
  if (!arguments.length) return this.config.masterKey;
  this.config.masterKey = str ? String(str) : null;
  return this;
};

K.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

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
};

// Keen.Query handler
// --------------------------------
K.Query = Query;

K.prototype.run = function(q, callback){
  var self = this,
      cb = callback,
      queries,
      promises,
      output;

  callback = null;
  queries = q instanceof Array? q : [q];
  promises = [];

  each(queries, function(query, i){
    if (typeof query === 'string') {
      promises.push(self.query('saved', query + '/result'));
    }
    else if (query instanceof K.Query) {
      promises.push(self.query(query.analysis, query.params));
    }
  });

  if (promises.length > 1) {
    output = Promise.all(promises);
  }
  else {
    // Only return single
    output = promises[0];
  }

  if (cb) {
    // Manually handle callback, as
    // Promise.nodeify drops nulls
    output.then(function(res){
      cb(null, res);
    });
    output['catch'](function(err){
      cb(err, null);
    });
  }

  return output;
};

function Query(analysisType, params) {
  this.analysis = analysisType;
  this.params = {};
  this.set(params);

  // Localize timezone if none is set
  if (this.params.timezone === void 0) {
    this.params.timezone = new Date().getTimezoneOffset() * -60;
  }
}

Query.prototype.set = function(attributes) {
  var self = this;
  each(attributes, function(v, k){
    var key = k, value = v;
    if (k.match(new RegExp('[A-Z]'))) {
      key = k.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
    }
    self.params[key] = value;
    if (value instanceof Array) {
      each(value, function(dv, index){
        if (dv instanceof Array == false && typeof dv === 'object') {
          each(dv, function(deepValue, deepKey){
            if (deepKey.match(new RegExp('[A-Z]'))) {
              var _deepKey = deepKey.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
              delete self.params[key][index][deepKey];
              self.params[key][index][_deepKey] = deepValue;
            }
          });
        }
      });
    }
  });
  return self;
};

Query.prototype.get = function(attribute) {
  var key = attribute;
  if (key.match(new RegExp('[A-Z]'))) {
    key = key.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
  }
  if (this.params) {
    return this.params[key] || null;
  }
};

Query.prototype.addFilter = function(property, operator, value) {
  this.params.filters = this.params.filters || [];
  this.params.filters.push({
    'property_name': property,
    'operator': operator,
    'property_value': value
  });
  return this;
};

// --------------------------------

module.exports = K;
