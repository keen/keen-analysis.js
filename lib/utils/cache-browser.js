import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import MD5 from './md5';

const indexedDBAvailable = 'indexedDB' in self;
let cachingEnabled = true;

if (!indexedDBAvailable) {
    // console.log("Your browser doesn't support a stable version of IndexedDB.");
    cachingEnabled = false; // graceful degradation
}

let db;
let cacheConfig = {
  dbName: 'keenAnalysisIndexedDB',
  dbCollectionName: 'requests',
  dbCollectionKey: 'url',
  maxAge: 60000
};

function initializeIndexedDb(requestCacheConfig = {}){
  if (db) { return Promise.resolve(); }
  if (!cachingEnabled) { return Promise.resolve(); }
  cacheConfig = {
    ...cacheConfig,
    ...requestCacheConfig
  };
  return new Promise((resolve, reject) => {
    const dbConnectionRequest = self.indexedDB.open(cacheConfig.dbName);
    dbConnectionRequest.onerror = function(event) {
      cachingEnabled = false;
      resolve();
    };

    dbConnectionRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db
        .createObjectStore(cacheConfig.dbCollectionName,
          { keyPath: cacheConfig.dbCollectionKey });
      objectStore.createIndex(
        cacheConfig.dbCollectionKey,
        cacheConfig.dbCollectionKey,
        { unique: true }
      );
      objectStore.createIndex('expiryTime', 'expiryTime', { unique: false });
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

const urlWithBodyHash = (url, fetchOptions) => {
  return MD5(`${url}&body=${JSON.stringify(fetchOptions.body)}`);
}

export const saveToCache = (url, fetchOptions, responseJson) => {
  return initializeIndexedDb().then(() => {
    const transactionSave = db
      .transaction(cacheConfig.dbCollectionName, "readwrite")
      .objectStore(cacheConfig.dbCollectionName);
    const requestSave = transactionSave.add({
      url: urlWithBodyHash(url, fetchOptions),
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

export const getFromCache = (url, fetchOptions, configOptions = {}) => {
  return initializeIndexedDb(configOptions.cache).then(() => {
    return new Promise((resolve, reject) => {
      if (!cachingEnabled) {
        return resolve(null);
      }

      const transactionCleanUp = db
        .transaction(cacheConfig.dbCollectionName, "readwrite")
        .objectStore(cacheConfig.dbCollectionName);
      const indexCleanUp = transactionCleanUp.index('expiryTime');
      const upperBoundOpenKeyRange = IDBKeyRange.upperBound(Date.now(), true);
      indexCleanUp.openCursor(upperBoundOpenKeyRange).onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
          let transactionDelete = db
            .transaction(cacheConfig.dbCollectionName, "readwrite")
            .objectStore(cacheConfig.dbCollectionName)
            .delete(event.target.result.value[cacheConfig.dbCollectionKey]);
          cursor.continue();
        }
      };

      const transactionIndex = db
        .transaction(cacheConfig.dbCollectionName, "readwrite")
        .objectStore(cacheConfig.dbCollectionName);
      const index = transactionIndex.index(cacheConfig.dbCollectionKey);
      const responseFromCache = index.get(urlWithBodyHash(url, fetchOptions));
      responseFromCache.onsuccess = function(event) {
        if (!event.target.result ||
          event.target.result.expiryTime < Date.now()
        ) {
          if (event.target.result && event.target.result.expiryTime < Date.now()){
            const transactionDelete = db
              .transaction(cacheConfig.dbCollectionName, "readwrite")
              .objectStore(cacheConfig.dbCollectionName)
              .delete(event.target.result[cacheConfig.dbCollectionKey]);
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
