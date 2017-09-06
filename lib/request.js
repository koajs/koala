
let basicAuth = require('basic-auth');

let request = exports;

Object.defineProperty(request, 'basicAuth', {
  get: function() {
    return basicAuth(this.req);
  }
});
