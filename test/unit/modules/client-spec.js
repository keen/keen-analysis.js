var expect = require('chai').expect;
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
      expect(this.client.readKey()).to.eql(helpers.client.readKey);
    });

    it('should set a readKey value', function(){
      this.client.readKey('123');
      expect(this.client.config.readKey).to.eql('123');
    });

  });

  describe('.masterKey()', function(){

    it('should get the correct masterKey value', function(){
      expect(this.client.masterKey()).to.eql(helpers.client.masterKey);
    });

    it('should set a masterKey value', function(){
      this.client.masterKey('123');
      expect(this.client.config.masterKey).to.eql('123');
    });

  });

});
