var each = require('keen-tracking/lib/utils/each');

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
