
var PassThrough = require('stream').PassThrough

describe('Object Streams', function () {
  it('should be supported', function (done) {
    var app = koala()
    app.use(function* (next) {
      var body = this.body = new PassThrough({
        objectMode: true
      })

      body.write({
        message: 'a'
      })

      body.write({
        message: 'b'
      })

      body.end()
    })

    request(app.listen())
    .get('/')
    .expect(200)
    .expect([{
      message: 'a'
    }, {
      message: 'b'
    }], done)
  })
})
