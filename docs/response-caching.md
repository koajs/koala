
## Response Caching

Koala features response caching, internally spelled as "cash".
This allows you to avoid using complex varnish and such infrastructure
to cash dynamic pages.
For example, you may want to cache pages for visitors, but not for users as
user pages are all customized.

Response caching is internally opt-in as it requires a database store.
See [koa-cash](https://github.com/koajs/cash) for more details.

## options.cash

All options passed to [koa-cash](https://github.com/koajs/cash) must be hashed
by `.cash`.
