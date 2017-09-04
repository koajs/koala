const bodyParser = require('koa-bodyparser')
const conditional = require('koa-conditional-get')
const convert = require('koa-convert')
const CSRF = require('koa-csrf')
const error = require('koa-error')
const etag = require('koa-etag')
const Koa = require('koa')
const merge = require('merge-descriptors')
const Pug = require('koa-pug')
const Qs = require('koa-qs')
const trace = require('koa-trace')

const middleware = require('./middleware')
const ctx = require('./context')
const req = require('./request')
const res = require('./response')
const App = require('./app')

module.exports = function koala(options) {
  options = options || {}

  const app = new Koa()

  middleware(app, options)
  merge(app.context, ctx)
  merge(app.request, req)
  merge(app.response, res)
  App(app)

  // handlers
  app.pageNotFoundHandler = pageNotFoundHandler

  // properties
  app.jsonStrict = options.jsonStrict !== false

  // proto stuff
  app.use(conditional())
  app.use(new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    disableQuery: false
  }));
  app.use(etag());
  app.use(bodyParser());
  // app.use(convert(trace));
  const pug = new Pug({
    debug: false,
    pretty: false,
    compileDebug: false,
    locals: {},
    basedir: `${__dirname}/templates`,
    helperPath: [],
    app: app // equals to pug.use(app) and app.use(pug.middleware)
  })
  app.use(error({
    engine: 'pug',
    template: `${__dirname}/templates/error.pug`
  }))
  // nested query string support
  if (options.qs) {
    app.use(new Qs())
    app.querystring = require('qs')
  }

  // jsonp support
  if (options.jsonp) {
    app.use(new SafeJsonP({jsonp: options.jsonp}))
  }

  if (process.env.NODE_ENV !== 'production' && app.debug) app.debug()

  return app
}

async function pageNotFoundHandler(next) {
  await next()

  if (this.response.body) return
  if (this.response.status !== 404) return
  this.throw(404)
}
