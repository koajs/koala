
## Headers

Koala adds some options and properties to make setting headers easier.

### `options.security`

Some security headers are available hashed as `options.security` passed to `koala(options)`.

- `hsts`
- `xframe`
- `c3p`
- `p3p`
- `xss` or `xssProtection`
- `cto` for `X-Content-Type-Options`

### X-UA-Compatible

This header is automatically set on HTML responses

### Cache Control

A utility to make setting the `Cache-Control` header a little bit easier.
Available as:

- `this.cacheControl()`
- `this.cc()`
- `this.response.cacheControl()`
- `this.response.cc()`

#### this.cc(ms)

Set the `max-age` in milliseconds or as a human readable time.
Assumes the response is `public`.

```js
this.cc(1000) // => Cache-Control: public, max-age=1
this.cc('1 hour') // => Cache-Control: public, max-age=3600
```

#### this.cc(false)

Set the `Cache-Control` to `private, no-cache`.

#### this.cc(string)

If a string is passed and can not be converted into seconds,
it is simply set as the cache control.
