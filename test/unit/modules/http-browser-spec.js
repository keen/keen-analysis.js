var expect = require('chai').expect;
var helpers = require('../helpers/client-config');

var KeenClient = require('../../../lib/index');

describe('HTTP methods (browser)', function(){

  beforeEach(function(){
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
        .then(done)
        .catch(done);
    });

    // it('should get the correct readKey value', function(){
    //   expect(this.client.readKey()).to.eql(helpers.client.readKey);
    // });
    //
    // it('should set a readKey value', function(){
    //   this.client.readKey('123');
    //   expect(this.client.config.readKey).to.eql('123');
    // });

  });

});
