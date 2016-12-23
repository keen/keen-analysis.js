(function(env){
  var KeenAnalysis = require('./index');
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-analysis', [], function(){
      return KeenAnalysis;
    });
  }
  env.Keen = KeenAnalysis.extendLibrary(KeenAnalysis);
  module.exports = KeenAnalysis;
}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
