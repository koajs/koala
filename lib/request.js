
var basicAuth = require('basic-auth');

var request = exports;

Object.defineProperty(request, 'basicAuth', {
  get: function () {
    return basicAuth(this.req);
  }
})
