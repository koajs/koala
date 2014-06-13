
describe('Body Parsing', function () {
  describe('.request.json()', function () {
    it('should parse a json body', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.json()
      })
      request(app.listen())
      .post('/')
      .send({
        message: 'lol'
      })
      .expect(200)
      .expect(/"message"/)
      .expect(/"lol"/, done)
    })

    it('should throw on non-objects in strict mode', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.json()
      })
      request(app.listen())
      .post('/')
      .type('json')
      .send('"lol"')
      .expect(400, done)
    })

    it('should not throw on non-objects in non-strict mode', function (done) {
      var app = koala()
      app.jsonStrict = false
      app.use(function* () {
        this.body = yield* this.request.json()
      })
      request(app.listen())
      .post('/')
      .type('json')
      .send('"lol"')
      .expect(200)
      .expect('lol', done)
    })
  })

  describe('.request.urlencoded()', function () {
    it('should parse a urlencoded body', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.urlencoded()
      })
      request(app.listen())
      .post('/')
      .send("message=lol")
      .expect(200)
      .expect(/"message"/)
      .expect(/"lol"/, done)
    })

    it('should not support nested query strings by default', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.urlencoded()
      })
      request(app.listen())
      .post('/')
      .type('form')
      .send({
        something: {
          nested: true
        }
      })
      .expect(200)
      .expect(/something\[nested\]/, done)
    })

    it('should support nested query strings with options.qs=true', function (done) {
      var app = koala({
        qs: true
      })
      app.use(function* () {
        this.body = yield* this.request.urlencoded()
      })
      request(app.listen())
      .post('/')
      .type('form')
      .send({
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

  describe('.request.text()', function () {
    it('should get the raw text body', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.text()
        assert.equal('string', typeof this.body)
      })
      request(app.listen())
      .post('/')
      .send("message=lol")
      .expect(200)
      .expect('message=lol', done)
    })

    it('should throw if the body is too large', function (done) {
      var app = koala();
      app.use(function* () {
        yield* this.request.text('1kb')
        this.body = 204
      })
      request(app.listen())
      .post('/')
      .send(new Buffer(2048))
      .expect(413, done)
    })
  })

  describe('.request.buffer()', function () {
    it('should get the raw buffer body', function (done) {
      var app = koala()
      app.use(function* () {
        this.body = yield* this.request.buffer()
        assert(Buffer.isBuffer(this.body))
      })
      request(app.listen())
      .post('/')
      .send("message=lol")
      .expect(200)
      .expect('message=lol', done)
    })

    it('should throw if the body is too large', function (done) {
      var app = koala();
      app.use(function* () {
        yield* this.request.buffer('1kb')
        this.body = 204
      })
      request(app.listen())
      .post('/')
      .send(new Buffer(2048))
      .expect(413, done)
    })
  })

  describe('.request.parts()', function () {

  })

  describe('Expect: 100-continue', function () {
    it('should send 100-continue', function (done) {
      var app = koala();
      app.use(function* () {
        this.body = yield* this.request.json()
      })
      app.listen(function () {
        http.request({
          port: this.address().port,
          path: '/',
          headers: {
            'expect': '100-continue',
            'content-type': 'application/json'
          }
        })
        .once('continue', function () {
          this.end(JSON.stringify({
            message: 'lol'
          }))
        })
        .once('response', function (res) {
          done()
        })
        .once('error', done)
      })
    })
  })
})
