/**
 * Attach middleware and such to the app.
 */

const env = process.env.NODE_ENV || 'development';
const convert = require('koa-convert');

module.exports = function(app, options) {
  options = options || {};

  // methods
  if (options.responseTime !== false) app.use(require('koa-response-time')());
  // app.use(require('./trace'));
  if (env !== 'production' && env !== 'test') app.use(require('koa-logger')(options.logger));

  app.use(require('koa-compress')(options.compress));

  require('./headers')(app, options.security);

  // throw 404 pages
  app.use(require('./pageNotFoundHandler'));

  app.use(require('koa-conditional-get')(options.etag));

  // app.use(require('koa-normalize')());
  app.use(convert(require('koa-file-server')(options.fileServer)));
  // if (options.polyfills !== false)
  // app.use(require('koa-polyfills')(options.polyfills));
  if (options.cash) { app.use(require('koa-cash')(options.cash)); }

  app.use(require('koa-json')(options.json));
  if (options.session !== false) { app.use(require('koa-session')(options.session, app)); }

  return app;
}
