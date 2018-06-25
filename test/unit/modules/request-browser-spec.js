import helpers from '../helpers/client-config';
// import KeenClient from '../../../dist/keen-analysis.js';
import KeenClient from '../../../lib/browser';

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
  const dummyQueryData = {
    query: {
      analysis_type: 'count',
      event_collection: 'purchases',
      timeframe: 'this_2_weeks',
      filters: [
        {
          property_name: 'price',
          operator: 'gte',
          property_value: 1.00
        }
      ]
    },
    metadata: {
      display_name: 'Purchases (past 2 weeks)',
    },
    refresh_rate: 0
  };

  beforeEach(() => {
    // XHRmock.setup();
    fetch.resetMocks();
    client = new KeenClient(helpers.client);
    requestKey = client.readKey();
  });

  afterEach(() => {
    // XHRmock.teardown();
  });

  describe('.auth()', () => {
    it('should set the given api_key value', () => {
      const req = client.get(apiQueryUrl).auth('123');
      expect(req.config.api_key).toBe('123');
    });
  });

  describe('.timeout()', () => {
    it('should set the given timeout value', () => {
      const req = client.get(apiQueryUrl).timeout(100);
      expect(req.config.timeout).toBe(100);
    });
  });

  describe('.headers()', () => {
    it('should set the given headers value', () => {
      const req = client.get(apiQueryUrl).headers({'x-custom-header':'123'});
      expect(req.config.headers['x-custom-header']).toBe('123');
    });
  });

  describe('.query()', () => {
    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyResponse));

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
        });
    });

    it('should make a POST request with data to a query endpoint, returning an error when unsuccessful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyErrorResponse));
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
      fetch.mockResponseOnce(JSON.stringify(dummyResponse));
      await client
        .query('saved', 'clicks')
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should throw error if response JSON is not valid', async () => {
      fetch.mockResponseOnce(JSON.stringify("invalid text"));
      await client
        .put(client.url('queries', 'saved', 'some-saved-query1'))
        .auth(client.masterKey())
        .send(dummyQueryData)
        .then(res => {
          expect(true).toBe(false);
        })
        .catch(err => {
          expect(err).not.toBe(null);
          expect(err).toBeInstanceOf(Object);
        });
    });

    it('should make a PUT request to a saved query endpoint, returning a response when successful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyResponse));
      await client
        .put(client.url('queries', 'saved', 'some-saved-query1'))
        .auth(client.masterKey())
        .send(dummyQueryData)
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a DELETE request to a saved query endpoint, returning a response when successful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyResponse));
      await client
        .del(client.url('queries', 'saved', 'new-saved-query'))
        .auth(client.masterKey())
        .send()
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a GET request to a saved query endpoint, returning an error when unsuccessful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyErrorResponse));
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
