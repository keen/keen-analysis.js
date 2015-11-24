var K = require('keen-tracking');
var each = require('keen-tracking/lib/utils/each'),
    extend = require('keen-tracking/lib/utils/extend'),
    requests = require('./requests-browser');

// Extend default configurations
K.resources.queries = '{protocol}://{host}/3.0/projects/{projectId}/queries';

function readKey(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = str ? String(str) : null;
  return this;
}

// Query method

function query(a, b){
  if (b && typeof b === 'string') {
    return this.post(this.url('queries', a, b), null);
  }
  else {
    return this.post(this.url('queries', a), b);
  }
}

// Extend client instance
extend(K.prototype, requests, {
  'readKey' : readKey,
  'query'   : query
});

var client = new K({ projectId: 'PROJECT_ID', readKey: 'READ_KEY' });
client.query('saved', 'some-query-name');
// client.query('count', {
//   event_collection: 'pageviews'
// });

module.exports = K;
