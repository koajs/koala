
# Koala

An opinionated suite of Koa utilities allowing for quicker bootstrapping
as well a guide to how to write apps using the Koa philosophy.
Very much in progress.

A generator is also included to bootstrap your app.

## Features

- Body parsing is now included
  - First class request limit support
  - Support compressed bodies
  - JSON bodies
  - Urlencoded bodies
  - Multipart bodies
  - Optional nested parameter support
- SPDY
  - Convenient `.push()`
  - Convenient SPDY Push file server
- Security
  - CSRF
  - Security headers
- Optional nested query string supported
- Basic cookie sessions
- Object stream support
- Templates and rendering
- Response compression
- Better error page

`koala(1)`:

- Automatically setup a lot `koala` options
- Setup a basic app template

Probably won't ever be supported:

- Routing - way too opinionated
- HTTP server handling - basically any http.createServer() stuff
- Process handling and clustering

## API

### options

### app

### this

#### this.locals

#### this.session

https://github.com/koajs/session

#### this.csrf

https://github.com/koajs/csrf

#### this.assertCSRF([body])

https://github.com/koajs/csrf

#### this.isSpdy

#### this.push(options)

https://github.com/koajs/spdy-push

#### this.fileServer.push(filename)

https://github.com/koajs/file-server

#### yield this.save(stream, filename)

Save a stream to a file.
Designed to be used in conjunction with `this.request.parts()`.
Specifically, Koala will never save multipart forms to the disk for you.

### req

#### var body = yield* this.request.body([limit])

Yield the request's JSON or urlencoded body, if any.

#### var body = yield* this.request.json([limit])

Yield the request's JSON body, if any.

#### var body = yield* this.request.urlencoded([limit])

Yield the request's urlencoded body, if any.

#### var text = yield* this.request.text([limit])

Yield the request's body as a string.

#### var buf = yield* this.request.buffer([limit])

Yield the request's body as a buffer.

#### var parts = this.request.parts([options])

https://github.com/cojs/busboy

#### var form = yield* this.request.form([limit])

### res
