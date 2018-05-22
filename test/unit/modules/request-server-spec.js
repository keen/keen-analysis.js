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

  beforeEach(() => {
    client = new KeenClient(helpers.client);
    requestKey = client.readKey();
  });

  afterEach(() => {

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
        .replyWithError(404)
        //.replyWithError(404)
        ;

      await expect(() => { client
        .query('count', {
          event_collection: false
        })
      }).toThrow();
    });

/*


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
    */

  });

});
