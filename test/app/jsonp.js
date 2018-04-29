
describe('jsonp', () => {
  it('should return jsonp response', (done) => {
    const app = new Koala({
      jsonp: {
        callback: '_callback'
      }
    })
    app.use(async (ctx, next) =>{
      ctx.jsonp = {foo: 'bar'}
    })

    request(app.listen())
    .get('/user.json?_callback=fn')
    .expect(200)
    .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});', done)
  })

  it('should return json response', (done) => {
    const app = new Koala({
      jsonp: {
        callback: '_callback'
      }
    })
    app.use(async (ctx, next) => {
      ctx.jsonp = {foo: 'bar'}
    })

    request(app.listen())
    .get('/user.json')
    .expect(200)
    .expect({"foo":"bar"}, done)
  })
})
