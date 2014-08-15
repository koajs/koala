
describe('Set headers', function () {
  describe('X-Response-Time', function() {
    it('should get X-Response-Time correctly by default', function(done) {
      var app = koala()

      request(app.listen())
      .get('/')
      .expect('X-Response-Time', /s$/)
      .end(done)
    })
    it('should not get X-Response-Time by options.responseTime = false', function(done) {
      var app = koala({
        responseTime: false
      })

      request(app.listen())
      .get('/')
      .end(function(err, res) {
        assert.equal(res.headers['X-Response-Time'], undefined)
        done(err)
      })
    })
  })
})
