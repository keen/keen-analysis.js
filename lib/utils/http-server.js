import https from 'https';
import url from 'url';

import extend from 'keen-core/lib/utils/extend';
import serialize from 'keen-core/lib/utils/serialize';

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;

function handleRequest(config, args = {}){
  const callback = args.callback;
  const parsedUrl = url.parse(config.url);

  const options = {
    host: parsedUrl['hostname'],
    path: parsedUrl.path,
    method: config['method'],
    headers: config['headers']
  };

  let data = '';

  if (config['method'] === 'GET') {
    data = '';
    options.path += '?api_key=' + config.api_key;
    if (config.params) {
      options.path += '&' + serialize(config.params);
    }
  }
  else {
    data = config.params ? JSON.stringify(config.params) : '';
    options['headers']['Content-Length'] = Buffer.byteLength(data);
  }

  const req = https.request(options, function(res) {
    if (options.method === 'DELETE' && res.statusCode === 204) {
      return callback(null, {});
    }
    let body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function() {
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (error) {
        return callback(error, null);
      }
      if (parsedBody.error_code) {
        let error = new Error(parsedBody.message || 'Unknown error occurred');
        error.code = parsedBody.error_code;
        callback(error, null);
      }
      else {
        callback(null, parsedBody);
      }
    });
  });

  req.on('error', callback);
  req.on('abort', () => req.abort());
  req.write(data);
  req.end();

  return req;
}
