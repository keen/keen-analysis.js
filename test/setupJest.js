global.fetch = require('jest-fetch-mock');
global.indexedDB = require('fake-indexeddb');
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

jest.mock('promise-polyfill', () => {});
jest.mock('promise-polyfill/src/polyfill', () => {});
