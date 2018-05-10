const crypto = require('crypto');

module.exports = options => {
  options = options || {};

  if (!options.calculate) {
    let hash = options.hash;
    if (hash == null || hash === true) hash = 'sha256';
    if (hash && hash !== 'crc32') {
      const createHash = crypto.createHash;
      const encoding = options.encoding || 'base64';
      options.calculate = body => {
        return createHash(hash).update(body).digest(encoding);
      };
    }
  }

  const etag = require('koa-etag')(options);

  return async(ctx, next) => {
    await etag.call(ctx, next);
    if (ctx.request.fresh) ctx.response.status = 304;
  };
};
