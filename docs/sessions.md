
## Sessions

Koala includes [koa-session](https://github.com/koajs/session) for cookie sessions.
Koala does __not__ support database backed stores,
at least one that is supported by `this.session`.

Koala also includes [koa-csrf](https://github.com/koajs/csrf) for CSRF protection.
Unlike other frameworks, CSRF verification is not done automatically.

### options.session

All options are passed to `koala(options)` and hashed as `options.session`.
See [koa-session](https://github.com/koajs/session) for all the options.

### this.session

This is the session object.
You can add or remove properties as you please.
Any properties prefixed with `_` will __not__ be saved.
Don't add anything crazy like functions!

### this.session.secret

This is the secret key used to CSRF tokens.
Only delete this if you want all future CSRF tokens on this session to fail
(though you might as well just `delete this.session`).

This doesn't have to be "totally secret" as the name may imply,
but it is pretty much unsusceptible to client-side attacks because
it is saved with a `httpOnly` header (unless you disable it),
meaning an attacker can't grab this key using JavaScript.

### this.csrf

Lazily create a CSRF token.
Every request creates a different CSRF token to avoid BREACH attacks.

### this.assertCSRF([body || string])

Assert a valid CSRF token exists on the request,
optionally checking a `body` or a `string`.
If a `body`, it will check for a `._csrf` string.
If CSRF verification fails, a `403` error will be thrown.

You may not always want to verify the CSRF token.
For example, you probably don't need CSRF protection against API calls.
