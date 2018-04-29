const bodyParser = require('koa-bodyparser')
const conditional = require('koa-conditional-get')
const convert = require('koa-convert')
const CSRF = require('koa-csrf')
const error = require('koa-error')
const etag = require('koa-etag')
const Koa = require('koa')
const merge = require('merge-descriptors')
const Pug = require('koa-pug')
const jsonp = require('koa-safe-jsonp')
const qs = require('koa-qs')
const trace = require('koa-trace')

const middleware = require('./middleware')
const ctx = require('./context')
const req = require('./request')
const res = require('./response')
const App = require('./app')

module.exports = class Koala extends Koa {
  constructor(options = {}) {
    super()

    const app = new Koa();
    middleware(this, options);
    merge(this.context, ctx);
    merge(this.request, req);
    merge(this.response, res);
    App(this);

    // handlers
    this.pageNotFoundHandler = pageNotFoundHandler

    // properties
    this.jsonStrict = options.jsonStrict !== false

    // proto stuff
    this.use(conditional())
    // intentionally undocumented, this is used in unit tests to bypass CSRF setup
    if (!options.__disableCsrf) {
      this.use(new CSRF({
        invalidSessionSecretMessage: 'Invalid session secret',
        invalidSessionSecretStatusCode: 403,
        invalidTokenMessage: 'Invalid CSRF token',
        invalidTokenStatusCode: 403,
        excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
        disableQuery: false
      }))
    }
    this.use(etag())
    this.use(bodyParser({
      strict: this.jsonStrict,
      formLimit: options.formLimit,
      jsonLimit: options.jsonLimit,
      textLimit: options.textLimit
    }))
    // this.use(convert(trace))
    new Pug({
      debug: options.debug,
      pretty: false,
      compileDebug: options.debug,
      locals: {},
      basedir: `${__dirname}/templates`,
      helperPath: []
    }).use(this)
    this.use(error({
      engine: 'pug',
      template: `${__dirname}/templates/error.pug`
    }))
    // nested query string support
    if (options.qs) {
      qs(this)
      this.querystring = require('qs')
    }

    // jsonp support
    if (options.jsonp) {
      jsonp(this, options.jsonp)
    }

    if (process.env.NODE_ENV !== 'production' && this.debug) this.debug()
  }
}

async function pageNotFoundHandler(next) {
  await next()

  if (this.response.body) return
  if (this.response.status !== 404) return
  this.throw(404)
}
