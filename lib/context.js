
var delegate = require('delegates');

var context = exports;

Object.defineProperty(context, 'isSpdy', {
  get: function () {
    return this.res.isSpdy;
  }
})

// to do: make threshold configurable
var push = require('koa-spdy-push')();
context.push = function () {
  if (!this.res.isSpdy) return;

  // we do all this nonsense type checking to make it closer
  // to node-spdy's API
  var path;
  var options;
  var priority;
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    switch (typeof arg) {
    case 'string':
      path = arg;
      break
    case 'object':
      options = arg;
      break
    case 'number':
      priority = arg;
      break
    }
  }
  if (path) options.path = path;
  if (priority) options.priority = priority;
  return push(this, options);
}

delegate(context, 'response')
  .method('writeContinue')
  .method('cc')
  .method('cacheControl')
