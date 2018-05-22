import helpers from '../helpers/client-config';
import KeenClient from '../../../lib/index';
import XHRmock from 'xhr-mock';

describe('Keen.Query', () => {
  let client;
  let query;
  const queryObject = {
    analysis_type: 'count',
    event_collection: 'pageview',
    timeframe: 'this_12_months'
  };
  const apiQueryUrl = new RegExp('queries/count');
  let requestKey;
  const dummyResponse = { result: 123 };
  const dummyErrorResponse = { error: true };

  beforeEach(() => {
    XHRmock.setup();
    client = new KeenClient(helpers.client);
    query = new KeenClient.Query(queryObject.analysis_type, {
      event_collection: queryObject.event_collection,
      timeframe: queryObject.timeframe
    });
    requestKey = client.readKey();
  });

  afterEach(() => {
    XHRmock.teardown();
  });

  beforeEach(() => {
    query = new KeenClient.Query(queryObject.analysis_type, {
      event_collection: queryObject.event_collection,
      timeframe: queryObject.timeframe
    });
    requestKey = client.readKey();
  });

  describe('Constructor', function() {

    it('should create a new Keen.Query instance', () => {
      const q = new KeenClient.Query('count', {
        eventCollection: 'pageviews'
      });
      expect(q).toBeInstanceOf(KeenClient.Query);
    });

    it('should have a correct analysis propery', () => {
      const q = new KeenClient.Query('count');
      expect(q.analysis).toBe('count');
    });

    it('should have a params object', () => {
      const q = new KeenClient.Query('count');
      expect(q.params).toBeInstanceOf(Object);
    });

    it('should have a params.event_collection property', () => {
      const q = new KeenClient.Query('count', {
        eventCollection: 'pageviews'
      });
      expect(q.params.event_collection).toBe('pageviews');
    });

  });

  describe('<Client.run> (Keen client instance)', () => {

    it('should return undefined when passed an invalid input', () => {
      expect(client.run(null)).toBe(undefined);
      expect(client.run(0)).toBe(undefined);
      expect(client.run({})).toBe(undefined);
      expect(client.run([])).toBe(undefined);
    });

    it('should return a response and query parameters when successful', async () => {
      XHRmock.post(apiQueryUrl,
        (req, res) => {
          expect(req.header('Content-Type')).toEqual('application/json');
          expect(req.header('Authorization')).toEqual(requestKey);
          return res.status(200).body(JSON.stringify(dummyResponse));
      });

      await client.run(query).then(res => {
        expect(res).toMatchObject(dummyResponse);
        expect(res.query).toMatchObject(queryObject);
      });
    });

    it('should add timezone to the query', async () => {
      XHRmock.post(apiQueryUrl,
        (req, res) => {
          return res.status(200).body(JSON.stringify(dummyResponse));
      });

      await client.run(query).then(res => {
        expect(res.query.timezone).not.toBe(undefined);
      });
    });

    it('should return an error when unsuccessful', async () => {
      XHRmock.post(apiQueryUrl,
        (req, res) => {
          return res.status(404).body(JSON.stringify(dummyErrorResponse));
      });

      try {
        const user = await client.run(query);
      } catch (error) {
        expect(error).toEqual(dummyErrorResponse);
      }
    });

    it('should handle multiple query objects', async () => {
      const count = jest.fn();
      XHRmock.post(apiQueryUrl,
        (req, res) => {
          count();
          return res.status(200).body(JSON.stringify(dummyResponse));
      });
      const queries = [query, query, query];
      await client.run(queries).then(res => {
        expect(count).toHaveBeenCalledTimes(queries.length);
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBe(queries.length);
        expect(res[1].query).toMatchObject(queries[1].params);
      });
    });
  });

  describe('.addFilter()', () => {

    it('should add filters correctly', () => {
      query.addFilter('property', 'eq', 'value');
      expect(query.params.filters).toBeInstanceOf(Array);
      expect(query.params.filters[0]).toEqual({
        operator: 'eq',
        property_name: 'property',
        property_value: 'value'
      });
    });

    it('should allow filters with values that are null or false', () => {
      query.addFilter('a', 'eq', null);
      query.addFilter('b', 'eq', false);
      expect(query.params.filters[0]).toEqual({
        operator: 'eq',
        property_name: 'a',
        property_value: null
      });
      expect(query.params.filters[1]).toEqual({
        operator: 'eq',
        property_name: 'b',
        property_value: false
      });
    });

    it('should allow multiple filters on the same property name', () => {
      query.addFilter('a', 'eq', 'b');
      query.addFilter('a', 'eq', 'c');
      expect(query.params.filters[0]).toEqual({
        operator: 'eq',
        property_name: 'a',
        property_value: 'b'
      });
      expect(query.params.filters[1]).toEqual({
        operator: 'eq',
        property_name: 'a',
        property_value: 'c'
      });
    });
  });

  describe('.get()', () => {
    it('should return values for camelCased attributes', () => {
      expect(query.get('eventCollection')).toBe('pageview');
    });

    it('should return values for underscored attributes', () => {
      expect(query.get('event_collection')).toBe('pageview');
    });
  });

  describe('.set()', () => {

    it('should set multiple specified attributes', () => {
      query.set({ timeframe: 'this_7_days', interval: 'daily' });
      expect(query.params.timeframe).toBe('this_7_days');
      expect(query.params.interval).toBe('daily');
    });

    it('should apply the latest attribute over previous values', () => {
      query.set({ timeframe: 'this_7_days', interval: 'daily' });
      query.set({ timeframe: 'this_21_days' });
      query.set({ timeframe: 'this_14_days' });
      expect(query.params.timeframe).toBe('this_14_days');
      expect(query.params.interval).toBe('daily');
    });

  });

});
