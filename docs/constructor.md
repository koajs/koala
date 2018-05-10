
# Instantiating a koala instance

```js
new Koala(options)
```

## Options

### error

The options for [koa-error](https://github.com/koajs/error).

### jsonStrict

Sets the same property on the koa instance TODO: wat

### QS

Adds the [koa-qs](https://github.com/koajs/qs) query string parsing middleware.

### jsonp

Adds the [koa-safe-jsonp](https://github.com/koajs/koa-safe-jsonp) jsonp middleware,
and contains the options passed to it.

### hsts

Enables [hsts](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security).  See
the options.security header in docs/headers.md for more details.

### responseTime

Adds the [koa-response-time](https://github.com/koajs/koa-response-time) middleware
