
/**
 * Attach middleware and such to the app.
 */

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, options) {
  options = options || {};

  // methods
  if (options.responseTime !== false) app.use(require('koa-response-time')());
  app.use(require('./trace'));
  if (env !== 'production' && env !== 'test') app.use(require('koa-logger')(options.logger));

  app.use(require('koa-compress')(options.compress));

  require('./headers')(app, options.security);

  // delegate to the app's error handler
  app.use(errorHandler);
  // throw 404 pages
  app.use(pageNotFoundHandler);

  app.use(require('./conditional-get')(options.etag));

  // app.use(require('koa-normalize')());
  app.use(require('koa-file-server')(options.fileServer));
  if (options.polyfills !== false)
    app.use(require('koa-polyfills')(options.polyfills));
  if (options.cash)
    app.use(require('koa-cash')(options.cash));

  app.use(require('koa-json')(options.json));
  if (options.session !== false)
    app.use(require('koa-session')(options.session));

  return app;
}

/**
 * To do: make the handlers simply renderers,
 * and do all the error logic ourselves.
 */

function* errorHandler(next) {
  yield* this.app.errorHandler.call(this, next);
}

function* pageNotFoundHandler(next) {
  yield* this.app.pageNotFoundHandler.call(this, next);
}
