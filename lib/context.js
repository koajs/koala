
var context = exports

Object.defineProperty(context, 'isSpdy', {
  get: function () {
    return this.res.isSpdy;
  }
})

// to do: make threshold configurable
var push = require('koa-spdy-push')();
context.push = function (options) {
  if (!this.res.isSpdy) return;
  return push(this, options);
}

context.save = require('save-to');
