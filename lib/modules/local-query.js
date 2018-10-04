import crossfilter from 'crossfilter2';
import moment from 'moment';

import loadDataFromFile from './utils/browser-load-data-from-file';

let sharedData;

export const localQuery = (query) => {
  if (query.debug && !query.startedAt) query.startedAt = Date.now();

  if (!query.data && !query.file) {
    throw 'Specify the source of the data: DATA or FILE';
    return;
  }

  if (query.data && query.file) {
    throw 'Use only one data source: DATA or FILE';
    return;
  }

  if (query.file) {
    return loadDataFromFile(query.file)
      .then(res => {
        return localQuery({
          ...query,
          file: undefined,
          data: res
        });
      });
  }

  return new Promise((resolve, reject) => {
    if (!sharedData) {
      if (!query.data && query.res){
        throw 'Use query.data instead of query.res property';
        return;
      }
      if (Array.isArray(query.data)){
        query.data = {
          result: query.data
        };
      }

      if (!Array.isArray(query.data.result)){
        if (query.data.query && query.data.query.analysis_type !== 'extraction') {
          throw 'Local Query can use only result of an Extraction';
          return;
        }
        throw 'query.data should be an Array';
        return;
      }

      sharedData = query.data.result;
      // don't copy this huge array - just make a reference to it
      // so queries with Intervals don't overload the browser
    }

    const rows = crossfilter(sharedData);

    if (query.debug) {
      console.log('! Welcome to the Local Query Experimental Feature !');
      console.log('* Running a local query with:');
      console.log('--', 'Number of events before filtering:', sharedData.length);
      const keysToPrint = [
        'analysis_type',
        'filters',
        'timeframe',
        'interval',
        'group_by',
        'order_by',
        'limit'
      ];
      keysToPrint.forEach(key => {
        console.log('--', key, query[key]);
      });
    }

    query.combinedFilters = [...(query.filters || [])] || [];
    query.analysis_type = query.analysis_type || 'extraction';

    const supportedAnalysisTypes = [
      'extraction', 'count', 'count_unique', 'minimum', 'maximum', 'sum',
      'average', 'median', 'percentile', 'select_unique'
    ];
    if (!supportedAnalysisTypes.find(item => item === query.analysis_type)) {
      console.log(`${query.analysis_type} is not supported in the local queries`);
      return;
    }

    // to group and be able to sort - we need to create a new dimension
    if (query.order_by
      && query.order_by.property_name !== 'result'
      && !query.combinedFilters.find(filter => filter.property_name === query.order_by.property_name)) {
      query.combinedFilters.push({
        property_name: query.order_by.property_name,
        operator: 'true'
      });
    }

    if (query.target_property) {
      query.group_by = query.target_property;
    }

    if (query.group_by) {
      query.combinedFilters.push({
        property_name: query.group_by,
        operator: 'true'
      });
    }


    // TIMEFRAME

    if (!query.timeframe && query.data.query && query.data.query.timeframe) {
      query.timeframe = query.data.query.timeframe;
      // get timeframe from parent query (general results from cache/file)
    }

    const commonTime = Date.now(); // necessary to be able to compare dates

    const parseTimeframe = ({ timeframe, returnPartial = false, commonTime }) => {
      if (timeframe.start) {
        // absolute
        return {
          start: moment.utc(timeframe.start),
          end: moment.utc(timeframe.end)
        };
      }
      const timeframeParts = timeframe.split('_');
      const dateRelation = timeframeParts[0];
      const unitsNumber = timeframeParts[1];
      const units = timeframeParts[2];
      const unit = units.slice(0, units.length -1);
      if (!returnPartial) {
        let start = moment().startOf(unit).subtract(unitsNumber - 1, units);
        let end = moment().startOf(unit);
        if (commonTime) {
          start = moment.utc(commonTime).subtract(unitsNumber, units);
          end = moment.utc(commonTime);
        }
        return {
          start,
          end
        };
      }
      return {
        dateRelation,
        unitsNumber,
        units
      };
    }

    if (query.timeframe) {
      if (
        // check boundries only for data with metadata from a root query
        query.data.query &&
        (
          (parseTimeframe({ timeframe: query.timeframe, commonTime }).start
          <
          parseTimeframe({ timeframe: query.data.query.timeframe, commonTime }).start)
          ||
          (
             (
              parseTimeframe({ timeframe: query.data.query.timeframe, commonTime }).end
              <
              parseTimeframe({ timeframe: query.timeframe, commonTime }).end
            )
          )
        )
      ) {
        if (query.debug) console.log(`Local query's timeframe is out of the Root Query timeframe range`);
        if (query.onOutOfTimeframeRange) {
          return query.onOutOfTimeframeRange();
        }
      }

      const addTimeframeFilter = (timeframe) => {
        if (timeframe.start) {
          // ABSOLUTE timeframe
          query.combinedFilters.push({
            property_name: 'keen.timestamp',
            operator: 'gte',
            property_value: moment.utc(timeframe.start)
          });
          query.combinedFilters.push({
            property_name: 'keen.timestamp',
            operator: 'lt',
            property_value: moment.utc(timeframe.end)
          });
        } else {
          // RELATIVE timeframe
          const timestamp_parts = parseTimeframe({ timeframe, returnPartial: true });
          const unit = timestamp_parts.units.slice(0, timestamp_parts.units.length -1);

          const timestamp_from_value_this = parseTimeframe({ timeframe }).start;
          const timestamp_from_value_previous = parseTimeframe({ timeframe }).start
            .startOf(unit);
          if (!query.subquery) {
            timestamp_from_value_previous.subtract(1, timestamp_parts.units);
          }

          const timestamp_to_value_this = moment();
          const timestamp_to_value_previous = moment().startOf(unit);

          if (timestamp_parts.dateRelation === 'previous'){
            // previous
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'lt',
              property_value: timestamp_to_value_previous
            });
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'gte',
              property_value: timestamp_from_value_previous
            });
          } else {
            // this_
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'lt',
              property_value: timestamp_to_value_this
            });
            query.combinedFilters.push({
              property_name: 'keen.timestamp',
              operator: 'gte',
              property_value: timestamp_from_value_this
            });
          }
        }
      }

      addTimeframeFilter(query.timeframe);

      if (query.rootTimeframe) {
        addTimeframeFilter(query.rootTimeframe);
      }

    }



    // INTERVAL

    const lastRow = sharedData && sharedData[sharedData.length - 1];
    const lastRowTimeStamp = lastRow && lastRow.keen.timestamp;
    const intervalFilters = [];
    if (query.interval){
      const startTimestamp = query
        .combinedFilters.find(item => item.property_name === 'keen.timestamp'
          && item.operator === 'gte').property_value;
      let endTimestamp = (query
        .combinedFilters.find(item => item.property_name === 'keen.timestamp'
          && item.operator === 'lt') ||
        {}
      ).property_value || moment.utc(lastRowTimeStamp);

      let currentEndTimestamp = moment.utc(startTimestamp);
      let currentStartTimestamp;

      const timestamp_to = parseTimeframe({ timeframe: query.timeframe, returnPartial: true, commonTime });

      const intervalToUnits = {
        secondly: 'seconds',
        minutely: 'minutes',
        hourly: 'hours',
        daily: 'days',
        weekly: 'weeks',
        monthly: 'months',
        yearly: 'years'
      };

      const intervalStrParts = query.interval.split('_');
      const units = intervalStrParts[2] || intervalToUnits[query.interval];
      const distance = intervalStrParts[1] || 1;

      let promisesArray = [];
      while(endTimestamp.diff(currentEndTimestamp, 'seconds') > 0) {
        let timeframe = {
          start: currentEndTimestamp.startOf(units).toISOString(),
          end: currentEndTimestamp.add(distance, units).toISOString()
        };
        promisesArray.push(
          localQuery({
            ...query,
            rootTimeframe: query.timeframe,
            timeframe: { ...timeframe },
            interval: null,
            extendResults: {
              timeframe: { ...timeframe }
            },
            subquery: true,
            debug: false
          })
        );
      }
      if (query.debug) console.log(
        `** Running ${promisesArray.length} subQueries because of Interval ${query.interval}`
      );
      return Promise
        .all(promisesArray)
        .then(res => {
          const resultToValue = res.map(resItem => {
            const { result, ...otherKeys } = resItem;
            // Keen's API is responding with key called VALUE instead of RESULT,
            // so we have to map that here
            return { ...otherKeys, value: result };
          });
        printQueryTime(query);
        return resolve({
          result: resultToValue,
          query: getQueryMetadata(query)
        });
      })
      .catch(err => {
        reject(err);
      });
    }

    if (!query.combinedFilters.length) {
      // we need to specify at least one filter to create a dimension
      query.combinedFilters.push({
        property_name: 'keen.timestamp',
        operator: 'exists',
        property_value: true
      });
    }

    const dimensions = {};

    // get nested Object property accessed by string like someObj.some_property
    const getNestedObject = (nestedObj, pathArr) => {
      return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
    }

    let firstFilter;
    query.combinedFilters.forEach(filter => {
      if (!firstFilter) firstFilter = filter.property_name;
      const keys = filter.property_name.split('.');
      dimensions[filter.property_name] = dimensions[filter.property_name] || [];
      dimensions[filter.property_name].push(
        rows.dimension(function(d) {
          return getNestedObject(d, keys);
        })
      );

      // FILTERS

      dimensions[filter.property_name][dimensions[filter.property_name].length - 1].filter(function(d) {
        if (filter.operator === 'eq' && Array.isArray(d)) {
          // mirror the strange API behaviour
          filter.operator = 'eq_in';
          if (query.debug) console.log(`Mirror API's behaviour - change EQ to EQ_IN`);
        }
        switch(filter.operator){
          case 'eq':
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
          break;
          case 'eq_in':
            if (!d) return false;
            if (Array.isArray(d)){
              return d.indexOf(filter.property_value) !== -1;
            }
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
          break;
          case 'strict_eq':
            // even if the D value is array
            return JSON.stringify(d) === JSON.stringify(filter.property_value);
          break;
          case 'ne':
            return JSON.stringify(d) !== JSON.stringify(filter.property_value);
          break;
          case 'gt':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d).diff(filter.property_value, 'seconds') > 0;
            }
            return d > filter.property_value;
          break;
          case 'gte':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d).diff(filter.property_value, 'seconds') >= 0;
            }
            return d >= filter.property_value;
          break;
          case 'lte':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d).diff(filter.property_value, 'seconds') <= 0;
            }
            return d <= filter.property_value;
          break;
          case 'lt':
            if (filter.property_name === 'keen.timestamp') {
              return moment(d).diff(filter.property_value, 'seconds') < 0;
            }
            return d < filter.property_value;
          break;
          case 'exists':
            return !!d === filter.property_value;
          break;
          case 'in':
            if (!d) return false;
            if (Array.isArray(filter.property_value) && Array.isArray(d)) {
              let found = false;
              filter.property_value.forEach(item => {
                if (d.find(itemInPropert => itemInPropert === item)) {
                  found = true;
                }
              });
              return found;
            }
            if (Array.isArray(filter.property_value)) {
              return filter.property_value.find(item => item === d);
            }
            if (Array.isArray(d)) {
              return d.find(item => item === filter.property_value);
            }
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

    if (query.debug) console.log(`Dimensions created:`, Object.keys(dimensions));

    let result = dimensions[firstFilter][0];

    if (query.group_by) {
      result = dimensions[query.group_by][0].group();
    }

    const limit = query.limit || Infinity;
    let directionMethod = 'top';

    if (query.debug) console.log(
      `Order direction:`,
      { top: 'asc', bottom: 'desc' }[directionMethod],
      directionMethod
    );

    const getValueFromNestedKey = ({ row, nestedKey }) => {
      if (!row) return undefined;
      const keys = nestedKey.split('.');
      const value = getNestedObject(row, keys);
      if (isNaN(value)) {
        return value;
      }
      return value*1;
    }
    // ANALYSIS TYPES

    if (query.analysis_type === 'minimum') {
      const resultRow = dimensions[query.group_by][0].bottom(1);
      const value = getValueFromNestedKey({
        row: resultRow[0],
        nestedKey: query.target_property
      });
      const result = value;
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    if (query.analysis_type === 'maximum') {
      const resultRow = dimensions[query.group_by][0].top(1);
      const value = getValueFromNestedKey({
        row: resultRow[0],
        nestedKey: query.target_property
      });
      const result = value;
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    if (query.analysis_type === 'sum') {
      const reducer = (accumulator = 0, currentValue) => {
        return (getValueFromNestedKey({
          row: accumulator,
          nestedKey: query.target_property
        }) || accumulator) + (getValueFromNestedKey({
          row: currentValue,
          nestedKey: query.target_property
        }) || 0);
      };
      const resultRow = dimensions[query.group_by][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        result = resultRow.reduce(reducer);
      }
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    if (query.analysis_type === 'average') {
      const reducer = (accumulator = 0, currentValue) => {
        return (getValueFromNestedKey({
          row: accumulator,
          nestedKey: query.target_property
        }) || accumulator) + (getValueFromNestedKey({
          row: currentValue,
          nestedKey: query.target_property
        }) || 0);
      };
      const resultRow = dimensions[query.group_by][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        result = resultRow.reduce(reducer) / ((resultRow.length > 0 && resultRow.length) || 1);
      }
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    if (query.analysis_type === 'median') {
      const resultRow = dimensions[query.target_property][0].top(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        const half = Math.floor(resultRow.length / 2);
        if (resultRow.length % 2) {
          result = getValueFromNestedKey({
            row: resultRow[half],
            nestedKey: query.target_property
          });
        } else {
          result = (getValueFromNestedKey({
            row: resultRow[half - 1],
            nestedKey: query.target_property
            }) +
            getValueFromNestedKey({
            row: resultRow[half],
            nestedKey: query.target_property
            })) / 2.0;
        }
      }
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    if (query.analysis_type === 'percentile') {
      const resultRow = dimensions[query.target_property][0].bottom(Infinity);
      let result = 0;
      if (resultRow && resultRow.length) {
        let index = query.percentile / 100 * (resultRow.length-1);
        if (Math.floor(index) === index) {
          result = getValueFromNestedKey({
            row: resultRow[index],
            nestedKey: query.target_property
          });
        } else {
          const i = Math.floor(index);
          const fraction = index - i;
          result =
            getValueFromNestedKey({
              row: resultRow[i],
              nestedKey: query.target_property
            })
            +
            (
              getValueFromNestedKey({
                row: resultRow[i+1],
                nestedKey: query.target_property
              })
              -
              getValueFromNestedKey({
                row: resultRow[i],
                nestedKey: query.target_property
              })
             ) * fraction;
        }
      }
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }


    // ORDER BY

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
          return resolve(
            parseLocalResponse({
              result: result.reverse().slice(0, limit),
              parser: { group_by: query.group_by },
              query
            })
          );
        }
        return resolve(
          parseLocalResponse({
            result: result[directionMethod](limit),
            parser: { group_by: query.group_by },
            query
          })
        );
      }
      result = dimensions[order_by.property_name][0][directionMethod](limit);
      return resolve(
        parseLocalResponse({
          result,
          query
        })
      );
    }

    return resolve(
      parseLocalResponse({
        result: result[directionMethod](limit),
        query
      })
    );
  });
};

