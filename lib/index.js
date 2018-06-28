import 'promise-polyfill/src/polyfill';
import KeenLibrary from 'keen-core';

import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';

KeenLibrary.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

KeenLibrary.prototype.query = function(a, b){
  let requestQuery = {};
  if (a && b && typeof b === 'string') {
    if (b.indexOf('/result') < 0) {
      b += '/result';
    }
    requestQuery = this
      .get(this.url('queries', a, b))
      .auth(this.readKey());
    return requestQuery.send();
  }
  else if (a === 'dataset' && typeof b === 'object') {
    requestQuery = this
      .get(this.url('datasets', b.name, 'results'))
      .auth(this.readKey());
    return requestQuery.send(b);
  }
  else if (a && b && typeof b === 'object') {
    // Include analysis_type for downstream use
    const q = extend({ analysis_type: a }, b);
    requestQuery = this
      .post(this.url('queries', a))
      .auth(this.readKey());
    return requestQuery.send(q);
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
KeenLibrary.Query = Query;

KeenLibrary.prototype.run = function(q, callback){
  const self = this;
  const cb = callback;
  let output;

  const queries = q instanceof Array? q : [q];
  const promises = [];

  each(queries, function(query, i){
    let queryPromise;
    if (typeof query === 'string') {
      queryPromise = self.query('saved', query + '/result');
    }
    else if (query instanceof KeenLibrary.Query) {
      // Include analysis_type for downstream use
      queryPromise = self.query(query.analysis, extend({ analysis_type: query.analysis }, query.params));
    }
    // query.abort = queryPromise.abort;
    promises.push(queryPromise);
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
  const self = this;
  each(attributes, function(v, k){
    let key = k;
    let value = v;
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
  let key = attribute;
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

export const KeenAnalysis = KeenLibrary;
export default KeenAnalysis;
