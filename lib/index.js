import 'promise-polyfill/src/polyfill';
import KeenLibrary from 'keen-core';

import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';

import pkg from '../package.json';

KeenLibrary.prototype.readKey = function(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
};

KeenLibrary.prototype.query = function(a, b = undefined, options = {}){
  // a - analysis type or config object
  // b - params
  let analysisType = a;
  let queryParams = b;

  // all this for backward compatibility, remove in next major version
  if (typeof a === 'object' && !b) {
    // initialized with signle argument - config object
    const { analysis_type: analysisTypeExtracted,
      cache: cacheOptionsExtracted,
      ...queryParamsExtracted
    } = a;
    analysisType = analysisTypeExtracted;
    queryParams = queryParamsExtracted;
    let cacheOptions = this.config.cache;
    if (cacheOptionsExtracted !== undefined) {
      cacheOptions = cacheOptionsExtracted;
    }
    options.cache = cacheOptions;
  }
  //math round values boolean for request.js
  options.resultParsers = this.config.resultParsers;

  // for deprecated queries
  if (options.cache === undefined && this.config.cache) {
    options.cache = { ...this.config.cache };
  }

  // read saved queries - DEPRECATED - to remove
  if (analysisType && queryParams && typeof queryParams === 'string') {
    if (queryParams.indexOf('/result') < 0) {
      queryParams += '/result';
    }
    return this
      .get({
        url: this.url('queries', analysisType, queryParams),
        api_key: this.config.readKey || this.config.masterKey
      }, options);
  }

  // read saved queries
  else if (queryParams && queryParams.saved_query_name) {
    let savedQueryResultsUrl =
      queryParams.saved_query_name.indexOf('/result') > -1 ?
      queryParams.saved_query_name
      :
      `${queryParams.saved_query_name}/result`
    ;
    return this
      .get({
          url: this.url(
            'queries',
            'saved',
            savedQueryResultsUrl
          ),
          api_key: this.config.readKey || this.config.masterKey
        },
        options);
  }

  // cached datasets - DEPRECATED
  else if (analysisType === 'dataset' && typeof queryParams === 'object') {
    return this
      .get({
        url: this.url('datasets', queryParams.name, 'results'),
        api_key: this.config.readKey || this.config.masterKey,
        params: queryParams
      }, options);
  }

  else if (queryParams && queryParams.dataset_name) {
    return this
      .get({
        url: this.url('datasets', queryParams.dataset_name, 'results'),
        api_key: this.config.readKey || this.config.masterKey,
        params: queryParams
      }, options);
  }

  // standard queries
  else if (analysisType && queryParams && typeof queryParams === 'object') {
    // Include analysis_type for downstream use
    const queryBodyParams = extend({ analysis_type: analysisType }, queryParams);

    // Localize timezone if none is set
    if (!queryBodyParams.timezone) {
      queryBodyParams.timezone = new Date().getTimezoneOffset() * -60;
    }

    return this
      .post({
        url: this.url('queries', analysisType),
        api_key: this.config.readKey || this.config.masterKey,
        params: queryBodyParams
      }, options);
  }
  else if (analysisType && typeof analysisType === 'string' && !queryParams) {
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
      queryPromise = self.query(query.analysis, extend({ analysis_type: query.analysis }, query.params), query.options);
    } else {
      queryPromise = query;
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

// DEPRECATED
function Query(analysisType, params = {}, options = {}) {
  this.analysis = analysisType;
  this.params = {};
- this.set(params);
  this.options = {...options};
}

Query.prototype.set = function(attributes) {
  // DEPRECATED
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
  // DEPRECATED
  let key = attribute;
  if (key.match(new RegExp('[A-Z]'))) {
    key = key.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
  }
  if (this.params) {
    return this.params[key] || null;
  }
};

Query.prototype.addFilter = function(property, operator, value) {
  // DEPRECATED
  this.params.filters = this.params.filters || [];
  this.params.filters.push({
    'property_name': property,
    'operator': operator,
    'property_value': value
  });
  return this;
};

KeenLibrary.version = pkg.version;

export const KeenAnalysis = KeenLibrary;
export default KeenAnalysis;
