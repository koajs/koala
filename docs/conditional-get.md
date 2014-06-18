
# Conditional GET

Koa doesn't automatically set `ETag`s nor does it check for `304` responses.
Koala does!

## ETags

By default, koala creates ETags as base64-encoded `sha256` sums.
However, there are a couple of ways to use different calculations.

To use CRC32, set `options.etag.hash = false` or `options.etag.hash = 'crc32'`.
This is the default used by the underling [koa-etag](https://github.com/koajs/etag) middleware.

To use a custom hash and encoding, set the `options.etag.hash` and `options.etag.encoding`
options, respectively.

To use a custom function, set `options.etag.calculate` as a function.

## 304 Responses

After calculating the ETag,
Koala automatically checks whether the request is "fresh"
and automatically sends `304` status codes whenever appropriate.
This automatically speeds up your app.

The only caveat is that ETags are not supported for arbitrary streams,
only file streams.
Thus, if you're setting `this.response.body=` as a custom stream,
you should must set the ETag yourself if you'd like,
as well as have a `stream.destroy()` function available for cleanup.
