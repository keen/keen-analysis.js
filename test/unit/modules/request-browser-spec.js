import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/browser';
import XHRmock from 'xhr-mock';

describe('Browser Request methods', () => {

  let client;
  let requestKey;

  const queryObject = {
    analysis_type: 'count',
    event_collection: 'pageview',
    timeframe: 'this_12_months'
  };
  const apiQueryUrl = new RegExp('queries/count');
  const dummyResponse = { result: 123 };
  const dummyErrorResponse = { error: true };

  beforeEach(() => {
    XHRmock.setup();
    client = new KeenClient(helpers.client);
    requestKey = client.readKey();
  });

  afterEach(() => {
    XHRmock.teardown();
  });

  describe('.auth()', () => {
    it('should set the given api_key value', () => {
      XHRmock.get(apiQueryUrl, {});
      const req = client.get(apiQueryUrl).auth('123');
      expect(req.config.api_key).toBe('123');
    });
  });

  describe('.timeout()', () => {
    it('should set the given timeout value', () => {
      XHRmock.get(apiQueryUrl, {});
      const req = client.get(apiQueryUrl).timeout(100);
      expect(req.config.timeout).toBe(100);
    });
  });

  describe('.headers()', () => {
    it('should set the given headers value', () => {
      XHRmock.get(apiQueryUrl, {});
      const req = client.get(apiQueryUrl).headers({'x-custom-header':'123'});
      expect(req.config.headers['x-custom-header']).toBe('123');
    });
  });

  describe('.query()', () => {

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      XHRmock.post(new RegExp('count'), (req, res) => {
        return res.status(200).body(JSON.stringify(dummyResponse));
      });
      await client
        .query('count', {
          event_collection: 'pageview',
          timeframe: 'this_12_months'
        })
        .then(res => {
          expect(res.query.analysis_type).toBe('count');
          expect(res.query.event_collection).toBe('pageview');
          expect(res.query.timeframe).toBe('this_12_months');
          expect(res.result).toBe(dummyResponse.result);
        })
        .catch(err => {
          console.log(err);
        });
    });

    it('should make a POST request with data to a query endpoint, returning an error when unsuccessful', async () => {
      XHRmock.post(new RegExp('count'), (req, res) => {
        return res.status(400).body(JSON.stringify(dummyErrorResponse));
      });
      await client
        .query('count', {
          event_collection: false
        })
        .then(res => {
        })
        .catch(err => {
          expect(err).toEqual(dummyErrorResponse);
        });
    });

    it('should make a GET request to a saved query endpoint, returning a response when successful', async () => {
      XHRmock.get(new RegExp('saved'), (req, res) => {
        return res.status(200).body(JSON.stringify(dummyResponse));
      });
      await client
        .query('saved', 'clicks')
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a GET request to a saved query endpoint, returning an error when unsuccessful', async () => {
      XHRmock.get(new RegExp('saved'), (req, res) => {
        return res.status(400).body(JSON.stringify(dummyErrorResponse));
      });
      await client
        .query('saved', 'does-not-exist')
        .catch(err => {
          expect(err).toEqual(dummyErrorResponse);
        });
    });

    it('should return an error when incorrect arguments are provided', async () => {
      await client
        .query('saved/does-not-exist')
        .catch(err => {
          expect(err).toBeInstanceOf(Object);
          expect(err.message).not.toBe(undefined);
        });
    });

  });

});
