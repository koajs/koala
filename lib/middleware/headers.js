
module.exports = function (app, options) {
  options = options || {};

  var hsts;
  if (options.hsts) {
    if (typeof options.hsts === 'number') {
      options.hsts = { maxAge: options.hsts };
    }
    hsts = 'max-age=' + Math.round(options.hsts.maxAge / 1000)
    if (options.includeSubDomains)
      hsts += '; includeSubDomains'
  }

  var xframe = options.xframe;
  if (xframe === true) xframe = 'deny';

  var csp = options.csp;

  var p3p = options.p3p;

  var xss = options.xss || options.xssProtection;
  if (xss === true) xss = '1; mode=block';

  var cto = options.cto;
  if (cto === true) cto = 'nosniff';

  app.use(function* headers(next) {
    this.response.set('X-Powered-By', 'koala, koa');
    if (hsts) this.response.set('Strict-Transport-options', hsts);
    if (cto) this.response.set('X-Content-Type-Options', cto);

    yield* next;

    // headers only necessary for HTML pages
    if (this.response.is('html')) {
      this.response.set('X-UA-Compatible', 'IE=edge');
      if (xframe) this.response.set('X-Frame-Options', xframe);
      if (xss) this.response.set('X-XSS-Protection', xss);
    }
  })
}
