const koa = require('koa');
const merge = require('merge-descriptors');

const middleware = require('./middleware');
const ctx = require('./context');
const req = require('./request');
const res = require('./response');
const App = require('./app');

module.exports = function koala(options) {
  options = options || {};

  const app = koa();

  middleware(app, options);
  merge(app.context, ctx);
  merge(app.request, req);
  merge(app.response, res);
  App(app);

  // handlers
  app.errorHandler = require('koa-error')(options.error);
  app.pageNotFoundHandler = pageNotFoundHandler;

  // properties
  app.jsonStrict = options.jsonStrict !== false;

  // proto stuff
  require('koa-csrf')(app);
  require('koa-trace')(app);
  require('koa-body-parsers')(app);
  // nested query string support
  if (options.qs) {
    require('koa-qs')(app);
    app.querystring = require('qs');
  }

  // jsonp support
  if (options.jsonp) {
    require('koa-safe-jsonp')(app, options.jsonp);
  }

  if (process.env.NODE_ENV !== 'production') app.debug();

  return app;
};

function * pageNotFoundHandler(next) {
  yield * next;

  if (this.response.body) return;
  if (this.response.status !== 404) return;
  this.throw(404);
}
