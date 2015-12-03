var expect = require('chai').expect;
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
      expect(q).to.be.an.instanceof(KeenClient.Query);
    });

    it('should have a correct analysis propery', function(){
      var q = new KeenClient.Query('count');
      expect(q).to.have.property('analysis').eql('count');
    });

    it('should have a params object', function(){
      var q = new KeenClient.Query('count');
      expect(q).to.have.property('params');
    });

    it('should have a params.event_collection property', function(){
      var q = new KeenClient.Query('count', {
        eventCollection: 'pageviews'
      });
      expect(q.params).to.have.property('event_collection').eql('pageviews');
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
      expect(function(){ self.run(null); }).to.throw(Error);
      expect(function(){ self.run({}); }).to.throw(Error);
      expect(function(){ self.run(0); }).to.throw(Error);
    });

    it('should return a response when successful', function(){
      this.client.run(this.query, function(err, res){
        expect(err).to.be.a('null');
        expect(res).to.be.an('object');
      });
    });

    it('should return an error when unsuccessful', function(){
      var q = new KeenClient.Query('count');
      this.client.run(q, function(err, res){
        // console.log(err, res);
        expect(err).to.exist;
        expect(err['error_code']).to.exist;
        expect(res).to.be.a('null');
      });
    });

    it('should handle multiple query objects', function(done){
      this.client.run([this.query, this.query, this.query], function(err, res){
        expect(err).to.be.a('null');
        expect(res).to.be.an('array')
          .and.to.have.length(3);
        done();
      });
    });

    it('should return a promise', function(done){
      this.client
        .run([this.query, this.query, this.query])
        .then(function(res){
          expect(res).to.be.an('array')
            .and.to.have.length(3);
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
      expect(this.query.params).to.have.property('filters')
        .that.is.an('array')
        .with.deep.property('[0]')
        .that.deep.equals({
          operator: 'eq',
          property_name: 'property',
          property_value: 'value'
        });
    });

    it('should allow filters with values that are null or false', function(){
      this.query.addFilter('a', 'eq', null);
      this.query.addFilter('b', 'eq', false);
      expect(this.query.params.filters[0]).to.deep.equals({
        operator: 'eq',
        property_name: 'a',
        property_value: null
      });
      expect(this.query.params.filters[1]).to.deep.equals({
        operator: 'eq',
        property_name: 'b',
        property_value: false
      });
    });

    it('should allow multiple filters on the same property name', function(){
      this.query.addFilter('a', 'eq', 'b');
      this.query.addFilter('a', 'eq', 'c');
      expect(this.query.params.filters[0]).to.deep.equals({
        operator: 'eq',
        property_name: 'a',
        property_value: 'b'
      });
      expect(this.query.params.filters[1]).to.deep.equals({
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
      expect(this.query.get('eventCollection')).to.eql('pageviews');
    });

    it('should return values for underscored attributes', function(){
      expect(this.query.get('event_collection')).to.eql('pageviews');
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
      expect(this.query.params).to.have.property('timeframe').eql('this_7_days');
      expect(this.query.params).to.have.property('interval').eql('daily');
    });

    it('should apply the latest attribute over previous values', function(){
      this.query.set({ timeframe: 'this_7_days', interval: 'daily' });
      this.query.set({ timeframe: 'this_21_days' });
      this.query.set({ timeframe: 'this_14_days' });
      expect(this.query.params).to.have.property('timeframe').eql('this_14_days');
      expect(this.query.params).to.have.property('interval').eql('daily');
    });

  });

});
