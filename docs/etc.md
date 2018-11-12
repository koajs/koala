## Et Cetera

Various additional features added to Koala.

### this.request.basicAuth

Uses [basic-auth](https://github.com/visionmedia/node-basic-auth).
If available, returns `{name: , pass: }`.

```js
app.use(async (next) => {
  const auth = this.request.basicAuth;
  if (!auth || auth.name !== 'mycompany' || auth.pass !== 'somepassword') {
    this.throw(401, 'get out of here! this is a private server!');
  }

  await next;
})
```

### Object Stream Support

Thanks to [koa-json](https://github.com/koajs/json),
you can simply set an object stream as the body,
and Koala will automatically stringify it for you:

```js
app.use(async () => {
  this.body = db.users.find().limit(100).stream();
})
```

### Nested Query String Support

By default, nested query strings are not supported
either for the form parser or for URL query strings.
You may be used to nested query strings if you come from Express.

To enable both, simply set `options.qs = true`:

```js
const app = koala({
  qs: true
})
```

Note that `koala` does not pin the `qs` dependency.
You should pin it yourself in your top-level app!
