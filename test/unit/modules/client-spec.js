var expect = require('chai').expect;
var helpers = require('../helpers/client-config');

var Keen = require('../../../lib/index');

describe('Client accessors', function(){

  beforeEach(function(){
    this.client = new Keen(helpers.client);
  });

  afterEach(function(){
    this.client = null;
  });

  describe('.readKey()', function(){

    it('should set a readKey value', function(){
      this.client.readKey('123');
      expect(this.client.config.readKey).to.eql('123');
    });

    it('should get the correct readKey value', function(){
      expect(this.client.readKey()).to.eql(helpers.client.readKey);
    });

  });

});
