import extend from 'keen-core/lib/utils/extend';

import KeenAnalysisCore from './index';
import request from './request';
import * as httpHandlers from './utils/http-browser';

KeenAnalysisCore.prototype.get = new request('GET', httpHandlers);
KeenAnalysisCore.prototype.post = new request('POST', httpHandlers);
KeenAnalysisCore.prototype.put = new request('PUT', httpHandlers);
KeenAnalysisCore.prototype.del = new request('DELETE', httpHandlers);

export const Keen = KeenAnalysisCore.extendLibrary(KeenAnalysisCore);
export const KeenAnalysis = Keen; // backward compatibility - CDN
export default Keen;
