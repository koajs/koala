
describe('Conditional-Get', function () {
  describe('when a body is set', function () {
    var etag

    var app = koala()
    app.use(function* (next) {
      this.body = 'hello'
    })

    var server = app.listen()

    it('should set an etag', function (done) {
      request(server)
      .get('/')
      .expect(200, function (err, res) {
        if (err) return done(err)

        etag = res.headers.etag.slice(1, -1)
        done()
      })
    })

    it('should response 304 w/ if-none-match header', function (done) {
      request(server)
      .get('/')
      .set('If-None-Match', '"' + etag + '"')
      .expect(304, done);
    })
  })
})
