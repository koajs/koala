
describe('Middlewares', function () {
  describe('Session', function() {
    it('should has this.session by default', function(done) {
      var app = koala()

      app.use(function *() {
        this.body = this.session;
      })

      request(app.listen())
      .get('/')
      .expect('{}')
      .end(done)
    })
    it('should has no this.session by options.session = false', function(done) {
      var app = koala({
        session: false
      })

      app.use(function *() {
        this.body = this.session === undefined
      })

      request(app.listen())
      .get('/')
      .expect('true')
      .end(done)
    })
  })
})
