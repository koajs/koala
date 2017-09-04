
describe('Basic Auth', function () {
  it('should return the value', function (done) {
    var app = koala()
    app.use(async (next) => {
      this.body = this.request.basicAuth
    })

    request(app.listen())
    .get('/')
    .auth('username', 'password')
    .expect(200)
    .expect({
      name: 'username',
      pass: 'password',
    }, done)
  })
})
