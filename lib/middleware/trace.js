const randomBytes = require('mz/crypto').randomBytes;

module.exports = async(ctx, next) => {
  ctx.id = await randomBytes(24);

  const req = ctx.req;
  const res = ctx.res;

  // request start
  ctx.trace('time.start');
  // request end
  req.once('end', ctx.trace.bind(this, 'time.end'));
  // response headers
  const writeHead = res.writeHead;
  res.writeHead = () => {
    ctx.trace('time.headers');
    return writeHead.apply(ctx, arguments);
  };
  // response finish
  res.once('finish', ctx.trace.bind(this, 'time.finish'));

  await next();
};
