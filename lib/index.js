
var koa = require('koa');
var merge = require('merge-descriptors');

var middleware = require('./middleware');
var ctx = require('./context');
var req = require('./request');
var res = require('./response');

module.exports = function koala(options) {
  options = options || {};

  var app = koa();

  middleware(app, options);
  merge(app.context, ctx);
  merge(app.request, req);
  merge(app.response, res);

  return app;
}
