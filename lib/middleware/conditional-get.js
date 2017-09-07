
module.exports = function(options) {
  options = options || {};

  if (!options.calculate) {
    let hash = options.hash;
    if (hash == null || hash === true) hash = 'sha256';
    if (hash && hash !== 'crc32') {
      const createHash = require('crypto').createHash;
      const encoding = options.encoding || 'base64';
      options.calculate = function(body) {
        return createHash(hash).update(body).digest(encoding);
      };
    }
  }

  const etag = require('koa-etag')(options);

  return function * conditionalGet(next) {
    yield * etag.call(this, next);
    if (this.request.fresh) this.response.status = 304;
  };
};
