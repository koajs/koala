
## Polyfills

A [polyfill](https://github.com/polyfills/polyfills) server is included with
Koala. This might seem like an odd feature to add to a framework,
but the goal is much broader.
Part of the reason we have such a crazy mess with front-end package managers
is because we need to create a lot of tiny modules that resolve
browser inconsistencies, specifically support for JS APIs.
The easiest thing to do is just polyfill old browsers and ditch all these tiny modules.

However, you don't want to have the latest browsers download `50kb` of polyfills
when all it needs is `5kb`.
This is the purpose of `polyfills` - serve polyfill bundles based on the
client's user-agent, giving them only what they need.

### GET /polyfill.js

Add `<script src="/polyfill.js"></script>` to your page,
and the appropriate polyfills will be used on the page.

### [yield] this.polyfills.push()

To avoid that extra HTTP request delay,
SPDY push `polyfill.js` so your page loads as fast as possible.
You only need to do this when you serve HTML pages that have the script tag.
