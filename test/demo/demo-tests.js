const demoTests = (demoConfig, Keen) => {
  demoConfig.resultParsers= [
    (value) => {
      return Math.round(value);
    }
  ]
  const client = new Keen(demoConfig);

  client.query('count', {
    event_collection: 'pageviews',
    // group_by: 'page.url',
    interval: 'daily',
    timeframe: 'this_3_months'
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
