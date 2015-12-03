var assert = require('proclaim');

var helpers = require('../helpers/client-config');
var KeenClient = require('../../../lib/index');

describe('Keen.Query', function(){

  beforeEach(function(){
    this.timeout(300 * 1000);
    this.client = new KeenClient(helpers.client);

    // PhantomJS SSL handshake issue
    if (typeof window !== 'undefined' && window._phantom) {
      this.client.config['protocol'] = 'http';
    }
  });

  afterEach(function(){
    this.client = null;
  });

  describe('Constructor', function() {

    it('should create a new Keen.Query instance', function(){
      var q = new KeenClient.Query('count', {
        eventCollection: 'pageviews'
      });
      assert.isInstanceOf(q, KeenClient.Query);
    });

    it('should have a correct analysis propery', function(){
      var q = new KeenClient.Query('count');
      assert.equal(q.analysis, 'count');
    });

    it('should have a params object', function(){
      var q = new KeenClient.Query('count');
      assert.isObject(q.params);
    });

    it('should have a params.event_collection property', function(){
      var q = new KeenClient.Query('count', {
        eventCollection: 'pageviews'
      });
      assert.equal(q.params.event_collection, 'pageviews');
    });

  });

  describe('<Client.run> (Keen client instance)', function(){

    beforeEach(function(){
      this.timeout(300 * 1000);
      this.query = new KeenClient.Query('count', {
        eventCollection: 'pageview',
        timeframe: 'this_12_months'
      });
    });

    afterEach(function(){
      this.query = void 0;
    });

    it('should throw an error when passed an invalid object', function(){
      var self = this;
      assert.throws(function(){ self.run(null); });
      assert.throws(function(){ self.run({}); });
      assert.throws(function(){ self.run(0); });
    });

    it('should return a response when successful', function(){
      this.client.run(this.query, function(err, res){
        assert.isNull(err);
        assert.isObject(res);
      });
    });

    it('should return an error when unsuccessful', function(){
      var q = new KeenClient.Query('count');
      this.client.run(q, function(err, res){
        assert.isNotNull(err);
        assert.isString(err.error_code);
        assert.isNull(res);
      });
    });

    it('should handle multiple query objects', function(){
      this.client.run([this.query, this.query, this.query], function(err, res){
        assert.isNull(err);
        assert.isArray(res);
        assert.lengthEquals(res, 3);
      });
    });

    it('should return a promise', function(done){
      this.client
        .run([this.query, this.query, this.query])
        .then(function(res){
          assert.isArray(res);
          assert.lengthEquals(res, 3);
          done();
        })
        .catch(done);
    });

  });

  describe('.addFilter()', function(){

    beforeEach(function(){
      this.query = new KeenClient.Query('count', {
        eventCollection: 'pageviews',
        timeframe: 'this_7_days'
      });
    });

    afterEach(function(){
      this.query = void 0;
    });

    it('should add filters correctly', function(){
      this.query.addFilter('property', 'eq', 'value');
      assert.isArray(this.query.params.filters);
      assert.deepEqual(this.query.params.filters[0], {
        operator: 'eq',
        property_name: 'property',
        property_value: 'value'
      });
    });

    it('should allow filters with values that are null or false', function(){
      this.query.addFilter('a', 'eq', null);
      this.query.addFilter('b', 'eq', false);
      assert.deepEqual(this.query.params.filters[0], {
        operator: 'eq',
        property_name: 'a',
        property_value: null
      });
      assert.deepEqual(this.query.params.filters[1], {
        operator: 'eq',
        property_name: 'b',
        property_value: false
      });
    });

    it('should allow multiple filters on the same property name', function(){
      this.query.addFilter('a', 'eq', 'b');
      this.query.addFilter('a', 'eq', 'c');
      assert.deepEqual(this.query.params.filters[0], {
        operator: 'eq',
        property_name: 'a',
        property_value: 'b'
      });
      assert.deepEqual(this.query.params.filters[1], {
        operator: 'eq',
        property_name: 'a',
        property_value: 'c'
      });
    });

  });

  describe('.get()', function(){

    beforeEach(function(){
      this.query = new KeenClient.Query('count', {
        eventCollection: 'pageviews',
        timeframe: 'this_7_days'
      });
    });

    afterEach(function(){
      this.query = void 0;
    });

    it('should return values for camelCased attributes', function(){
      assert.equal(this.query.get('eventCollection'), 'pageviews');
    });

    it('should return values for underscored attributes', function(){
      assert.equal(this.query.get('event_collection'), 'pageviews');
    });

  });

  describe('.set()', function(){

    beforeEach(function(){
      this.query = new KeenClient.Query('count', {
        eventCollection: 'pageviews',
        timeframe: 'this_7_days'
      });
    });

    afterEach(function(){
      this.query = void 0;
    });

    it('should set multiple specified attributes', function(){
      this.query.set({ timeframe: 'this_7_days', interval: 'daily' });
      assert.equal(this.query.params.timeframe, 'this_7_days');
      assert.equal(this.query.params.interval, 'daily');
    });

    it('should apply the latest attribute over previous values', function(){
      this.query.set({ timeframe: 'this_7_days', interval: 'daily' });
      this.query.set({ timeframe: 'this_21_days' });
      this.query.set({ timeframe: 'this_14_days' });
      assert.equal(this.query.params.timeframe, 'this_14_days');
      assert.equal(this.query.params.interval, 'daily');
    });

  });

});
