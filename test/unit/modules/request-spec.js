var assert = require('proclaim');
var helpers = require('../helpers/client-config');

var KeenClient = require('../../../lib/index');

describe('Request methods', function(){

  beforeEach(function(){
    this.client = new KeenClient(helpers.client);

    // PhantomJS SSL handshake issue
    if (typeof window !== 'undefined' && window._phantom) {
      this.client.config['protocol'] = 'http';
    }
  });

  afterEach(function(){
    this.client = null;
  });

  describe('.auth()', function(){
    it('should set the given api_key value', function(){
      var req = this.client.get('/test').auth('123');
      assert.equal(req.config.api_key, '123');
    });
  });

  describe('.timeout()', function(){
    it('should set the given timeout value', function(){
      var req = this.client.get('/test').timeout(100);
      assert.equal(req.config.timeout, 100);
    });
  });

  describe('.query()', function(){

    it('should make a POST request with data to a query endpoint', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('count', {
          event_collection: 'pageview',
          timeframe: 'this_12_months'
        })
        .then(function(res){
          done();
        })
        .catch(function(err){
          done(err);
        });
    });

    it('should make a GET request to a saved query endpoint', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('saved', 'saved-query-test/result')
        .then(function(res){
          done();
        })
        .catch(done);
    });

  });

});
