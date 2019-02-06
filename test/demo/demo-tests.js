const demoTests = (demoConfig, Keen) => {
  //const client = new Keen(demoConfig);
  const demoConfigs = {
    projectId: '5c162b27c9e77c0001f4d5dc',
    readKey: ' 9D4EC719F92D941975983856FA8DCE10B21F2566FD59019D036F47CE6851D20E06FC5AE541E2EFE5AF0A13D00D67238E8325E1E58054D93F4EC05A0865A5C9E812898E3B6604655D375CEDC5A235780AC0C08E108684EFCE2674D74CCCEE604B ',
    roundValues: true
  };
  const client = new Keen(demoConfigs);

client.query('average', {
  event_collection: 'pageviews',
  target_property: 'time.hour_of_day',
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
