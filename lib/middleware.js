
/**
 * Attach middleware and such to the app.
 */

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, options) {
  options = options || {};

  require('koa-csrf')(app);

  app.use(require('koa-response-time')());
  if (env !== 'production' && env !== 'test') app.use(require('koa-logger')());

  app.use(require('koa-compress')(options.compress));
  app.use(require('koa-file-server')(options.fileServer));
  app.use(require('koa-polyfills')());

  // error handler

  app.use(require('koa-json')());
  app.use(require('koa-session')());

  app.use(function* koala_initialize(next) {
    // view locals
    this.locals = Object.create(null);
    yield* next;

    // why not
    if (this.request.fresh) this.response.status = 304;
  })

  return app;
}
