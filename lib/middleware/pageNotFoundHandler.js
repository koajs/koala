module.exports = async(ctx, next) => {
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
        ctx.throw(404)
    }
  } catch (err) {
    if (ctx.verbose) {
      console.error(err);
    }
    ctx.status = err.status || 500
    if (ctx.status === 404) {
      //Your 404.jade
      await ctx.render(`${__dirname}/404`)
    } else {
      //other_error jade
      await ctx.render('error', ctx)
    }
  }
}
