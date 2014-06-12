
## Static Serving

Koala uses [koa-file-server](https://github.com/koajs/file-server) to serve static files.
Unlike other static servers, this server assumes that
__files do not change during the lifetime of the server__.
If one of your static files change during runtime,
__it is no longer static!__.
Use an additional middleware to serve these dynamic files.
During development, you should ideally create a middleware for your build process.

The file server also only serves from a single folder.
Simply symlink any other files into this folder at start up to keep things simple.
Don't try to juggle multiple static folders.

Some features of this static server:

- SPDY push support
- Creates strong `sha256` etags and caches them
- Caches `fs.stat()` calls
- Caches gzipped versions of these files

In particular, `.gz` versions of your static files are automatically created,
so be sure to add `*.gz` to your `.gitignore`!.

## options.fileServer

Where to pass all the options to the file server.

## var file = yield* this.fileServer.push(path, [options])

SPDY push a file from the folder.
`path` must be relative without the leading `/`.
Errors will be thrown on unknown files.
The only `option` is `priority: 7`.
