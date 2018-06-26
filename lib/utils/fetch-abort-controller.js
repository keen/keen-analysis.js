import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export const fetchAbortController = new AbortController();
export default fetchAbortController;
