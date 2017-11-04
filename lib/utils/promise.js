import Bluebird from 'bluebird/js/browser/bluebird.core';

Bluebird.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});

export default Bluebird;
