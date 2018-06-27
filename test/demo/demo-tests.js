const demoTests = (demoConfig, Keen) => {
  const client = new Keen({ ...demoConfig, timeout: 100 });

  Keen.debug = true;

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
  }, 2000);

  const abortedQuery = client.query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_144_days'
    });
  abortedQuery.abort();
  abortedQuery.then(res => {
    console.log('aborted', res);
  })
  .catch(err => {
    console.log('aborted errx', err);
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
