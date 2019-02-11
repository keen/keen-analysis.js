const demoTests = (demoConfig, Keen) => {
  const client = new Keen(demoConfig);

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
