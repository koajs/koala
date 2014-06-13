
describe('Nested Query Strings', function () {
  describe('when options.qs = false', function () {
    it('should not support nested query strings', function (done) {
      var app = koala()
      app.use(function* (next) {
        this.response.body = this.request.query
      })

      request(app.listen())
      .get('/')
      .query({
        something: {
          nested: true
        }
      })
      .expect(200)
      .expect({
        "something[nested]": "true"
      }, done)
    })
  })

  describe('when options.qs = true', function () {
    it('should support nested query strings', function (done) {
      var app = koala({
        qs: true
      })
      app.use(function* (next) {
        this.response.body = this.request.query
      })

      request(app.listen())
      .get('/')
      .query({
        something: {
          nested: true
        }
      })
      .expect(200)
      .expect({
        something: {
          nested: "true"
        }
      }, done)
    })
  })
})
