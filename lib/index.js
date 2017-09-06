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

module.exports = class Koala extends Koa {
  constructor(options = {}) {
    super();

    const app = new Koa();
    middleware(this, options);
    merge(this.context, ctx);
    merge(this.request, req);
    merge(this.response, res);
    App(this);

    // handlers
    this.pageNotFoundHandler = pageNotFoundHandler;

    // properties
    this.jsonStrict = options.jsonStrict !== false;

    // proto stuff
    this.use(conditional());
    this.use(new CSRF({
      invalidSessionSecretMessage: 'Invalid session secret',
      invalidSessionSecretStatusCode: 403,
      invalidTokenMessage: 'Invalid CSRF token',
      invalidTokenStatusCode: 403,
      excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
      disableQuery: false
    }));
    this.use(etag());
    this.use(bodyParser());
    // this.use(convert(trace));
    const pug = new Pug({
      debug: false,
      pretty: false,
      compileDebug: false,
      locals: {},
      basedir: `${__dirname}/templates`,
      helperPath: [],
      app: this // equals to pug.use(this) and this.use(pug.middleware)
    });
    this.use(error({
      engine: 'pug',
      template: `${__dirname}/templates/error.pug`
    }));
    // nested query string support
    if (options.qs) {
      this.use(new Qs());
      this.querystring = require('qs');
    }

    // jsonp support
    if (options.jsonp) {
      this.use(new SafeJsonP({jsonp: options.jsonp}));
    }

    if (process.env.NODE_ENV !== 'production' && this.debug) this.debug();
  }
}

async function pageNotFoundHandler(next) {
  await next()

  if (this.response.body) return
  if (this.response.status !== 404) return
  this.throw(404)
}
