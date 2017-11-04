import KeenCore from 'keen-core'
import each from 'keen-core/lib/utils/each'
import extend from 'keen-core/lib/utils/extend'
import Promise from './utils/promise'
import Query from './query'

export default class Keen extends KeenCore {

  get(str) {
    return new this.constructor.Request('GET', str)
  }

  post(str) {
    return new this.constructor.Request('POST', str)
  }

  put(str) {
    return new this.constructor.Request('PUT', str)
  }

  del(str) {
    return new this.constructor.Request('DELETE', str)
  }

  readKey(str){
    if (!arguments.length) return this.config.readKey;
    this.config.readKey = str ? String(str) : null;
    return this;
  }

  query(a, b){
    if (a && b && typeof b === 'string') {
      if (b.indexOf('/result') < 0) {
        b += '/result';
      }
      return this
        .get(this.url('queries', a, b))
        .auth(this.readKey())
        .send();
    }
    else if (a === 'dataset' && typeof b === 'object') {
      return this
        .get(this.url('datasets', b.name, 'results'))
        .auth(this.readKey())
        .send(b);
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
  }

  run(q, callback){
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
      else if (query instanceof Query) {
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
  }
}

// Keen.Query handler
// --------------------------------
Keen.Query = Query;

export { Query }
