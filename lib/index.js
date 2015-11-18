var Keen = require('keen-tracking');
var extend = require('keen-tracking/lib/utils/extend');

// Accessor methods

function readKey(str){
  if (!arguments.length) return this.config.readKey;
  this.config.readKey = (str ? String(str) : null);
  return this;
}

function queryPath(str){
  if (!arguments.length) return this.config.readPath;
  if (!this.projectId()) {
    this.emit('error', 'Keen is missing a projectId property');
    return;
  }
  this.config.readPath = (str ? String(str) : ('/3.0/projects/' + this.projectId() + '/queries'));
  return this;
}

// Query method

function query(){}

// HTTP methods

function get(){}

function post(){}

function put(){}

function del(){}

// Extend client instance

extend(Keen.prototype, {
  'readKey'   : readKey,
  'queryPath' : queryPath,
  'query'     : query,
  'get'       : get,
  'post'      : post,
  'put'       : put,
  'del'       : del
});

module.exports = Keen;
