import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/browser';
import parseParams from 'keen-core/lib/utils/parse-params';

describe('HTTP methods', () => {
  let client;

  beforeEach(() => {
    fetch.resetMocks();
    client = new KeenClient(helpers.client);
  });

  afterEach(() => {
  });

  describe('.get()', () => {

    it('should make a GET request to an API endpoint', async () => {
      fetch.mockResponseOnce(JSON.stringify({}));

      await client
              .get(client.url('projectId'))
              .auth(client.readKey())
              .send();

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchArgs = fetch.mock.calls[0][1];

      expect(fetchUrl).toContain(client.url('projectId'));
      expect(fetchArgs.method).toBe('GET');
      expect(fetchArgs.mode).toBe('cors');
      expect(fetchArgs.body).toBe(undefined);
      expect(fetchArgs.headers.Authorization).toBe(client.readKey());
    });

    it('should make a GET request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      fetch.mockResponseOnce(JSON.stringify({}));

      await client
              .get(requestUrl)
              .auth(client.readKey())
              .send(requestQuery);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchArgs = fetch.mock.calls[0][1];

      expect(fetchUrl).toContain(client.url('projectId'));
      expect(parseParams(fetchUrl)).toMatchObject(requestQuery);
      expect(fetchArgs.method).toBe('GET');
      expect(fetchArgs.mode).toBe('cors');
      expect(fetchArgs.body).toBe(undefined);
      expect(fetchArgs.headers.Authorization).toBe(client.readKey());
    });

    it('should make a POST request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      fetch.mockResponseOnce(JSON.stringify({}));

      await client
              .post(requestUrl)
              .auth(client.readKey())
              .send(requestQuery);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchArgs = fetch.mock.calls[0][1];

      expect(fetchUrl).toContain(client.url('projectId'));
      expect(JSON.parse(fetchArgs.body)).toMatchObject(requestQuery);
      expect(fetchArgs.method).toBe('POST');
      expect(fetchArgs.mode).toBe('cors');
      expect(fetchArgs.headers.Authorization).toBe(client.readKey());
    });

    it('should make a PUT request with data to an API endpoint', async () => {

      const requestUrl = client.url('queries', 'count');
      const requestKey = 'dummy-master-key';
      const requestQuery = {
        event_collection: 'pageview',
        timeframe: 'this_12_months',
        timezone: '0'
      };

      fetch.mockResponseOnce(JSON.stringify({}));

      await client
              .put(requestUrl)
              .auth(client.readKey())
              .send(requestQuery);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchArgs = fetch.mock.calls[0][1];

      expect(fetchUrl).toContain(client.url('projectId'));
      expect(JSON.parse(fetchArgs.body)).toMatchObject(requestQuery);
      expect(fetchArgs.method).toBe('PUT');
      expect(fetchArgs.mode).toBe('cors');
      expect(fetchArgs.headers.Authorization).toBe(client.readKey());
    });

  });



});
