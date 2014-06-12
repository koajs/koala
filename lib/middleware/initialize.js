
module.exports = function* koala_initialize(next) {
  // view locals because why not
  // probably won't document this until we get a rendering system
  this.locals = Object.create(null);
  
  yield* next;

  // why not
  if (this.request.fresh) this.response.status = 304;
}
