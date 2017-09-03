
describe.skip('Polyfills', function () {
  describe('GET /polyfill.js', function () {
    it('should return the polyfill', function (done) {
      var app = koala()
      request(app.listen())
      .get('/polyfill.js')
      .expect(200)
      .expect('Content-Type', /application\/javascript/)
      .end(done)
    })
  })
})
