module.exports = function(app, options) {
  options = options || {};

  let hsts;
  if (options.hsts) {
    if (typeof options.hsts === 'number') {
      options.hsts = { maxAge: options.hsts };
    }
    hsts = 'max-age=' + Math.round(options.hsts.maxAge / 1000);
    if (options.includeSubDomains) { hsts += '; includeSubDomains'; }
  }

  let xframe = options.xframe;
  // enable by default
  if (xframe == null) xframe = true;
  if (xframe === true) xframe = 'DENY';
  if (xframe === 'same') xframe = 'SAMEORIGIN';

  // to do
  // let csp = options.csp;

  // to do
  // who uses this?
  // let p3p = options.p3p;

  let xss = options.xssProtection;
  // enable by default
  if (xss == null) xss = true;
  if (xss === true) xss = '1; mode=block';

  let nosniff = options.nosniff;
  // enable by default
  if (nosniff != null) nosniff = true;

  app.use(function * headers(next) {
    this.response.set('X-Powered-By', 'koala, koa');
    if (hsts) this.response.set('Strict-Transport-Security', hsts);
    if (nosniff) this.response.set('X-Content-Type-Options', 'nosniff');

    yield * next;

    // headers only necessary for HTML pages
    const type = this.response.type;
    if (type && ~type.indexOf('text/html')) {
      if (xframe) this.response.set('X-Frame-Options', xframe);
      if (xss) this.response.set('X-XSS-Protection', xss);
    }
  });
};
