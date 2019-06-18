const demoTests = (demoConfig, Keen) => {
  demoConfig.xresultParsers= [
    (value) => {
      return Math.round(value);
    }
  ]
  const client = new Keen(demoConfig);

  const savedQueryName = 'XZmy-saved-query';

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

  return;
  client
    .put({
      url: client.url('queries', 'saved', savedQueryName),
      api_key: client.masterKey(),
      params: {
        query: {
          analysisType: 'sum',
          targetProperty: 'price',
          eventCollection: 'purchases',
          timeframe: 'this_112_weeks',
        },
        metadata: {
          displayName: 'created XZ',
        },
        refreshRate: 0,
      }
    })
  .then(res => {
    // Handle results
    console.log(res);
  })
  .catch(err => {
    // Handle errors
    console.log(err);
  });


  return ; 


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
