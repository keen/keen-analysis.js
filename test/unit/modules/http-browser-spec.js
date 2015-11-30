var expect = require('chai').expect;
var helpers = require('../helpers/client-config');

var KeenClient = require('../../../lib/index');

describe('HTTP methods (browser)', function(){

  beforeEach(function(){
    this.timeout(10 * 1000);
    this.client = new KeenClient(helpers.client);
  });

  afterEach(function(){
    this.client = null;
  });

  describe('.get()', function(){

    it('should make a GET request to an API endpoint', function(done){
      this.client
        .get(this.client.url('projectId'))
        .auth(this.client.masterKey())
        .send()
        .then(function(res){
          done();
        })
        .catch(done);
    });

    it('should make a GET request with data to an API endpoint', function(done){
      this.client
        .get(this.client.url('queries', 'count'))
        .auth(this.client.readKey())
        .send({
          event_collection: 'pageview',
          timeframe: 'this_12_months'
        })
        .then(function(res){
          done();
        })
        .catch(done);
    });

  });

  describe('.post()', function(){

    it('should make a POST request with data to an API endpoint', function(done){
      this.client
        .post(this.client.url('queries', 'count'))
        .auth(this.client.readKey())
        .send({
          event_collection: 'pageview',
          timeframe: 'this_12_months'
        })
        .then(function(res){
          done();
        })
        .catch(done);
    });

  });

});
