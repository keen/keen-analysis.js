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

  it('should pass', function(){
    expect(1).to.eql(1);
  });

});
