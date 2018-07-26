const demoTests = (demoConfig, Keen) => {
  const client = new Keen({ ...demoConfig});

  Keen.debug = true;
  client
    .query({
      analysis_type: 'count',
      event_collection: 'pageviews',
      timeframe: 'this_32_days',
      cache:{
        maxAge:4000
      }
    }).then(res=>console.log(res))
    .catch(er => console.log('er', er));

    client
      .query({
        analysis_type: 'count',
        event_collection: 'pageviews',
        timeframe: 'this_32_days'
      }).then(res=>console.log(res));

  const getPageviews = async () => {
    try {
      const result = await client
        .query({
          analysis_type: 'count',
          event_collection: 'pageviews',
          timeframe: 'this_31_days',
          cache: false
        });
      console.log('Await Result pageviews', result);
      return result;
    } catch (error) {
      console.error('Await Error pageviews', error);
    }
  }
  getPageviews();
  return;

  const newDatasetName = 'my-first-dataset2';

  client
    .query({
      dataset_name: newDatasetName,
      index_by: 'customer.id',
      timeframe: 'this_7_days'
    })
    .then(res => {
      console.log('get from dataset', res);
      // Handle results
    })
    .catch(err => {
      // Handle errors
      console.error('get from dataset err', err)
    });


  client
    .put({
      url: client.url('datasets', newDatasetName),
      api_key: client.config.masterKey,
      params: {
        display_name: 'Count Daily Product Purchases Over $100 by Country',
        query: {
          analysis_type: 'count',
          event_collection: 'purchases',
          filters: [
            {
              property_name: 'price',
              operator: 'gte',
              property_value: 100
            }
          ],
          group_by: 'ip_geo_info.country',
          interval: 'daily',
          timeframe: 'this_300_days'
        },
        index_by: 'product.id'
      }
    })
    .then(res => {
      console.log('create dataset res', res);
      // Handle response
    })
    .catch(err => {
        console.error('create dataset error res', err);
      // Handle error
    });

  client
    .query({
      saved_query_name: 'daily-pageviews-this-15-days'
    })
    .then(res => {
      // Handle results
      console.log('get saved q', res);
    })
    .catch(err => {
      // Handle errors
      console.error('get saved q err', err);
    });

  client
    .put({
      url: client.url('queries', 'saved', 'daily-pageviews-this-15-days'),
      api_key: client.config.masterKey,
      params: {
        refresh_rate: 60 * 60 * 4, // API will recalculate it every 4 hours [secs]
        query: {
          analysis_type: 'count',
          event_collection: 'pageviews',
          timeframe: 'this_16_days'
        },
        metadata: {
          display_name: 'Daily pageviews (this 14 days)',
          visualization: {
            chart_type: "metric"
          }
        }
      }
    })
    .then(res => {
      console.log('create saved res', res);
      // Handle results
    })
    .catch(err => {
      console.error('create saved err', err);
      // Handle errors
    });

  client
    .query({
      analysis_type: 'count',
      event_collection: 'pageviews',
      timeframe: 'this_15_days',
      cache: {
        maxAge: 10000
      }
    })
    .then(res => {
      client
        .query({
          analysis_type: 'count',
          event_collection: 'pageviews',
          timeframe: 'this_15_days',
          cache: {
            maxAge: 10000
          }
        }).then(res2 => {
          console.log('get to cache copy', res);
          console.log('got from cache', res2);
        });
        // Handle results
    })
    .catch(err => {
      console.error('err', err);
      // Handle errors
    });

    const qq11 = client.query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_1_days'
    });

    const qq21 = new Keen.Query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_30_days',
      timezone: 7200
    });

    const runs1 = client.run([qq11, qq21]);
    runs1.then(res => {
      console.log('client.runs', res);
    })
    .catch(err => {
      console.error('client.runs err', err);
    });

  const abortedQuery = client.query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_100_days'
    });
  abortedQuery.abort();
  abortedQuery.then(res => {
    console.error('you shouldnt see this - query was aborted', res);
  })
  .catch(err => {
    console.error('you shouldnt see this - query was aborted err', err);
  });

  client
    .query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_144_days'
    })
    .then(res => {
      console.log(res);
        // Handle results
    })
    .catch(err => {
      console.log('err', err);
      // Handle errors
    });

}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
