## JSONP

Koala use [koa-safe-jsonp](https://github.com/koajs/koa-safe-jsonp) for JSONP response.

By default, `jsonp` is disabled.
To enable `jsonp`, install set `options.jsonp = {jsonp options}` at initialization.
See [jsonp options](https://github.com/koajs/koa-safe-jsonp).

```js
const app = koala({
  jsonp: {
    callback: 'callback'
  }
})
```

### this.jsonp

Send the jsonp response.

```js
app.use(function* () {
  this.jsonp = { name: 'fengmk2' }
})
```

Koala will handle all the security problems,
like [CVE-2014-4671](http://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/).
