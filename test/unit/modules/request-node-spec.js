import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/server';
import nock from 'nock';



describe('Server Request methods', () => {

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
    client = new KeenClient(helpers.client);
    requestKey = client.readKey();
  });

  describe('.query()', () => {

    it('should make a POST request with data to a query endpoint, returning a response and query parameters when successful', async () => {
      nock(/./, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json'
        }
      })
        .post(/./)
        .reply(200, dummyResponse);

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
      nock(/./)
        .post(/./)
        .reply(404, {error_code: 404, message: 'Error'});

      await client
          .query('count', {
            event_collection: false
          })
          .then(res => {
            expect(true).toBe(false);
          })
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
            expect(err.matcherResult).toBe(undefined); // error should be emitted not from Jest
          });
    });

    it('should make a GET request to a saved query endpoint, returning a response when successful', async () => {
      nock(/./, {
        reqheaders: {
          'authorization': requestKey,
          'content-type': 'application/json'
        }
      })
        .get(/./)
        .reply(200, dummyResponse);

      await client
        .query('saved', 'clicks')
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a GET request with data to a query endpoint, returning an error when unsuccessful', async () => {
      nock(/./)
        .get(/./)
        .reply(404, {error_code: 404, message: 'Error'});

      await client
          .query('saved', 'does-not-exist')
          .then(res => {
            expect(true).toBe(false);
          })
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
            expect(err.matcherResult).toBe(undefined); // error should be emitted not from Jest
          });
    });

    it('should make a PUT request to a saved query endpoint, returning a response when successful', async () => {
      nock(/./, {
        reqheaders: {
          'authorization': client.masterKey(),
          'content-type': 'application/json'
        }
      })
        .put(/./, JSON.stringify(dummyQueryData))
        .reply(200, dummyResponse);

      await client
        .put(client.url('queries', 'saved', 'some-saved-query1'))
        .auth(client.masterKey())
        .send(dummyQueryData)
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should make a DELETE request to a saved query endpoint, returning a response when successful', async () => {
      nock(/./, {
        reqheaders: {
          'authorization': client.masterKey(),
          'content-type': 'application/json'
        }
      })
        .delete(/./)
        .reply(200, dummyResponse);

      await client
        .del(client.url('queries', 'saved', 'new-saved-query'))
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
      nock(/./)
        .get(/./)
        .reply(200, "invalid text instead of json");

      await client
          .query('saved', 'abc')
          .then(res => {
            expect(true).toBe(false);
          })
          .catch(err => {
            expect(/Unexpected token/.test(err.message)).toBe(true);
            expect(err).toBeInstanceOf(Error);
          });
    });

  });

});
