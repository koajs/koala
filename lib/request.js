
const basicAuth = require('basic-auth');

const request = exports;

Object.defineProperty(request, 'basicAuth', {
  get: function() {
    return basicAuth(this.req);
  }
});
