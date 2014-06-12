
## Why are you creating this?

When building an app,
I baked a lot of this logic into my app.
It's better to make it a generic module so other people could use it
and set some standard on how to build Koa apps.

## Will routing will be supported?

Nope. Routing is too opinionated, and different apps have different use-cases.

## Will template rendering be supported?

Perhaps. There are currently two options that I'm looking at:

- [co-views](https://github.com/visionmedia/co-views)
- [transformers](https://github.com/ForbesLindesay/transformers)

The main issue for me right now is maintenance.
[consolidate](https://github.com/visionmedia/consolidate.js) looks like it needs some love,
and I don't think anyone uses `transformers`.
I'd also prefer if anything we use is within an organization so they have multiple maintainers.

## Will database-backed session stored be supported?

Nope.
My personal opinion is that database-backed session stores should not
be used as the `.session` object, but as an arbitrary object backed
by a key the developer chooses, perhaps `.session.sid`.
With Koa, it's easier as well as better to do atomic updates.

For example, if you use MongoDB, you might want to do something like: https://github.com/aheckmann/koa-mongodb-session/issues/5.

## Will other SPDY and HTTP/2 features be supported?

A lot of these features belong at the `http.createServer()` state of
deploying your app, which Koala does not handle.
However, if they are node `req` and `res` APIs,
then we'll include some way of making it convenient.