const sortAlpha = (a, b) => {
  var textA = a.toUpperCase();
  var textB = b.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
};

const printQueryTime = (query) => {
  if (query.debug) console.log('** Query time: ', Date.now() - query.startedAt, 'ms');
}

function getQueryMetadata(query){
  const rootQuery = query && query.data && query.data.query;
  let queryBodyParams  = {};
  if (rootQuery) {
    queryBodyParams  = { ...rootQuery };
  } else {
    queryBodyParams  =  {
      analysis_type: query.analysis_type,
      event_collection: query.event_collection,
      timeframe: query.timeframe,
      interval: query.interval,
    };
  }
  queryBodyParams.timezone = new Date().getTimezoneOffset() * -60;
  return queryBodyParams;
}

function parseLocalResponse({ result, parser = {}, query = {} }){
  query.extendResults = query.extendResults || {};
  if (!query.subquery) {
    query.extendResults.query = getQueryMetadata(query);
  }
  if (!Array.isArray(result)) {
    printQueryTime(query);
    return {
      result,
      ...query.extendResults
    };
  }

  let resultParsed = result;
  if (parser.group_by) {
    resultParsed = [];
    let i = 0;
    result.forEach(item => {
      resultParsed[i++] = { [parser.group_by]: item.key, result: item.value };
    });
  }

  if (query.analysis_type === 'count' && !query.group_by) {
    resultParsed = resultParsed.length;
  }

  if (query.analysis_type === 'select_unique') {
    resultParsed = resultParsed.map(value => value[Object.keys(value)[0]]);
    if (typeof resultParsed[0] === 'string') {
      resultParsed.sort(sortAlpha);
    } else {
      resultParsed.sort((a, b) => a - b);
    }
    if (query.order_by && query.order_by.direction === 'desc'){
      resultParsed = resultParsed.reverse();
    }
  }

  printQueryTime(query);

  return {
    result: resultParsed,
    ...query.extendResults
  };
}

export default localQuery;
