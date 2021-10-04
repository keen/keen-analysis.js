# keen-analysis.js

A JavaScript Client for [Keen](https://keen.io/).

<a href="https://keen.io/"><img src="https://img.shields.io/github/release/keen/keen-analysis.js.svg?style=flat-square&maxAge=600" alt=""></a>
<a href="https://github.com/keen/keen-analysis.js/graphs/contributors" alt="Contributors"><img src="https://img.shields.io/github/contributors/keen/keen-analysis.js.svg" /></a>
<a href="https://github.com/keen/keen-analysis.js/pulse" alt="Activity"><img src="https://img.shields.io/github/last-commit/keen/keen-analysis.js.svg" /></a>
![](https://img.shields.io/github/license/keen/keen-analysis.js.svg)
<a href="http://slack.keen.io/"><img src="https://img.shields.io/badge/slack-keen-orange.svg?style=flat-square&maxAge=3600" alt="Slack"></a>
<a href="https://www.jsdelivr.com/package/npm/keen-analysis"><img src="https://data.jsdelivr.com/v1/package/npm/keen-analysis/badge" alt=""></a>
<a href="https://www.npmjs.com/package/keen-analysis"><img src="https://img.shields.io/npm/dm/keen-analysis.svg" alt=""></a>


### Installation

Install this package from NPM *Recommended*

```ssh
npm install keen-analysis --save
```

Public CDN

```html
<script crossorigin src="https://cdn.jsdelivr.net/npm/keen-analysis@3/dist/keen-analysis.min.js"></script>
```

### Project ID & API Keys

[Login to Keen IO to create a project](https://keen.io/login?s=gh_js) and grab the **Project ID** and **Read Key** from your project's **Access** page.

To run **keen-analysis** on your localhost you need to grab your access keys and update `config.js` file.

```javascript
const demoConfig = {
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY',
  writeKey: 'YOUR_WRITE_KEY',
  masterKey: 'YOUR_MASTER_KEY',
};
```

### Getting started

The following examples demonstrate how to get up and running quickly with our API. This SDK can also contains basic [HTTP wrappers](#api-resources) that can be used to interact with every part of our platform.

If any of this is confusing, join our [Slack community](https://slack.keen.io) or send us a [message](https://keen.io/support/).

**Looking for tracking capabilities?** Check out [keen-tracking.js](https://github.com/keen/keen-tracking.js).

**Upgrading from an earlier version of keen-js?** [Read this](#upgrading-from-keen-js).


### Setup and Running a Query

Create a new `client` instance with your Project ID and Read Key, and use the `.query()` method to execute an ad-hoc query. This client instance is the core of the library and will be required for all API-related functionality.

```javascript
// Browsers
import KeenAnalysis from 'keen-analysis';

// Node.js
// const KeenAnalysis = require('keen-analysis');

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .query({
    analysisType: 'count',
    eventCollection: 'pageviews',
    timeframe: 'this_31_days'
  })
  .then(res => {
    // Handle results, e.g. visualise them with https://github.com/keen/keen-dataviz.js
  })
  .catch(err => {
    // Handle errors
  });
```

**Important:** the `res` response object returned in the example above will also include a `query` object containing the `analysis_type` and query parameters shaping the request. This query information is artificially appended to the response by this SDK, as this information is currently only provided by the API for saved queries. **Why?** Query parameters are extremely useful for intelligent response handling downstream, particularly by our own automagical visualization capabilities in [keen-dataviz.js](https://github.com/keen/keen-dataviz.js).

### Async Await example

```javascript
const getPageviews = async () => {
  try {
    const result = await client
      .query({
        analysisType: 'count',
        eventCollection: 'pageviews',
        timeframe: 'this_31_days'
      });
    console.log('Result', result);
    return result;
  } catch (error) {
    console.log('Error', error);
  }
}
```

---

#### Cache queries in the client

Client-side (browser) caching is based on [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

```javascript
import KeenAnalysis from 'keen-analysis';

// set global caching of all queries *Optional*
const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY',
  cache: {
    maxAge: 60 * 1000 // cache for 1 minute
  }
});

// or set custom caching for a specific query *Optional*
client
  .query({
    analysisType: 'count',
    eventCollection: 'pageviews',
    timeframe: 'this_31_days',
    cache: {
      maxAge: 10 * 1000 // [ms]
    }
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });

// don't cache a specific query, even if the global caching is on
client
  .query({
    analysisType: 'count',
    eventCollection: 'pageviews',
    timeframe: 'this_14_days',
    cache: false
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

## Local Queries

The Local Query *Experimental* Feature allows you to run queries on already
browser-side-cached or file-stored data.
This feature is available only in the NPM version of the library.

#### Local Query on the browser cache

```javascript
import KeenAnalysis from 'keen-analysis';
import localQuery from 'keen-analysis/dist/modules/localQuery';

client
  .query({
    analysisType: 'extraction', // IMPORTANT
    eventCollection: 'pageviews',
    timeframe: 'this_30_days',
    cache: {
      // cache the result in the browser for 1 day
      maxAge: 1000 * 60 * 60 * 24
    }
  })
  .then(responseJSON => {
    localQuery({
        data: responseJSON,

        // now run any query that you would normally run
        // for example
        analysisType: 'count',
        timeframe: 'this_7_days',

        debug: true // OPTIONAL: see the details of each query in your console
      })
      .then(localQueryResponseJSON => {
        // handle results, for example pass them to keen-dataviz
      })
      .catch(localQueryError => {
        console.log(localQueryError);
      });
  });
```

#### Local Query on the file

```javascript
import localQuery from 'keen-analysis/dist/modules/localQuery';

localQuery({
    file: 'dummy-data.csv', // .csv or .json file

    analysisType: 'count',
    timeframe: 'this_14_days'
  })
  .then(localQueryResponseJSON => {
    // handle results
  })
  .catch(localQueryError => {
    // handle error
  });
```

#### The Local Query configuration

```javascript
localQuery({
    /*
      Define the data source
      The Local Query accepts all of the Extraction query results
    */
    data: responseJSON, // response from the Browser's cache or Keen's API
    // OR
    file: 'dummy-data.csv', // .csv or .json files

    /*
      Use standard query parameters - https://keen.io/docs/api/#analyses
    */
    analysisType: 'count',
    timeframe: 'this_7_days', // optional
    // filter, interval, limit etc...

    /*
      Optional
    */
    debug: true, // see the details of each query in your console
    onOutOfTimeframeRange: () => {}, // load more data from API or ignore
  })
  .then(localQueryResponseJSON => {
    // handle results
  })
  .catch(localQueryError => {
    // handle error
  });
```

#### Local Query in the Node.js environment

```javascript
const KeenAnalysis = require('keen-analysis');
// import from Node.js modules:
const localQuery = require('keen-analysis/dist/node/modules/localQuery').default;
```

#### Create a Saved Query

API reference: [Saved Query](https://keen.io/docs/api/?javascript#creating-a-saved-query)

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY'
});

// Create or Update a saved query
client
  .put({
    url: client.url('queries', 'saved', 'daily-pageviews-this-14-days'),
    api_key: client.config.masterKey,
    params: {
      refreshRate: 60 * 60 * 4, // API will refresh result of this query every 4 hours
      query: {
        analysisType: 'count',
        eventCollection: 'pageviews',
        timeframe: 'this_14_days'
      },
      metadata: {
        displayName: 'Daily pageviews (this 14 days)',
        /*
          If you plan to use this saved query inside Explorer set the default visualization.
          We suggest using "metric" for a single value, "area" for intervals
        */
        visualization: {
          chartType: "metric"
        }
      }
    }
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### Read Saved/Cached Queries

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

// read already saved query
client
  .query({
    savedQueryName: 'pageviews-this-14-days'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### List Saved Queries

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  masterKey: 'YOUR_MASTER_KEY'
});

// Retrieve all saved queries
client
  .get({
    url: client.url('queries', 'saved'),
    api_key: client.config.masterKey
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### Create Cached Datasets

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'PROJECT_ID',
  masterKey: 'MASTER_KEY'
});

const newDatasetName = 'my-first-dataset';

client
  .put({
    url: client.url('datasets', newDatasetName),
    api_key: client.config.masterKey,
    params: {
      displayName: 'Count Daily Product Purchases Over $100 by Country',
      query: {
        analysisType: 'count',
        eventCollection: 'purchases',
        filters: [
          {
            propertyName: 'price',
            operator: 'gte',
            propertyValue: 100
          }
        ],
        groupBy: 'ip_geo_info.country',
        interval: 'daily',
        timeframe: 'this_500_days'
      },
      indexBy: 'product.id'
    }
  })
  .then(res => {
    console.log('res', res);
    // Handle response
  })
  .catch(err => {
    // Handle error
  });
```

#### Read Cached Datasets

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

client
  .query({
    datasetName: 'my-cached-dataset',
    indexBy: 'customer.id',
    timeframe: 'this_7_days'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

#### Cancel query

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

const queryPageviews = client.query({
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'this_31_days'
});

// cancel
queryPageviews.abort();

/*
query.then(res => {
  console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
*/
```

#### Timeout of the queries

Fetch API doesn't support timeout, but we can fix that

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

const queryPageviews = client.query({
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'this_31_days'
});

// cancel after 10 seconds
setTimeout(() => {
  queryPageviews.abort();
}, 1000 * 10);

queryPageviews
  .then(res => {
    console.log('response', res);
  })
  .catch(err => {
    console.log('error', err);
  });

```

### Running multiple queries at once

`client.run()` will `Promise.all` array of queries.
Please note, that in general, we recommend running queries independently of each other.
This example is useful if you are rendering many results on one Keen-dataviz.js chart object.

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY'
});

const queryPageviews = client.query({
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'this_14_days'
});

const queryFormSubmissions = client.query({
  analysisType: 'count',
  eventCollection: 'form_submissions',
  timeframe: 'this_14_days'
});

// promise all
client
  .run([queryPageviews, queryFormSubmissions])
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

### Parsing query results

`resultParsers` is an array of functions and the response from API will be parsed by each function.

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY',
  resultParsers: [
    (value) => {
      return Math.round(value); // or eg. value.toPrecision(2)
    }
  ]
});

client.query({
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'this_3_months'
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

### Optimise queries

Read [the execution metadata](https://keen.io/docs/api/?javascript#execution-metadata) to optimise queries and reduce your bill.

```javascript
client.query({
  analysisType: 'count',
  eventCollection: 'pageviews',
  timeframe: 'this_3_months',
  includeMetadata: true
  })
  .then(res => {
    // Handle results
  })
  .catch(err => {
    // Handle errors
  });
```

For multiple queries you can define `includeMetadata` in client constructor and this will be propagated to all queries.

```javascript
import KeenAnalysis from 'keen-analysis';

const client = new KeenAnalysis({
  projectId: 'YOUR_PROJECT_ID',
  readKey: 'YOUR_READ_KEY',
  includeMetadata: true,
});
```

### Custom Host

You can set a custom domain for requests

```
const client = new KeenAnalysis({
  projectId: 'PROJECT_ID',
  readKey: 'YOUR_READ_KEY',
  host: 'somehost.com'
});
```

### Client instance methods

The following HTTP methods are exposed on the client instance:

* `.get(object)`
* `.post(object)`
* `.put(object)`
* `.del(object)`

These HTTP methods take a single argument and return a promise for the asynchronous response.

---

### CamelCase conversion

All of the parameters provided in the camelCase format will be automatically converted into an API-digestible under_score format.

---

### Upgrading from keen-js

There are several breaking changes from earlier versions of [keen-js](https://github.com/keen/keen-js).

* **All new HTTP methods:** [keen-js](https://github.com/keen/keen-js) supports generic HTTP methods (`.get()`, `.post()`, `.put()`, and `.del()`) for interacting with various API resources. The new Promise-backed design of this SDK necessitated a full rethinking of how these methods behave.
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

---

## Custom builds

Run the following commands to install and build this project:

```ssh
# Clone the repo
$ git clone https://github.com/keen/keen-analysis.js.git && cd keen-analysis.js

# Install project dependencies
$ npm install

# Build project with Webpack
$ npm run build

# Build and launch to view demo page
$ npm run start

# Run Jest tests
$ npm run test
```
