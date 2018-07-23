const demoTests = (demoConfig, Keen) => {
  const client = new Keen(demoConfig);

  Keen.debug = true;

  client
    .query('count', {
      event_collection: 'pageviews',
      timeframe: 'this_144_days'
    }, {cache: { maxAge: 5000 }})
    .then(res => {
      console.log(res);
        // Handle results
    })
    .catch(err => {
      console.log('err', err);
      // Handle errors
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
