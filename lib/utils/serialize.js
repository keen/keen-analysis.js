var each = require('keen-tracking/lib/utils/each'),
    json = require('keen-tracking/lib/utils/json');

module.exports = function(data){
  var query = [];
  each(data, function(value, key){
    if (typeof value !== 'string') {
      value = json.stringify(value);
    }
    query.push(key + '=' + encodeURIComponent(value));
  });
  return query.join('&');
};
