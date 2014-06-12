
var ms = require('ms');

var response = exports;

response.cc =
response.cacheControl = function (maxage) {
  if (maxage === false) {
    this.response.set('Cache-Control', 'private, no-cache');
  }
  if (typeof maxage === 'string') {
    var tmp = ms(maxage)
    if (tmp) maxage = ms
  }
  if (typeof maxage === 'number') {
    maxage = Math.round(maxage / 1000);
    this.response.set('Cache-Control', 'public, max-age=' + maxage);
  } else {
    this.response.set('Cache-Control', maxage);
  }
  return this;
}
