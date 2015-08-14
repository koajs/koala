
# Koala<sub>&alpha;</sub>

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

A suite of Koa utilities allowing for quicker bootstrapping,
as well as a consequential guide on how to write apps using the Koa philosophy.
Think of it as a KrakenJS for Koa.

Beware! Koala is alpha software!

## Philosophy

Koa is a bare minimal framework, focusing on unopinionated core HTTP utilities.
However, this is not sufficient for most apps as a lot is not supported out of the box.
Including a bunch of dependencies in every new app you create quickly becomes annoying.

The goal of Koala is to include the most used and unopinionated parts of apps
into a single framework. Many things such as body parsing, sessions, and CSRF are
included. Many other things, such as routing, is too opinionated and not included.

Unlike other frameworks, Koala will __not dictate how to write business logic__.
Thanks to generators and, eventually, ES7 Async/Await, writing business logic in Koa is much easier than other frameworks,
and Koala's goal is to only make it easier.
Don't expect a single option to automatically do magic for your app.

Feel free to create suggestions!

## Features and Documentation

The Koala framework adds to Koa:

- [Body Parsing](docs/body-parsing.md)
  - Seamless `Expect: 100-continue` support
  - Per-request body limits
  - Supports JSON, urlencoded, and multipart bodies
  - Supports arbitrary strings, buffers, and files as bodies
  - Optional nested parameter support
- [SPDY](docs/spdy.md) - specifically push streams
- [File Serving](docs/file-serving.md) - with SPDY push support
- [Sessions](docs/sessions.md)
  - Cookie-based sessions
  - CSRF protection
- [Response Caching](docs/response-caching.md) - cache and serve responses using an arbitrary store
- [JSONP](docs/jsonp.md) - safe jsonp support
- [Security Headers](docs/headers.md)
- [Error Page](docs/error-page.md) - better default error page
- [Tracing](docs/tracing.md)
- [etc](docs/etc.md)
  - Basic auth
  - Object stream support
  - Optional nested query string supported
- [FAQ](docs/faq.md)

`koala(1)` will be a generator, similar to what `express(1)` is.

## Usage

Simply replace `require('koa')` with `require('koala')`.
Koala returns a `koa` app, except it includes more features.

```js
var koala = require('koala');
var app = koala();

app.use(function* () {
  this.response.status = 204;
});

var fn = app.callback();

require('http').createServer(fn).listen(function (err) {
  if (err) throw err;
  console.log('Koala app listening on port %s', this.address().port);
});
```

## Roadmap

Some additional features may include:

- Timeout assertion
- Server-Side Event Streams
- Rate limiting

Let me know if you have any other suggestions.

[gitter-image]: https://badges.gitter.im/koajs/koala.png
[gitter-url]: https://gitter.im/koajs/koala
[npm-image]: https://img.shields.io/npm/v/koala.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koala
[github-tag]: http://img.shields.io/github/tag/koajs/koala.svg?style=flat-square
[github-url]: https://github.com/koajs/koala/tags
[travis-image]: https://img.shields.io/travis/koajs/koala.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/koala
[coveralls-image]: https://img.shields.io/coveralls/koajs/koala.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/koala?branch=master
[david-image]: http://img.shields.io/david/koajs/koala.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/koala
[license-image]: http://img.shields.io/npm/l/koala.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/koala.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koala
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
