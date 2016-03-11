var K = require('keen-core');
var Promise = require('./utils/promise');

var each = require('keen-core/lib/utils/each'),
    extend = require('keen-core/lib/utils/extend');

var request = require('./request');

(function(env){

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
    if (a && b && typeof b === 'string') {
      if (b.indexOf('/result') < 0) {
        b += '/result';
      }
      return this
        .get(this.url('queries', a, b))
        .auth(this.readKey())
        .send();
    }
    else if (a && b && typeof b === 'object') {
      // Include analysis_type for downstream use
      var q = extend({ analysis_type: a }, b);
      return this
        .post(this.url('queries', a))
        .auth(this.readKey())
        .send(q);
    }
    else if (a && !b) {
      return Promise.reject({
        error_code: 'SDKError',
        message: ".query() called with incorrect arguments"
      });
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
        // Include analysis_type for downstream use
        promises.push(self.query(query.analysis, extend({ analysis_type: query.analysis }, query.params)));
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

  // Module Definitions
  // --------------------

  // Global
  if (env) {
    env.Keen = K;
  }

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = K;
  }

  // RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-analysis', [], function(){
      return K;
    });
  }

}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
