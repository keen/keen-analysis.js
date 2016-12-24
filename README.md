# keen-analysis.js

This project contains the most reliable and efficient data analysis functionality available for Keen IO, and will soon be built directly into [keen-js](https://github.com/keen/keen-js), replacing and upgrading the current analysis capabilities of that library.

Looking for tracking capabilities? Check out [keen-tracking.js](https://github.com/keen/keen-tracking.js).

**What's new:**

* Asynchronous requests now return Promises, powered by [Bluebird (core)](https://github.com/petkaantonov/bluebird); a fully featured promise library with focus on innovative features and performance
* Breaking changes from [keen-js](https://github.com/keen/keen-js): [learn more about upgrading](#upgrading-from-keen-js)

**Upgrading from keen-js?** [Read this](#upgrading-from-keen-js).

**Getting started:**

If you haven't done so already, login to Keen IO to create a project. The Project ID and API Keys are available on the Project Overview page. You will need these for the next steps.

* [Install the library](#install-the-library)
* [Connect](#connect) a new client instance for each project
* [Query](#query) event collections
* [Access API resources](#access-api-resources) with standard HTTP methods

<a name="upgrading-from-keen-js"></a>
**Upgrading from keen-js:**

There are several breaking changes from [keen-js](https://github.com/keen/keen-js).

* **All new HTTP methods:** [keen-js](https://github.com/keen/keen-js) supports generic HTTP methods (`.get()`, `.post()`, `.put()`, and `.del()`) for interacting with various API resources. The new Promise-backed design of this SDK necessitated a full rethinking of how these methods behave.
* **camelCase conversion:** previously, query parameters could be provided to a `Keen.Query` object in camelCase format, and would be converted to the underscore format that the API requires. Eg: `eventCollection` would be converted to `event_collection` before being sent to the API. This pattern has caused plenty of confusion, so we have axed this conversion entirely. All query parameters must be supplied in the format outlined by the [API reference](https://keen.io/docs/api) (`event_collection`).
* **`Keen.Request` object has been removed:** this object is no longer necessary for managing query requests.
* **Redesigned implementation of `client.url()`:** This method previously included `https://api.keen.io/3.0/projects/PROJECT_ID` plus a `path` argument ('/events/whatever'). This design severely limited its utility, so we've revamped this method.

This method now references an internal collection of resource paths, and constructs URLs using client configuration properties like `host` and `projectId`:

```javascript
var url = client.url('projectId');
// Renders {protocol}://{host}/3.0/projects/{projectId}
// Returns https://api.keen.io/3.0/projects/PROJECT_ID
```

Default resources:

* 'base': '`{protocol}`://`{host}`',
* 'version': '`{protocol}`://`{host}`/3.0',
* 'projects': '`{protocol}`://`{host}`/3.0/projects',
* 'projectId': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`',
* 'queries': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`/queries'

Non-matching strings will be appended to the `base` resource, like so:

```javascript
var url = client.url('/3.0/projects');
// Returns https://api.keen.io/3.0/projects
```

You can also pass in an object to append a serialized query string to the result, like so:

```javascript
var url = client.url('events', { api_key: 'YOUR_API_KEY' });
// Returns https://api.keen.io/3.0/projects/PROJECT_ID/events?api_key=YOUR_API_KEY
```

Resources can be returned or added with the `client.resources()` method, like so:

```javascript
client.resources()
// Returns client.config.resources object

client.resources({
  'new': '{protocol}://analytics.mydomain.com/my-custom-endpoint/{projectId}'
});
client.url('new');
// Returns 'https://analytics.mydomain.com/my-custom-endpoint/PROJECT_ID'
```


<a name="additional-resources"></a>
**Additional resources:**

* [Contributing](#contributing) is awesome and we hope you do!
* [Custom builds](#custom-builds) are encouraged as well - have fun!

<a name="support"></a>
**Support:**

Need a hand with something? Shoot us an email at [team@keen.io](mailto:team@keen.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [API status](http://status.keen.io/)
* [API reference](https://keen.io/docs/api)
* [How-to guides](https://keen.io/guides)
* [Data modeling guide](https://keen.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.keen.io/)


## Install the library

Include [keen-analysis.js](dist/keen-analysis.js) within your page or project.

```html
<script src='//d26b395fwzu5fz.cloudfront.net/keen-analysis-1.2.2.js'></script>
```

This library can also be installed via npm or bower:

```ssh
# via npm
$ npm install keen-analysis

# or bower
$ bower install keen-analysis
```

## Connect

The client instance is the core of the library and will be required for all API-related functionality. The client variable defined below will also be used throughout this document.

```javascript
var client = new Keen({
    projectId: 'YOUR_PROJECT_ID',
    readKey: 'YOUR_READ_KEY'
});

// Optional accessor methods are available too
client.projectId('YOUR_PROJECT_ID');
client.readKey('YOUR_READ_KEY');
```

## Query

### Ad-hoc queries

```javascript
client
  .query('count', {
    event_collection: 'pageviews',
    timeframe: 'this_14_days'
  })
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

**Important:** the `res` response object returned in the example above will also include a `query` object containing the `analysis_type` and query parameters shaping the request. This query information is artificially appended to the response by this SDK, as this information is currently only provided by the API for saved queries. **Why?** Query parameters are extremely useful for intelligent response handling downstream, particularly by our own automagical visualization capabilities in [keen-dataviz.js](https://github.com/keen/keen-dataviz.js).

### Saved queries

```javascript
client
  .query('saved', 'pageviews-this-14-days')
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

## Access API Resources

The following HTTP methods are exposed on the client instance:

* `.get(string)`
* `.post(string)`
* `.put(string)`
* `.del(string)`

These HTTP methods take a URL (string) as a single argument and return an internal request object with several methods that configure and execute the request, finally returning a promise for the asynchronous response. These methods include:

* `.auth(string)`: sets the API_KEY as an Authorization header
* `.headers(object)`: sets headers to apply to the request
* `.timeout(number)`: sets a timeout value (default is 300 seconds)
* `.send()`: handles an optional object of parameters, executes the request and returns a promise

The following example demonstrates the full HTTP request that is executed when `client.query()` is called (detailed above):

```javascript
client
  .post('https://api.keen.io/3.0/projects/YOUR_PROJECT_ID/queries/count')
  .auth('YOUR_READ_KEY')
  .send({
    event_collection: 'pageviews',
    timeframe: 'this_14_days'
  })
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

As an added convenience, API URLs can be generated using the `client.url()`.

### Example GET request

```javascript
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
```

### Example POST Request

```javascript
// Create a saved query
client
  .post(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send({
    refresh_rate: 0,
    query: {
      analysis_type: 'count',
      event_collection: 'pageviews'
    },
    metadata: {}
    // ...
  })
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

### Example PUT Request

```javascript
// Update a saved query
client
  .put(client.url('queries', 'saved', 'daily-pageviews-this-14-days'))
  .auth(client.masterKey())
  .send({
    refresh_rate: 60 * 60 * 4,
    query: {
      analysis_type: 'count',
      event_collection: 'pageviews',
      timeframe: 'this_14_days'
    },
    metadata: {
      display_name: 'Daily pageviews (this 14 days)'
    }
    // ...
  })
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

### Example DELETE Request

```javascript
// Delete a saved query
client
  .del(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send()
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```

## Keen.Query

The `Keen.Query` object and `client.run()` method introduced in [keen-js](https://github.com/keen/keen-js) are still supported. However, `client.run()` now also returns a promise, as an alternate interface to the node-style callback.

```javascript
var query = new Keen.Query('count', {
  event_collection: 'pageviews',
  timeframe: 'this_14_days'
});

// Node-style callback
client.run(query, function(err, res){
  if (err) {
    // catch and handle errors
  }
  else {
    // do something with the result
  }
});

// promise
client
  .run(query)
  .then(function(res){
    // do something with the result
  })
  .catch(function(err){
    // catch and handle errors
  });
```


## Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues. The more contributions the better!

[Learn more about contributing to this project](./CONTRIBUTING.md).


## Custom builds

Run the following commands to install and build this project:

```ssh
# Clone the repo
$ git clone https://github.com/keen/keen-analysis.js.git && cd keen-analysis.js

# Install project dependencies
$ npm install

# Build project with gulp
# npm install -g gulp
$ gulp

# Build and run tests
$ gulp
$ open http://localhost:9001
```
