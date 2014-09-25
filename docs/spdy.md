
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

### Setup SPDY server

Since [node-spdy](https://github.com/indutny/node-spdy) is optional dependency. You need install it by yourself `npm install spdy --save`.

SPDY server is compatible with https module and fallback to regular https (for browsers that don't support SPDY yet).

Imagine you're building a single page web site.

```js
app.use(function* () {
    yield this.fileServer.send('index.html');
    if (this.isSpdy) {
        yield this.push('/some-file.js', {
            filename: __dirname + '/some-file.js'
        });
        yield this.fileServer.push('css/all.css'); // or better use fileServer.push
        yield this.fileServer.push('img/logo.png'); // push image resources
        yield this.polyfills.push(); // polyfills support push also
    }
});

var spdy = require('spdy'),
    fs = require('fs');

var server = spdy.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    ca: fs.readFileSync('server.csr')
}, app.callback());

server.listen(3000);
```

Open chrome(27+) visit <https://localhost:3000>. Server logs like this:

```
  <-- GET /
  --> GET / 200 302ms 367b
```

If you visit with other old browser without spdy support. The logs maybe like this:

```
  <-- GET /
  --> GET / 200 76ms 367b
  <-- GET /css/all.css
  --> GET /css/all.css 200 16ms 32.73kb
  <-- GET /js/polyfill.js
  --> GET /js/polyfill.js 200 20ms -
  <-- GET /some-file.js
  --> GET /some-file.js 200 15ms -
  <-- GET /img/logo.png
  --> GET /img/logo.png 200 29ms 29.89kb
```

SPDY can help you reuse http connection. Send more data in one request.

> Its goal is to reduce the latency of web pages. --- <http://www.chromium.org/spdy>

### self-signed SSL Certificate

For testing purposes. We need self-signed SSL certificate to boot up SPDY server.

An easily way is install [spdy-keys](https://github.com/normalize/spdy-keys).

```js
var keys = require('spdy-keys');

spdy.createServer(keys, app.callback());
```

If you want to create keys by yourself. Read [How to create a self-signed SSL Certificate ...](http://www.akadia.com/services/ssh_test_certificate.html)
