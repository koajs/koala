
## Et Cetera

Various additional features added to Koala.

### this.handled

Check whether a response or status has been set.

### this.request.basicAuth

Uses [basic-auth](https://github.com/visionmedia/node-basic-auth).
If available, returns `{name: , pass: }`.

```js
app.use(function* (next) {
  var auth = this.request.basicAuth;
  if (!auth || auth.name !== 'mycompany' || auth.pass !== 'somepassword') {
    this.throw(401, 'get out of here! this is a private server!');
  }

  yield* next;
})
```

### Object Stream Support

Thanks to [koa-json](https://github.com/koajs/json),
you can simply set an object stream as the body,
and Koala will automatically stringify it for you:

```js
app.use(function* () {
  this.body = db.users.find().limit(100).stream();
})
```

### Nested Query String Support
