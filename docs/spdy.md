
## SPDY

Koala adds some SPDY support to Koa.
Once SPDY becomes an HTTP standard and is baked into node.js,
some of these features will be placed in Koa.

### this.isSpdy

Check whether SPDY is supported.

```js
app.use(function* (next) {
  if (this.isSpdy) {
    this.push('/some-file.js', {
      filename: __dirname + '/some-file.js'
    });
  }

  yield* next;
})
```

### [yield] this.push([path], options, [priority])

SPDY push a body.
This is a wrapper around [node-spdy push streams](https://github.com/indutny/node-spdy#push-streams),
allowing you to not think about stream acknowledgement,
error handling, and file descriptor leaks.
[spdy-push](https://github.com/jshttp/spdy-push) is used under the hood.

- `path` - the path of the push stream
- `priority: 7` - the priority of the push stream. `0` is highest, `7` is lowest.
- `options`:
  - `path` if not set as an argument
  - `priority: 7` if not set as an argument
  - `body` - the body of the stream as a string, buffer, or stream
  - `filename` - the absolute path of the source file
  - `headers` - the headers for the stream

Either set `options.body` or `options.filename`.
The following headers will automatically be set if possible:

- `content-length` - unless the body is a stream or `filename`
- `content-encoding`
- `content-type` - based on `path`

Argument order does not matter, so use whatever is convenient.

```js
app.use(function* () {
  this.push({
    path: '/index.js',
    filename: path.resolve('public/index.js'),
    headers: {
      'cache-control': 'public, max-age=999999999999'
    }
  })
})
```

You may optionally `yield this.push()`.
This yields until the push stream is finished.
You may want this to avoid some issues with push streams.
