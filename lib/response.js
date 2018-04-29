const ms = require('ms');

<<<<<<< HEAD
const response = exports;
||||||| merged common ancestors
var ms = require('ms');

var response = exports;
=======
const ms = require('ms');

const response = exports;
>>>>>>> Make the tests pass

// should this be an accessor? hmmm...
response.cc =
  response.cacheControl = function(maxage) {
    if (maxage === false) {
      this.set('Cache-Control', 'private, no-cache');
      return this;
    }
    if (typeof maxage === 'string') {
      const tmp = ms(maxage);
      if (tmp) maxage = tmp;
    }
    if (typeof maxage === 'number') {
      maxage = Math.round(maxage / 1000);
      this.set('Cache-Control', 'public, max-age=' + maxage);
    } else if (typeof maxage === 'string') {
      this.set('Cache-Control', maxage);
    } else {
      throw new Error('invalid cache control value: ' + maxage);
    }
    return this;
<<<<<<< HEAD
  };
||||||| merged common ancestors
  }
  if (typeof maxage === 'string') {
    var tmp = ms(maxage)
    if (tmp) maxage = tmp
  }
  if (typeof maxage === 'number') {
    maxage = Math.round(maxage / 1000);
    this.set('Cache-Control', 'public, max-age=' + maxage);
  } else if (typeof maxage === 'string') {
    this.set('Cache-Control', maxage);
  } else {
    throw new Error('invalid cache control value: ' + maxage);
  }
  return this;
}
=======
  }
  if (typeof maxage === 'string') {
    var tmp = ms(maxage)
    if (tmp) maxage = tmp
  }
  if (typeof maxage === 'number') {
    maxage = Math.round(maxage / 1000);
    this.set('Cache-Control', `public, max-age=${maxage}`);
  } else if (typeof maxage === 'string') {
    this.set('Cache-Control', maxage);
  } else {
    throw new Error(`invalid cache control value: ${maxage}`);
  }
  return this;
}
>>>>>>> Make the tests pass
