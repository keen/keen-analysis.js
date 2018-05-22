export default {
  client: {
    projectId  : '1234',
    readKey    : 'f9d5e967e95e2e4b1503819d3aa9275abc22b16e',
    protocol   : 'https',
    host       : 'api.keen.io'
  },
  collection : 'keen-analysis',
  properties: {
    username : 'keenio',
    color    : 'blue'
  },
  responses: {
    success  : '{"created": true }',
    error    : '{"error": true }'
  }
};
