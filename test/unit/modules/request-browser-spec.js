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
  const apiQueryUrl = 'queries/count';
  const dummyResponse = { result: 123 };
  const dummyNormalResponse = { result: 14.212}
  const dummyRoundResponse = { result: 14 }
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
    fetch.resetMocks();
    client = new KeenClient(helpers.client);
    requestKey = client.readKey();
  });

  afterEach(() => {
  });

  /* DEPRECATED but still supported */
  describe('.auth()', () => {
    it('should set the given api_key value', () => {
      const req = client.get(apiQueryUrl).auth('123');
      expect(req.config.api_key).toBe('123');
    });
  });

  /* DEPRECATED but still supported */
  describe('.headers()', () => {
    it('should set the given headers value', () => {
      const req = client.get(apiQueryUrl).headers({'x-custom-header':'123'});
      expect(req.config.headers['x-custom-header']).toBe('123');
    });
  });

  describe('.query()', () => {

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyResponse));
      const queryParams = {
        analysis_type: 'count',
        event_collection: 'pageview',
        timeframe: 'this_12_months'
      };
      await client
        .query(queryParams)
        .then(res => {
          expect(fetch.mock.calls.length).toEqual(1);
          expect(fetch.mock.calls[0][0]).toContain('api.keen.io');
          const fetchOptions = fetch.mock.calls[0][1];
          expect(JSON.parse(fetchOptions.body)).toMatchObject(queryParams);
          expect(fetchOptions.method).toBe('POST');
          expect(fetchOptions.mode).toBe('cors');
          expect(fetchOptions.headers.Authorization).toBe(client.config.readKey);
          expect(fetchOptions.signal).not.toBe(undefined);
          expect(res.query.analysis_type).toBe('count');
          expect(res.query.event_collection).toBe('pageview');
          expect(res.query.timeframe).toBe('this_12_months');
          expect(res.result).toBe(dummyResponse.result);
        });
    });

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful, and rounding values when needed', async () => {
      fetch.mockResponseOnce(JSON.stringify(dummyNormalResponse));
      const queryParams = {
        analysis_type: 'average',
        event_collection: 'pageview',
        timeframe: 'this_12_months'
      };
      await client
        .query(queryParams)
        .then(res => {
          expect(fetch.mock.calls.length).toEqual(1);
          expect(fetch.mock.calls[0][0]).toContain('api.keen.io');
          const fetchOptions = fetch.mock.calls[0][1];
          expect(JSON.parse(fetchOptions.body)).toMatchObject(queryParams);
          expect(fetchOptions.method).toBe('POST');
          expect(fetchOptions.mode).toBe('cors');
          expect(fetchOptions.headers.Authorization).toBe(client.config.readKey);
          expect(fetchOptions.signal).not.toBe(undefined);
          expect(res.query.analysis_type).toBe('average');
          expect(res.query.event_collection).toBe('pageview');
          expect(res.query.timeframe).toBe('this_12_months');
          expect(parseInt(res.result)).toBe(dummyRoundResponse.result);
        });
    });

    describe('cache', () => {
      it('should not cache the query by default', async () => {
        fetch.mockResponseOnce(JSON.stringify(dummyResponse));
        const queryParams = {
          analysis_type: 'count',
          event_collection: 'pageview',
          timeframe: 'this_14_months'
        };
        await client
          .query(queryParams)
          .then(res => {
            expect(fetch.mock.calls.length).toEqual(1);
          });
        const dummyData = { notcached: 1 };
        fetch.mockResponseOnce(JSON.stringify(dummyData));
        await client
          .query(queryParams)
          .then(res => {
            expect(res).toMatchObject(dummyData);
            expect(fetch.mock.calls.length).toEqual(2);
          });
      });
      it('should cache the query if cache param is present', async () => {
        fetch.mockResponseOnce(JSON.stringify(dummyResponse));
        const queryParams = {
          analysis_type: 'count',
          event_collection: 'pageview',
          timeframe: 'this_14_months',
          cache: {
            maxAge: 10000
          }
        };
        await client
          .query(queryParams)
          .then(res => {
            expect(fetch.mock.calls.length).toEqual(1);
          });
        fetch.mockResponseOnce(JSON.stringify({}));
        await client
          .query(queryParams)
          .then(res => {
            expect(res).toMatchObject(dummyResponse);
            expect(fetch.mock.calls.length).toEqual(1);
          });
      });
    });

    /* DEPRECATED but still supported */
    describe('deprecated implementation', () => {
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
      fetch.mockResponseOnce(JSON.stringify({}));
      await client
        .del(client.url('queries', 'saved', 'new-saved-query'))
        .auth(client.masterKey())
        .send()
        .then(res => {
          expect(res).toEqual({});
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

});
