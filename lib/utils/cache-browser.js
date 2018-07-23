import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const indexedDBAvailable = 'indexedDB' in self;
let cachingEnabled = true;

if (!indexedDBAvailable) {
    // console.log("Your browser doesn't support a stable version of IndexedDB.");
    cachingEnabled = false; // graceful degradation
}

let db;
let cacheConfig;

function initializeIndexedDb(requestCacheConfig = {}){
  if (db) { return Promise.resolve(); }
  cacheConfig = {
    dbName: 'keenAnalysisIndexedDB',
    dbCollectionName: 'requests',
    dbCollectionKey: 'url',
    maxAge: 60000,
    ...requestCacheConfig
  };
  if (!cachingEnabled) { return Promise.resolve(); }
  return new Promise((resolve, reject) => {
    const dbConnectionRequest = self.indexedDB.open(cacheConfig.dbName);
    dbConnectionRequest.onerror = function(event) {
      cachingEnabled = false;
      resolve();
    };

    dbConnectionRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore(cacheConfig.dbCollectionName, { keyPath: cacheConfig.dbCollectionKey });
      objectStore.createIndex(cacheConfig.dbCollectionKey, cacheConfig.dbCollectionKey, { unique: true });
    };

    dbConnectionRequest.onsuccess = function(event) {
      db = event.target.result;
      db.onerror = function(event) {
        cachingEnabled = false; // graceful degradation
      };
      resolve(db);
    };
  });
}

export const saveToCache = (url, fetchOptions, responseJson) => {
  return initializeIndexedDb().then(() => {
    const transactionSave = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
    const requestSave = transactionSave.add({
    url: urlWithBody(url, fetchOptions),
    expiryTime: Date.now() + cacheConfig.maxAge,
    responseJson
  });
  requestSave.onsuccess = function(event) {
  };
  requestSave.onerror = function(event) {
    cachingEnabled = false;
  };
  });
}

const urlWithBody = (url, fetchOptions) => {
  return `${url}&body=${JSON.stringify(fetchOptions.body)}`;
}

export const getFromCache = (url, fetchOptions, configOptions = {}) => {
  return initializeIndexedDb(configOptions.cache).then(() => {

  return new Promise((resolve, reject) => {
    if (!cachingEnabled) {
      return resolve(null);
    }
    const transactionIndex = db.transaction(cacheConfig.dbCollectionName, "readwrite").objectStore(cacheConfig.dbCollectionName);
    const index = transactionIndex.index(cacheConfig.dbCollectionKey);
    const responseFromCache = index.get(urlWithBody(url, fetchOptions));
    responseFromCache.onsuccess = function(event) {
      if (!event.target.result ||
        event.target.result.expiryTime < Date.now()
      ) {
        if (event.target.result && event.target.result.expiryTime < Date.now()){
          const transactionDelete = db.transaction(cacheConfig.dbCollectionName, "readwrite")
            .objectStore(cacheConfig.dbCollectionName).delete(event.target.result[cacheConfig.dbCollectionKey]);
          transactionDelete.onsuccess = (event) => {
            resolve(getFromCache(url, fetchOptions, configOptions));
          };
          transactionDelete.onerror = (event) => {
            cachingEnabled = false;
            resolve(getFromCache(url, fetchOptions, configOptions));
          };
          return resolve(null);
        }
        return resolve(null);
      } else {
        return resolve(event.target.result.responseJson);
      }
    };
    responseFromCache.onerror = function(event) {
      cachingEnabled = false;
      resolve(getFromCache(url, fetchOptions, configOptions));
    };
    });
  });
}
