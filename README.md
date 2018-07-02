# keen-analysis.js

### Installation

Install this package from NPM *Recommended*

```ssh
$ npm install keen-analysis --save
```

Or load it from public CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/keen-analysis@2"></script>
```

### Project ID & API Keys

[Login to Keen IO to create a project](https://keen.io/login?s=gh_js) and grab the **Project ID** and **Read Key** from your project's **Access** page.


## Getting started

The following examples demonstrate how to get up and running quickly with our Compute API. This SDK can also contains basic [HTTP wrappers](#api-resources) that can be used to interact with every part of our platform.

If any of this is confusing, that's our fault and we would love to help. Join our  [Slack community](https://slack.keen.io) or send us a [message](https://keen.io/support/).

**Looking for tracking capabilities?** Check out [keen-tracking.js](https://github.com/keen/keen-tracking.js).

**Upgrading from an earlier version of keen-js?** [Read this](#upgrading-from-keen-js).


### Setup and Running a Query

Create a new `client` instance with your Project ID and Read Key, and use the `.query()` method to execute an ad-hoc query. This client instance is the core of the library and will be required for all API-related functionality.

```javascript
// browser/front-end
import Keen from 'keen-analysis';

// for Node.js/back-end
// const Keen = require('keen-analysis');

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .query('count', {
    event_collection: 'pageviews',
    timeframe: 'this_14_days'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

**Important:** the `res` response object returned in the example above will also include a `query` object containing the `analysis_type` and query parameters shaping the request. This query information is artificially appended to the response by this SDK, as this information is currently only provided by the API for saved queries. **Why?** Query parameters are extremely useful for intelligent response handling downstream, particularly by our own automagical visualization capabilities in [keen-dataviz.js](https://github.com/keen/keen-dataviz.js).


### Saved and Cached Queries

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .query('saved', 'pageviews-this-14-days')
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

### Cached Datasets

Note the special param `name` to specify the name of the cached dataset that you have already created.

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .query('dataset', {
    name: 'my-cached-dataset',
    index_by: 'customer.id',
    timeframe: 'this_7_days'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

### API Resources

The following HTTP methods are exposed on the client instance:

* `.get(string)`
* `.post(string)`
* `.put(string)`
* `.del(string)`

These HTTP methods take a URL (string) as a single argument and return an internal request object with several methods that configure and execute the request, finally returning a promise for the asynchronous response. These methods include:

* `.auth(string)`: sets the API_KEY as an Authorization header
* `.headers(object)`: sets headers to apply to the request
* `.send()`: handles an optional object of parameters, executes the request and returns a promise
* `.abort()`: cancels already running request

The following example demonstrates the full HTTP request that is executed when `client.query()` is called (detailed above):

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .post(`https://api.keen.io/3.0/projects/${client.projectId()}/queries/count`)
  .auth(client.readKey())
  .send({
    event_collection: 'pageviews',
    timeframe: 'this_14_days'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

As an added convenience, API URLs can be generated using the `client.url()`.

#### Example GET request

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY'
});

// Retrieve all saved queries
client
  .get(client.url('queries', 'saved'))
  .auth(client.masterKey())
  .send()
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### Example Canceling Queries

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

const query = client
  .get(client.url('queries', 'saved'))
  .auth(client.masterKey())
  .send();

// cancel
query.abort();

/*
query.then(res => {
  console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
*/
```

#### Example POST Request

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

// Get average
client
  .post(client.url('queries', 'average'))
  .auth(client.readKey())
  .send({
    event_collection: 'purchases',
   target_property: 'price',
   timeframe: 'this_27_days'
  })
  .then(res => {
    console.log(res);
    // Handle results
  })
  .catch(err => {
    console.log(err);
    // Handle errors
  });
```

#### Example PUT Request

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY'
});

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
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### Example DELETE Request

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY'
});

// Delete a saved query
client
  .del(client.url('queries', 'saved', 'new-saved-query'))
  .auth(client.masterKey())
  .send()
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

### Keen.Query

The `Keen.Query` object and `client.run()` method introduced in [keen-js](https://github.com/keen/keen-js) are still supported. However, `client.run()` now also returns a promise, as an alternate interface to the node-style callback.

```javascript
import Keen from 'keen-analysis';

const client = new Keen({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

const query = new Keen.Query('count', {
  event_collection: 'pageviews',
  timeframe: 'this_14_days'
});

// Node-style callback
client.run(query, (err, res) =>{
  if (err) {
    // Handle errors
  }
  else {
    // Handle results
  }
});

// promise
client
  .run(query)
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

---

### Upgrading from keen-js

There are several breaking changes from earlier versions of [keen-js](https://github.com/keen/keen-js).

* **All new HTTP methods:** [keen-js](https://github.com/keen/keen-js) supports generic HTTP methods (`.get()`, `.post()`, `.put()`, and `.del()`) for interacting with various API resources. The new Promise-backed design of this SDK necessitated a full rethinking of how these methods behave.
* **camelCase conversion:** previously, query parameters could be provided to a `Keen.Query` object in camelCase format, and would be converted to the underscore format that the API requires. Eg: `eventCollection` would be converted to `event_collection` before being sent to the API. This pattern has caused plenty of confusion, so we have axed this conversion entirely. All query parameters must be supplied in the format outlined by the [API reference](https://keen.io/docs/api) (`event_collection`).
* **`Keen.Request` object has been removed:** this object is no longer necessary for managing query requests.
* **Redesigned implementation of `client.url()`:** This method previously included `https://api.keen.io/3.0/projects/PROJECT_ID` plus a `path` argument ('/events/whatever'). This design severely limited its utility, so we've revamped this method.

This method now references an internal collection of resource paths, and constructs URLs using client configuration properties like `host` and `projectId`:

```javascript
const url = client.url('projectId');
// Renders {protocol}://{host}/3.0/projects/{projectId}
// Returns https://api.keen.io/3.0/projects/PROJECT_ID
```

Default resources:

* 'base': '`{protocol}`://`{host}`',
* 'version': '`{protocol}`://`{host}`/3.0',
* 'projects': '`{protocol}`://`{host}`/3.0/projects',
* 'projectId': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`',
* 'queries': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`/queries'
* 'datasets': '`{protocol}`://`{host}`/3.0/projects/`{projectId}`/datasets'

Non-matching strings will be appended to the `base` resource, like so:

```javascript
const url = client.url('/3.0/projects');
// Returns https://api.keen.io/3.0/projects
```

You can also pass in an object to append a serialized query string to the result, like so:

```javascript
const url = client.url('events', { api_key: 'YOUR_API_KEY' });
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

---

### Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues.

[Learn more about contributing to this project](./CONTRIBUTING.md).

---

### Support

Need a hand with something? Shoot us an email at [team@keen.io](mailto:team@keen.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [API status](http://status.keen.io/)
* [API reference](https://keen.io/docs/api)
* [How-to guides](https://keen.io/guides)
* [Data modeling guide](https://keen.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.keen.io/)
