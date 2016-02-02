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

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('count', {
          event_collection: 'pageview',
          timeframe: 'this_12_months'
        })
        .then(function(res){
          assert.equal(res.query.analysis_type, 'count');
          assert.equal(res.query.event_collection, 'pageview');
          assert.equal(res.query.timeframe, 'this_12_months');
          assert.isNumber(res.result);
          done();
        })
        .catch(function(err){
          done(err);
        });
    });

    it('should make a POST request with data to a query endpoint, returning an error when unsuccessful', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('count', {
          event_collection: false
        })
        .then(done)
        .catch(function(err){
          done();
        });
    });

    it('should make a GET request to a saved query endpoint, returning a response when successful', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('saved', 'saved-query-test')
        .then(function(res){
          assert.isObject(res);
          assert.isObject(res.query);
          done();
        })
        .catch(done);
    });

    it('should make a GET request to a saved query endpoint, returning an error when unsuccessful', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('saved', 'does-not-exist')
        .then(done)
        .catch(function(err){
          done();
        });
    });

    it('should return an error when incorrect arguments are provided', function(done){
      this.timeout(300 * 1000);
      this.client
        .query('saved/saved-query-test')
        .then(done)
        .catch(function(err){
          done();
        });
    });


  });

});
