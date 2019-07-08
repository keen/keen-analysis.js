const demoTests = (demoConfig, Keen) => {
  demoConfig.resultParsers= [
    (value) => {
      return Math.round(value);
    },
    value =>  {
      return Math.round(value) + 10;
    },
    value => `last parser: ${value}`,
  ]
  const client = new Keen(demoConfig);

  // client
  // .query({
  //   analysisType: 'multi_analysis',
  //   eventCollection: 'pageviews',
  //   analyses: {
  //     'unique users': {
  //       analysisType: 'count_unique',
  //       targetProperty: 'keen.id',
  //     },
  //     'total visits': {
  //       analysisType: 'count',
  //     }
  //   },
  //   timeframe: 'this_1117_days',
  // })
  // .then(res => {
  //   // Handle results
  //   console.log(res);
  // })
  // .catch(err => {
  //   // Handle errors
  //   console.log(err);
  // });

  // return;

  client.query('count', {
    event_collection: 'pageviews',
    // group_by: 'page.url',
    interval: 'daily',
    timeframe: 'this_3_months',
    includeMetadata: false,
    metadata: {
      display_name: 'Purchases (past 2 weeks)',
    }
  }).then(res=>console.log(res))

  return ; 
  client
    .get(client.url('queries', 'saved'))
    .auth(client.masterKey())
    .send()
    .then(res => {
      // Handle response
      console.log(res);
    })
    .catch(err => {
      // Handle error
      console.log(err);
    });

    return;

  client
        .get(client.url('dashboards'))
        .send()
        .then((res) => {
          AppDispatcher.dispatch({
            actionType: DashboardConstants.DASHBOARDS_UPDATE,
            attrs: res
          })
          return res
        })
        .catch((err) => {
          console.log('Error fetching dashboards', err)
          console.log(err.stack)
        })
    return;        



client.query('count', {
  event_collection: 'pageviews',
  group_by: 'page.url',
  interval: 'daily',
  timeframe: 'this_3_months'
}).then(res=>console.log(res))
.catch(err=>console.log(err))

}

if (typeof window !== 'undefined') {
  window.demoTests = demoTests;
}
if (typeof global !== 'undefined') {
  module.exports = demoTests;
}
