const basicAuth = require('basic-auth');

<<<<<<< HEAD
const request = exports;
||||||| merged common ancestors
var basicAuth = require('basic-auth');

var request = exports;
=======
const basicAuth = require('basic-auth');

const request = exports;
>>>>>>> Make the tests pass

Object.defineProperty(request, 'basicAuth', {
  get: function() {
    return basicAuth(this.req);
  }
});
