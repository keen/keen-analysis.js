import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/index';
import XHRmock from 'xhr-mock';

describe('HTTP methods', () => {
  let client;

  beforeEach(() => {
    XHRmock.setup();
    client = new KeenClient(helpers.client);
  });

  afterEach(() => {
    XHRmock.teardown();
  });

  describe('.get()', () => {

    it('should make a GET request to an API endpoint', async () => {

      XHRmock.get(`${client.url('projectId')}?api_key=${client.readKey()}`,
        (req, res) => {
          expect(req.header('Content-Type')).toEqual('application/json');
          expect(req.header('Authorization')).toEqual(client.readKey());
          return res.status(200).body('{}');
      });

      await client
              .get(client.url('projectId'))
              .auth(client.readKey())
              .send();
    });

    it('should make a GET request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      XHRmock.get(new RegExp(requestUrl),
        (req, res) => {
          expect(req.header('Content-Type')).toEqual('application/json');
          expect(req.header('Authorization')).toEqual(client.readKey());
          requestQuery.api_key = client.readKey();
          expect(req.url().query).toEqual(requestQuery);
          return res.status(200).body('{}');
      });

      await client
              .get(requestUrl)
              .auth(client.readKey())
              .send(requestQuery);
    });

    it('should make a POST request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      XHRmock.post(new RegExp(requestUrl),
        (req, res) => {
          expect(req.header('Content-Type')).toEqual('application/json');
          expect(req.header('Authorization')).toEqual(client.readKey());
          expect(JSON.parse(req.body())).toEqual(requestQuery);
          return res.status(200).body('{}');
      });

      await client
              .post(requestUrl)
              .auth(client.readKey())
              .send(requestQuery);
    });

    it('should make a PUT request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestKey = client.masterKey();
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      XHRmock.put(new RegExp(requestUrl),
        (req, res) => {
          expect(req.header('Content-Type')).toEqual('application/json');
          expect(req.header('Authorization')).toEqual(requestKey);
          expect(JSON.parse(req.body())).toEqual(requestQuery);
          return res.status(200).body('{}');
      });

      await client
              .put(requestUrl)
              .auth(requestKey)
              .send(requestQuery);
    });

  });



});
