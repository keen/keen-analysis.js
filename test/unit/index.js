var expect = require('chai').expect;

var Keen = require('../../lib/index');

describe('Client accessors', function(){

  beforeEach(function(){
    this.client = new Keen({
      projectId: '123',
      readKey: '456'
    });
  });

  afterEach(function(){
    this.client = null;
  });

});
