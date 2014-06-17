
## Error Page

Koa doesn't have an error page by default.
Koala uses [koa-error](https://github.com/koajs/error) by default.
If you'd like to change the error handler, set it on your app:

```js
app.errorHandler = someErrorHandler;
```

## 404 Page

You can also add a custom 404 handler.

```js
app.pageNotFoundHandler = some404Handler;
```
