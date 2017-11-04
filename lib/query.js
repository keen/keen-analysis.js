import each from 'keen-core/lib/utils/each'
import extend from 'keen-core/lib/utils/extend'

export default class Query {
  constructor(analysisType, params) {
    this.analysis = analysisType;
    this.params = {};
    this.set(params);
  
    // Localize timezone if none is set
    if (this.params.timezone === void 0) {
      this.params.timezone = new Date().getTimezoneOffset() * -60;
    }
  }

  set(attributes) {
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
  }

  get(attribute) {
    var key = attribute;
    if (key.match(new RegExp('[A-Z]'))) {
      key = key.replace(/([A-Z])/g, function($1) { return '_'+$1.toLowerCase(); });
    }
    if (this.params) {
      return this.params[key] || null;
    }
  }

  addFilter(property, operator, value) {
    this.params.filters = this.params.filters || [];
    this.params.filters.push({
      'property_name': property,
      'operator': operator,
      'property_value': value
    });
    return this;
  }
}
