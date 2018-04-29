const randomBytes = require('mz/crypto').randomBytes;

const randomBytes = require('mz/crypto').randomBytes;

module.exports = async (ctx, next) => {
  ctx.id = await randomBytes(24);

  const req = ctx.req;
  const res = ctx.res;

  ctx.trace = function trace(event) {
      const args = []
      switch (arguments.length) {
      case 0:
        throw new Error('No event defined!')
      case 1: break
      case 2:
        args = [arguments[1]]
        break
      default:
        args = slice.call(arguments, 1)
      }

      dispatch(this, event, args)
      return this
    }

  // request start
  ctx.trace('time.start');
  // request end
  req.once('end', ctx.trace.bind(this, 'time.end'));
  // response headers
  const writeHead = res.writeHead;
  res.writeHead = function () {
    ctx.trace('time.headers');
    return writeHead.apply(this, arguments);
  };
  // response finish
  res.once('finish', ctx.trace.bind(this, 'time.finish'));

  await next();
}

// attach a listener
const listeners = []
function instrument(fn) {
  listeners.push(fn)
  return this
}

// dispatch an event to all listeners
function dispatch(context, event, args) {
  const date = new Date()
  for (let i = 0; i < listeners.length; i++)
    listeners[i](context, event, date, args)
}
