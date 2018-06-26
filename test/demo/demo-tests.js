const demoTests = (demoConfig, Keen) => {
  const client = new Keen(demoConfig);

  Keen.debug = true;
  client.abort();

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

  client.run([qq1, qq2]).then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log('err', err);
  });

  client.run(qq1, (err, res) =>{
    if (err) {
      console.log('err', err);
    }
    else {
      console.log(res);
    }
  });
}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
