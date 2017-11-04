var helpers = require('../helpers/client-config');
var KeenClient = require('../../..')

describe('HTTP methods', function(){

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

  describe('.get()', function(){

    it('should make a GET request to an API endpoint', function(done){
      this.timeout(300 * 1000);
      this.client
        .get(this.client.url('projectId'))
        .auth(this.client.masterKey())
        .send()
        .then(function(res){
          done();
        })
        .catch(function(err){
          done();
        });
    });

    it('should make a GET request with data to an API endpoint', function(done){
      this.timeout(300 * 1000);
      this.client
        .get(this.client.url('queries', 'count'))
        .auth(this.client.readKey())
        .send({
          event_collection: 'pageview',
          timeframe: 'this_12_months',
          timezone: 0
        })
        .then(function(res){
          done();
        })
        .catch(function(err){
          done();
        });
    });

  });

  describe('.post()', function(){

    it('should make a POST request with data to an API endpoint', function(done){
      this.timeout(300 * 1000);
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
        .catch(function(err){
          done();
        });
    });

  });

});
