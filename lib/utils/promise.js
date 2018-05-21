import BluebirdCore from 'bluebird/js/browser/bluebird.core';
export const BlueBird = BluebirdCore.config({
  cancellation: true,
  longStackTraces: false,
  warnings: false
});
export default BlueBird;
