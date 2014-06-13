
var koa = require('koa');
var merge = require('merge-descriptors');

var middleware = require('./middleware');
var ctx = require('./context');
var req = require('./request');
var res = require('./response');
var App = require('./app');

module.exports = function koala(options) {
  options = options || {};

  var app = koa();

  middleware(app, options);
  merge(app.context, ctx);
  merge(app.request, req);
  merge(app.response, res);
  App(app);

  // properties
  app.errorHandler = require('koa-error')(options.error);
  app.jsonStrict = options.jsonStrict !== false;

  // proto stuff
  require('koa-csrf')(app);
  require('koa-body-parsers')(app);
  // nested query string support
  if (options.qs) {
    require('koa-qs')(app);
    app.querystring = require('qs');
  }

  return app;
}
