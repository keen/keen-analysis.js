# keen-analysis.js

```javascript
// Extends keen-tracking.js client
var client = new Keen({
  projectId: 'PROJECT_ID',
  readKey: 'READ_KEY'
});


// Ad-hoc queries (analysis_type, query_params)
client
  .query('count', {
    event_collection: 'pageviews'
  })
  .then(function(res){
    // do something with the result
  })
  .catch(Keen.log);

// Retrieve result of one saved query (analysis_type, query_name)
client
  .query('saved', 'some-saved-query')
  .then(function(res){
    // do something with the result
  })
  .catch(Keen.log);


// Managing Saved Queries

// Retrieve all saved queries
client
  .get(client.url('queries', 'saved'))
  .auth(client.masterKey())
  .send()
  .then(function(res){
    // handle response
  })
  .catch(function(err){
    // an error occured!
  });


// Retrieve a saved query
client
  .get(client.url('queries', 'saved', 'existing-saved-query'))
  .auth(client.masterKey())
  .send()
  .then(function(res){
    // handle response
  })
  .catch(function(err){
    // an error occured!
  });


// Create a saved query
client
  .post(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send({
    refresh_rate: 0,
    query: {},
    metadata: {
      query_name: 'My New Query'
    }
    // ...
  })
  .then(function(res){
    // handle response
  })
  .catch(function(err){
    // an error occured!
  });


// Update a saved query
client
  .put(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send({
    refresh_rate: 60 * 60 * 4,
    query: {},
    query_name: 'daily-pageviews-this-14-days',
    metadata: {
      display_name: 'Daily pageviews (this 14 days)'
    }
    // ...
  })
  .then(function(res){
    // handle response
  })
  .catch(Keen.log);

// Delete a saved query
client
  .del(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send()
  .then(function(res){
    // handle response
  })
  .catch(Keen.log);

```
