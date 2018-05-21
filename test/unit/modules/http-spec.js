import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/index';
import parseQueryString from '../helpers/parse-query-string';

// Mock XHR
const mockXHR = jest.fn();
window.XMLHttpRequest = () => {};
window.XMLHttpRequest.prototype.status = 0;
window.XMLHttpRequest.prototype.headers = {};
window.XMLHttpRequest.prototype.request = {};
window.XMLHttpRequest.prototype.open = function(method, url) {
  this.request = { method, url };
}
window.XMLHttpRequest.prototype.setRequestHeader = function(key, value){
  this.headers[key] = value;
}
window.XMLHttpRequest.prototype.send = function(){
  this.status = 200;
  this.readyState = 4;
  this.responseText = helpers.responses.success;
  this.onreadystatechange();
  const queryParams = parseQueryString(this.request.url);
  mockXHR(this.headers, this.request, queryParams);
}

describe('HTTP methods', () => {
  let client;

  beforeEach(() => {
    mockXHR.mockClear();
    client = new KeenClient(helpers.client);
  });

  describe('.get()', () => {

    it('should make a GET request to an API endpoint', () => {
      client
        .get(client.url('projectId'))
        .auth(client.masterKey())
        .send();

      expect(mockXHR)
        .toBeCalledWith(
          {
            Authorization: client.masterKey(),
            'Content-type': 'application/json'
          },
          {
            method: "GET",
            url: expect.any(String)
          },
          {
            api_key: expect.any(String),
            "": "undefined", // todo FIX
          }
        );
    });

    it('should make a GET request with data to an API endpoint', () => {
      client
        .get(client.url('queries', 'count'))
        .auth(client.readKey())
        .send({
          event_collection: 'pageview',
          timeframe: 'this_12_months',
          timezone: 0
        });
      expect(mockXHR).toBeCalledWith(
        {
          Authorization: client.readKey(),
          'Content-type': 'application/json'
        },
        {
          method: "GET",
          url: expect.any(String)
        },
        {}
      );
    });
/*


  });

  describe('.post()', () => {

    it('should make a POST request with data to an API endpoint', () => {
      client
        .post(client.url('queries', 'count'))
        .auth(client.readKey())
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
*/
  });

});
