import extend from 'keen-core/lib/utils/extend';

import KeenAnalysis from './index';
import request from './request';
import * as httpHandlers from './utils/http-server';

KeenAnalysis.prototype.get = new request('GET', httpHandlers);
KeenAnalysis.prototype.post = new request('POST', httpHandlers);
KeenAnalysis.prototype.put = new request('PUT', httpHandlers);
KeenAnalysis.prototype.del = new request('DELETE', httpHandlers);

export const Keen = KeenAnalysis.extendLibrary(KeenAnalysis);
module.exports = Keen;
