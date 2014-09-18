
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

  describe('X-Frame-Options', function() {
    it('should get X-Frame-Options DENY by default', function(done) {
      var app = koala()

      request(app.listen())
      .get('/')
      .expect('X-Frame-Options', 'DENY')
      .end(done)
    })
    it('should not get X-Frame-Options by xframe = false', function(done) {
      var app = koala({
        security: {
          xframe: false
        }
      })

      request(app.listen())
      .get('/')
      .end(function(err, res) {
        assert.equal(res.headers['X-Frame-Options'], undefined)
        done(err)
      })
    })
    it('should get X-Frame-Options DENY by xframe = true', function(done) {
      var app = koala({
        security: {
          xframe: true
        }
      })

      request(app.listen())
      .get('/')
      .expect('X-Frame-Options', 'DENY')
      .end(done)
    })
    it('should get X-Frame-Options SAMEORIGIN by xframe = same', function(done) {
      var app = koala({
        security: {
          xframe: 'same'
        }
      })

      request(app.listen())
      .get('/')
      .expect('X-Frame-Options', 'SAMEORIGIN')
      .end(done)
    })
  })
})
