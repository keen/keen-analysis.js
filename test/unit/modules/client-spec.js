var assert = require('proclaim');
var helpers = require('../helpers/client-config');

var KeenClient = require('../../../lib/index');

describe('Client accessors', function(){

  beforeEach(function(){
    this.client = new KeenClient(helpers.client);
  });

  afterEach(function(){
    this.client = null;
  });

  describe('.readKey()', function(){

    it('should get the correct readKey value', function(){
      assert.equal(this.client.readKey(), helpers.client.readKey);
    });

    it('should set a readKey value', function(){
      this.client.readKey('123');
      assert.equal(this.client.config.readKey, '123');
    });

  });

});
