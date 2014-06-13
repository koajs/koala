
/**
 * Attach middleware and such to the app.
 */

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, options) {
  options = options || {};

  // methods
  app.use(require('koa-response-time')());
  if (env !== 'production' && env !== 'test') app.use(require('koa-logger')(options.logger));

  app.use(require('koa-compress')(options.compress));
  app.use(require('koa-file-server')(options.fileServer));
  app.use(require('koa-polyfills')(options.polyfills));

  require('./headers')(app, options.security);

  // delegate to the app's error handler
  app.use(function* (next) {
    yield* app.errorHandler.call(this, next);
  })

  if (options.cash) app.use(require('koa-cash')(options.cash));
  app.use(require('koa-json')(options.json));
  app.use(require('koa-session')(options.session));

  app.use(require('./initialize'));

  return app;
}
