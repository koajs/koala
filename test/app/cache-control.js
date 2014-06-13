
describe('Cache-Control', function () {
  describe('should be available as', function () {
    it('this.cc()', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.cc(1000)
        this.status = 204
      })

      expect(app, 'public, max-age=1', done)
    })

    it('this.cacheControl()', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.cacheControl(1000)
        this.status = 204
      })

      expect(app, 'public, max-age=1', done)
    })

    it('this.response.cc()', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cc(1000)
        this.status = 204
      })

      expect(app, 'public, max-age=1', done)
    })

    it('this.cacheControl()', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl(1000)
        this.status = 204
      })

      expect(app, 'public, max-age=1', done)
    })
  })

  describe('when the value is a number', function () {
    it('should set "public, max-age="', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl(1000000)
        this.status = 204
      })

      expect(app, 'public, max-age=1000', done)
    })
  })

  describe('when the value is a time string', function () {
    it('should set "public, max-age="', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl('1 hour')
        this.status = 204
      })

      expect(app, 'public, max-age=3600', done)
    })
  })

  describe('when the value is "false"', function () {
    it('should set "private, no-cache"', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl(false)
        this.status = 204
      })

      expect(app, 'private, no-cache', done)
    })
  })

  describe('when the value is a string', function () {
    it('should juset set it', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl('lol')
        this.status = 204
      })

      expect(app, 'lol', done)
    })
  })

  describe('when the value is anything else', function () {
    it('should throw', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.cacheControl(true)
        this.status = 204
      })

      request(app.listen())
      .get('/')
      .expect(500, done)
    })
  })
})

function expect(app, cc, done) {
  request(app.listen())
  .get('/')
  .expect(204)
  .expect('Cache-Control', cc, done)
}
