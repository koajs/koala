
let randomBytes = require('mz/crypto').randomBytes;

module.exports = function * trace(next) {
  this.id = yield randomBytes(24);

  let ctx = this;
  let req = this.req;
  let res = this.res;

  // request start
  this.trace('time.start');
  // request end
  req.once('end', this.trace.bind(this, 'time.end'));
  // response headers
  let writeHead = res.writeHead;
  res.writeHead = function() {
    ctx.trace('time.headers');
    return writeHead.apply(this, arguments);
  };
  // response finish
  res.once('finish', this.trace.bind(this, 'time.finish'));

  yield * next;
};
