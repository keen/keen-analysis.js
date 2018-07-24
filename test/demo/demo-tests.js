const demoTests = (demoConfig, Keen) => {
  const client = new Keen(demoConfig);

  Keen.debug = true;

  return;

  const newDatasetName = 'my-first-dataset2';

  client
    .query({
      dataset_name: newDatasetName,
      index_by: 'customer.id',
      timeframe: 'this_7_days'
    })
    .then(res => {
      console.log(res);
      // Handle results
    })
    .catch(err => {
      // Handle errors
    });
return;

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
          timeframe: 'this_500_days'
        },
        index_by: 'product.id'
      }
    })
    .then(res => {
      console.log('res', res);
      // Handle response
    })
    .catch(err => {
      // Handle error
    });
return;

  client
    .query({
      saved_query_name: 'daily-pageviews-this-15-days'
    })
    .then(res => {
      // Handle results
    })
    .catch(err => {
      // Handle errors
    });
  return;


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
    // .auth(client.config.readKey)
    // .send()
    .then(res => {
      console.log('res', res);
      // Handle results
    })
    .catch(err => {
      console.error(err);
      // Handle errors
    });

    return;
  client
    .put(client.url('queries', 'saved', 'daily-pageviews-this-14-days'))
    .auth(client.config.readKey)
    .send({
      refresh_rate: 60 * 60 * 4, // API will recalculate it every 4 hours [secs]
      query: {
        analysis_type: 'count',
        event_collection: 'pageviews',
        timeframe: 'this_15_days'
      },
      metadata: {
        display_name: 'Daily pageviews (this 14 days)',
        visualization: {
          chart_type: "metric"
        }
      }
      // ...
    })
    .then(res => {
      // Handle results
    })
    .catch(err => {
      // Handle errors
    });

    return;



return;
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
      console.log(res);
        // Handle results
    })
    .catch(err => {
      console.log('err', err);
      // Handle errors
    });


  client
    .query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_144_days'
    }, { cache: { maxAge: 5000 } })
    .then(res => {
      console.log(res);
        // Handle results
    })
    .catch(err => {
      console.log('err', err);
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
      console.log('runs', res);
    })
    .catch(err => {
      console.log('err', err);
    });
    return;

  const query = client
    .get(client.url('queries', 'saved'), { cache: { maxAge: 10000 } })
    .auth(client.masterKey())
    .send();

  // cancel ?
  // query.abort();

  query.then((res) => {
    console.log('saved queries', res);
  }).catch((err) => {
    console.error(err);
  })

  setTimeout(() => {
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
  }, 1000);

  const abortedQuery = client.query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_100_days'
    });
  abortedQuery.abort();
  abortedQuery.then(res => {
    console.log('you shouldnt see this - aborted', res);
  })
  .catch(err => {
    console.log('you shouldnt see this - aborted err', err);
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

  const qq1 = new Keen.Query('count', {
    event_collection: 'pageviews',
    timeframe: 'this_1_days'
  });

  const qq2 = new Keen.Query('count', {
    event_collection: 'pageviews',
    timeframe: 'this_30_days'
  });

  const runs = client.run([qq1, qq2]);
  runs.then(res => {
    console.log('runs', res);
  })
  .catch(err => {
    console.log('err', err);
  });

  const singleRun = client.run(qq1, (err, res) =>{
    if (err) {
      console.log('err', err);
    }
    else {
      console.log('single run', res);
    }
  });
}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
