import 'promise-polyfill/src/polyfill';
import KeenLibrary from 'keen-core';

import each from 'keen-core/lib/utils/each';
import extend from 'keen-core/lib/utils/extend';

import crossfilter from 'crossfilter2';
import moment from 'moment';

KeenLibrary.prototype.queryLocal = (query) => {
  return new Promise((resolve, reject) => {
    const rows = crossfilter(query.data.result);

    query.filters = query.filters || [];
    query.analysis_type = query.analysis_type || 'extraction';

    if (query.order_by
      && query.order_by.property_name !== 'result'
      && !query.filters.find(filter => filter.property_name === query.order_by.property_name)) {
      query.filters.push({
        property_name: query.order_by.property_name,
        operator: 'true'
      });
    }

    if (query.target_property
      //query.analysis_type === 'count_unique'
    ) {
      query.group_by = query.target_property;
    }

    if (query.group_by) {
      query.filters.push({
        property_name: query.group_by,
        operator: 'true'
      });
    }

    if (query.timeframe) {
      const parseTimeframe = ({ timeframe, returnPartial = false, commonTime }) => {
        if (timeframe.start) {
          // absolute
          return { start: moment(timeframe.start), end: moment(timeframe.end)};
        }
        const timeframeParts = timeframe.split('_');
        const dateRelation = timeframeParts[0];
        const unitsNumber = timeframeParts[1];
        const units = timeframeParts[2];
        if (!returnPartial) {
          return { start: moment(commonTime).subtract(unitsNumber, units), end: moment(commonTime)};
        }
        return { dateRelation, unitsNumber, units };
      }

      const commonTime = Date.now();

      if (
        (parseTimeframe({ timeframe: query.timeframe, commonTime }).start
        <
        parseTimeframe({ timeframe: query.data.query.timeframe, commonTime }).start)
        ||
        (
          query.timeframe.end && (
          parseTimeframe({ timeframe: query.data.query.timeframe, commonTime }).end
          <
          parseTimeframe({ timeframe: query.timeframe, commonTime }).end
        ))
      ) {
        if (query.onOutOfTimeframeRange) {
          return query.onOutOfTimeframeRange();
        }
      }

      if (query.timeframe.start) {
        query.filters.push({
          property_name: 'keen.timestamp',
          operator: 'gt',
          property_value: moment(query.timeframe.start)
        });
        query.filters.push({
          property_name: 'keen.timestamp',
          operator: 'lt',
          property_value: moment(query.timeframe.end)
        });
      } else {
        const timestamp_from_value = parseTimeframe({ timeframe: query.timeframe, commonTime }).start;
        const timestamp_to = parseTimeframe({ timeframe: query.timeframe, returnPartial: true, commonTime });
        const timestamp_to_value = moment().startOf(timestamp_to.units.slice(0, timestamp_to.units.length -1));

        if (timestamp_to.dateRelation === 'previous'){
          // previous
          query.filters.push({
            property_name: 'keen.timestamp',
            operator: 'lt',
            property_value: timestamp_to_value
          });
        }
        query.filters.push({
          property_name: 'keen.timestamp',
          operator: 'gt',
          property_value: timestamp_from_value
        });
      }
    }

    if (!query.filters.length) {
      reject('Specify at least one filter');
    }

    const dimensions = {};

    const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

    let firstFilter;
    query.filters.forEach(filter => {
      if (!firstFilter) firstFilter = filter.property_name;
      const keys = filter.property_name.split('.');
      dimensions[filter.property_name] = dimensions[filter.property_name] || [];
      dimensions[filter.property_name].push(
        rows.dimension(function(d) {
          return getNestedObject(d, keys);
        })
      );

      dimensions[filter.property_name][dimensions[filter.property_name].length - 1].filter(function(d) {
        switch(filter.operator){
          case 'eq':
            return d === filter.property_value;
          break;
          case 'ne':
            return d !== filter.property_value;
          break;
          case 'gt':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d) > filter.property_value;
            }
            return d > filter.property_value;
          break;
          case 'gte':
            return d >= filter.property_value;
          break;
          case 'lte':
            return d <= filter.property_value;
          break;
          case 'lt':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d) < filter.property_value;
            }
            return d < filter.property_value;
          break;
          case 'exists':
            return !!d === filter.property_value;
          break;
          case 'in':
            return filter.property_value.indexOf(d) !== -1;
          break;
          case 'contains':
            return d && d.indexOf(filter.property_value) !== -1;
          break;
          case 'not_contains':
            return !d || d.indexOf(filter.property_value) === -1;
          break;
          case 'within':
            reject('not supported operator: within');
            return false; // TODO: geo coordinates
          break;
          default:
            return true;
        }
      });
    });

    let result = dimensions[firstFilter][0];

    if (query.group_by) {
      result = dimensions[query.group_by][0].group();
    }

    const limit = query.limit || Infinity;
    let directionMethod = 'top';

    if (query.analysis_type === 'minimum') {
      const resultRow = dimensions[query.group_by][0].bottom(1);
      const result = (resultRow[0] && resultRow[0][query.target_property]) || 0;
      return resolve(parseLocalResponse({
        result
      }));
    }
    if (query.analysis_type === 'maximum') {
      const resultRow = dimensions[query.group_by][0].top(1);
      const result = (resultRow[0] && resultRow[0][query.target_property]) || 0;
      return resolve(parseLocalResponse({
        result
      }));
    }
    if (query.analysis_type === 'sum') {
      const reducer = (accumulator = 0, currentValue) => {
        return (accumulator[query.target_property] || accumulator) + (currentValue[query.target_property] || 0);
      };
      const resultRow = dimensions[query.group_by][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        result = resultRow.reduce(reducer);
      }
      return resolve(parseLocalResponse({
        result
      }));
    }
    if (query.analysis_type === 'average') {
      const reducer = (accumulator = 0, currentValue) => {
        return (accumulator[query.target_property] || accumulator) + (currentValue[query.target_property] || 0);
      };
      const resultRow = dimensions[query.group_by][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        result = resultRow.reduce(reducer) / ((resultRow.length > 0 && resultRow.length) || 1);
      }
      return resolve(parseLocalResponse({
        result
      }));
    }
    if (query.analysis_type === 'median') {
      const resultRow = dimensions[query.target_property][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        result = resultRow[Math.floor(resultRow.length/2)][query.target_property];
      }
      return resolve(parseLocalResponse({
        result
      }));
    }
    if (query.analysis_type === 'percentile') {
      const resultRow = dimensions[query.target_property][0].bottom(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        const offset = Math.round(query.percentile / 100 * resultRow.length);
        result = resultRow[offset][query.target_property];
      }
      return resolve(parseLocalResponse({
        result
      }));
    }

    if (query.order_by) {
      let order_by = {
        property_name: query.order_by.property_name || firstFilter,
        direction: query.order_by.direction || 'ASC'
      }
      if (order_by.direction.toLowerCase() === 'asc') {
        directionMethod = 'bottom';
      }
      if (query.group_by) {
        order_by.property_name = 'result';
      }
      if (order_by.property_name === 'result'
        || order_by.property_name === query.group_by) {
        // group
        if (directionMethod === 'bottom') {
          // fix for the bug of the crossfilter lib
          result = result.top(Infinity);
          return resolve(parseLocalResponse({
            result: result.reverse().slice(0, limit),
            parser: { group_by: query.group_by },
            query
          }));
        }
        return resolve(parseLocalResponse({
          result: result[directionMethod](limit),
          parser: { group_by: query.group_by },
          query
        }));
      }
      result = dimensions[order_by.property_name][0][directionMethod](limit);
      return resolve(parseLocalResponse({
        result,
        query
      }));
    }

    return resolve(parseLocalResponse({
      result: result[directionMethod](limit),
      query
    }));
  });
};

function parseLocalResponse({ result, parser = {}, query = {} }){
  if (!Array.isArray(result)) {
    return { result };
  }
  let resultParsed = result;
  if (parser.group_by) {
    resultParsed = [];
    let i = 0;
    result.forEach(item => {
      resultParsed[i++] = { [parser.group_by]: item.key, result: item.value };
    });
  }
  if (query.analysis_type === 'count') {
    resultParsed = resultParsed.length;
  }

  const sortAlpha = function(a, b) {
    var textA = a.toUpperCase();
    var textB = b.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  };
  if (query.analysis_type === 'select_unique') {
    resultParsed = resultParsed.map(value => value[Object.keys(value)[0]]);
    if (typeof resultParsed[0] === 'string') {
      resultParsed.sort(sortAlpha);
    } else {
      resultParsed.sort((a, b) => a - b);
    }
    if (query.order_by.direction === 'desc'){
      resultParsed = resultParsed.reverse();
    }
  }
  return { result: resultParsed };
}

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

export const KeenAnalysis = KeenLibrary;
export default KeenAnalysis;
