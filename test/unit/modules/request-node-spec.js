import nock from 'nock';

import config from '../helpers/client-config';
import KeenClient from '../../..';

describe('Node Request methods', () => {

  let client;
  const requestKey = config.client.readKey;

  const queryObject = {
    analysis_type: 'count',
    event_collection: 'pageview',
    timeframe: 'this_12_months',
    timezone: 3600
  };
  const dummyResponse = { result: 123, query: {...queryObject} };
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

  beforeAll(() => {
    nock(/./, {
      reqheaders: {
        'authorization': requestKey,
        'content-type': 'application/json'
      }
      })
      .persist()
      .post(/./, JSON.stringify(queryObject))
      .reply(200, dummyResponse);

    nock(/./, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json'
        }
      })
      .persist()
      .post(/./, JSON.stringify({
        analysis_type: queryObject.analysis_type,
        event_collection: false,
        timezone: 3600
      }))
      .reply(500, {error_code: 500, message: 'Error'});

    nock(/./, {
      reqheaders: {
        'authorization': requestKey,
        'content-type': 'application/json'
      }
      })
      .persist()
      .get(/saved\/clicks/)
      .reply(200, dummyResponse);

    nock(/./, {
      reqheaders: {
        'authorization': requestKey,
        'content-type': 'application/json'
      }
      })
      .persist()
      .get(/saved\/does\-not\-exist/)
      .reply(500, {error_code: 500, message: 'Error'});

    nock(/./, {
        reqheaders: {
          'authorization': config.client.masterKey,
          'content-type': 'application/json'
        }
      })
      .persist()
      .put(/./, JSON.stringify(dummyQueryData))
      .reply(200, dummyResponse);

    nock(/./, {
        reqheaders: {
          'authorization': config.client.masterKey,
          'content-type': 'application/json'
        }
      })
      .persist()
      .delete(/delete\-new\-saved\-query/)
      .reply(200, dummyResponse);

    nock(/./, {
      reqheaders: {
        'authorization': requestKey,
        'content-type': 'application/json'
      }
      })
      .persist()
      .get(/saved\/invalid\-json/)
      .reply(200, "invalid text instead of json");

  });

  beforeEach(() => {
    client = new KeenClient(config.client);
  });



  describe('.query()', () => {
    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      await client
        .query({
          analysis_type: 'count',
          event_collection: 'pageview',
          timeframe: 'this_12_months',
          timezone: 3600
        })
        .then(res => {
          expect(res.query.analysis_type).toBe('count');
          expect(res.query.event_collection).toBe('pageview');
          expect(res.query.timeframe).toBe('this_12_months');
          expect(res.result).toBe(dummyResponse.result);
        });
    });

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      await client
        .query('count', {
          event_collection: 'pageview',
          timeframe: 'this_12_months',
          timezone: 3600
        })
        .then(res => {
          expect(res.query.analysis_type).toBe('count');
          expect(res.query.event_collection).toBe('pageview');
          expect(res.query.timeframe).toBe('this_12_months');
          expect(res.result).toBe(dummyResponse.result);
        });
    });

    it('should make a POST request with data to a query endpoint, returning an error when unsuccessful', async () => {
      await client
          .query('count', {
            event_collection: false,
            timezone: 3600
          })
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
            expect(err.code).toBe(500);
          });
    });

    it('should make a GET request to a saved query endpoint, returning a response when successful', async () => {
      await client
        .query('saved', 'clicks')
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a GET request with data to a query endpoint, returning an error when unsuccessful', async () => {
      await client
          .query('saved', 'does-not-exist')
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
            expect(err.code).toBe(500);
          });
    });

    it('should make a PUT request to a saved query endpoint, returning a response when successful', async () => {
      await client
        .put(client.url('queries', 'saved', 'some-saved-query1'))
        .auth(client.masterKey())
        .send(dummyQueryData)
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a DELETE request to a saved query endpoint, returning a response when successful', async () => {
      await client
        .del(client.url('queries', 'saved', 'delete-new-saved-query'))
        .auth(client.masterKey())
        .send()
        .then(res => {
          expect(res).toEqual(dummyResponse);
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

    it('should return an error when API response is not valid JSON', async () => {
      await client
          .query('saved', 'invalid-json')
          .catch(err => {
            expect(/Unexpected token/.test(err.message)).toBe(true);
            expect(err).toBeInstanceOf(Error);
          });
    });

  });

});
