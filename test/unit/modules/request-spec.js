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

  describe('.auth()', function(){
    it('should set the given api_key value', function(){
      var req = this.client.get('/test').auth('123');
      expect(req.config.api_key).to.eql('123');
    });
  });

  describe('.timeout()', function(){
    it('should set the given timeout value', function(){
      var req = this.client.get('/test').timeout(100);
      expect(req.config.timeout).to.eql(100);
    });
  });

});
