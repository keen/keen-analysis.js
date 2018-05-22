import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/browser';

describe('Client accessors', () => {
  let client;

  beforeEach(() => {
    client = new KeenClient(helpers.client);
  });

  describe('.readKey()', () => {

    it('should get the correct readKey value', function(){
      expect(client.readKey()).toBe(helpers.client.readKey);
    });

    it('should set a readKey value', function(){
      client.readKey('123');
      expect(client.config.readKey).toBe('123');
    });

  });

});
