/**
 * This is a server used only for development.
 * Do not use this in production!
 */

const http = require('http');

module.exports = function(app) {
  app.listen = function listen(port, cb) {
    if (typeof port === 'function') {
      cb = port;
      port = null;
    }
    const fn = app.callback();
    const server = http.createServer();
    server.on('request', fn);
    server.on('checkContinue', (req, res) => {
      req.checkContinue = true;
      fn(req, res);
    });
    server.listen(port || process.env.PORT || 0, cb);
    return server;
  };
};
