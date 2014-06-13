
## Body Parsing

Unlike Koa, Koala includes body parsing.
Thanks to generators, body parsing is much easier in Koa than in Express and other frameworks.
Body parsing is __not__ automatic and must be `yield`ed.

### Expect: 100-continue

`Expect: 100-continue` is automatically supported as long as you use `app.listen()`.

### Nested Query String Support

By default, node's `querystring` is used,
which does not support nested parameters.
To enable nested parameters, install set `options.qs = true` at initialization.

### Body Limits

Request body limits is a contentious issue.
In general, you'd want to keep the limit low to avoid any
potential attacks on your server.
For example, for login forms, you probably don't need a limit much higher than `1kb`.

You can also now set the limit on a per-request basis.
Your limit on routes where users post articles would probably
be much higher than just the login route.
This is previously impossible with middleware.

### CSRF

Koala uses [koa-csrf](https://github.com/koajs/csrf) for CSRF tokens.
See [sessions](sessions.md) for more information on CSRF.

To check a body for a CSRF token,
you __must__ do `this.assertCSRF(body)`,
otherwise, only headers will be checked.
This allows you to selectively assert a token exists,
for example, don't bother asserting when the user supplies an API token.

```js
var body = yield* this.request.json([limit]);
if (!body) this.throw(400, 'no body supplied!');
this.assertCSRF(body); // will throw if CSRF verification fails

// do something with the body
```

### Content Negotiation

These request body methods are designed to be used with `this.request.is()`.
Here's an example:

```js
switch (this.request.is('json', 'urlencoded', 'multipart', 'image/*')) {
case 'json':
  var body = yield* this.request.json();
  break;
case 'urlencoded':
  var body = yield* this.request.urlencoded();
  break
case 'multipart':
  var parts = this.request.parts();
  var part;
  while (part = yield parts) {
    if (part.length) {
      var key = part[0];
      var value = part[1];
      // check the CSRF token
      if (key === '_csrf') this.assertCSRF(value);
    } else {
      yield this.save(part, '/tmp/file');
    }
  }
  break;
case 'image/jpeg':
case 'image/png':
case 'image/gif':
  // a supported image, so let's download it to disk
  var destination = '/tmp/image';
  yield this.save(this.req, destination);
  break
default:
  this.throw(415, 'i do not know what to do with this request type')
}
```

### this.response.writeContinue()

If `Expect: 100-continue` was sent to the client,
this will automatically response with a "100-continue".
Use this right before parsing the body.
Automatically called by all following body parsers,
but you would still have to call it if you're doing something like:

```js
app.use(function* (next) {
  if (this.request.is('image/*')) {
    this.response.writeContinue();
    yield this.save(this.req, '/tmp/image')
  }
})
```

### var body = yield* this.request.json([limit])

Get the JSON body of the request, if any.
`limit` defaults to `100kb`.

### var body = yield* this.request.urlencoded([limit])

Get the traditional form body of the request, if any,
`limit` defaults to `100kb`.

### var text = yield* this.request.text([limit])

Get the body of the request as a single `text` string.
`limit` defaults to `100kb`.
You could use this to create your own request body parser of some sort.

### var buffer = yield* this.request.buffer([limit])

Get the body of the request as a single `Buffer` instance.
`limit` defaults to `1mb`.

### var parts = this.request.parts([options])

Use this to parse multipart bodies.
Uses [co-busboy](https://github.com/cojs/busboy) and thus [busboy](https://github.com/mscdex/busboy).
This API is a little different.
`parts` must be yielded to get the next part.
See [co-busboy's](https://github.com/cojs/busboy) docs on its usage.

```js
app.use(function* (next) {
  if (!this.request.is('multipart')) return yield* next;

  var parts = this.request.parts();
  var part;
  while (part = yield parts) {
    if (part.length) {
      // arrays are fields
      console.log('key: ' + part[0])
      console.log('value: ' + part[1])
    } else {
      // it's a stream, so save it to disk
      yield this.save(part, '/tmp/something.md');
    }
  }
})
```

Files are __not__ automatically stored to disk for you.
Use `yield this.save()` to save files to disk.

### yield this.save(stream, destination)

Utility to save a stream to disk.
Designed to be used in conjunction with `this.request.parts()`
or maybe `this.req`.
See [save-to](https://github.com/stream-utils/save-to) for more information.
