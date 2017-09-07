const koala = require('../lib');
const request = require('supertest');
const http = require('http');

describe('Body Parsing', () => {
  describe('.request.json()', () => {
    test('should parse a json body', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      request(app.listen())
        .post('/')
        .send({
          message: 'lol'
        })
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/, done);
    });

    test('should throw on non-objects in strict mode', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(400, done);
    });

    test('should not throw on non-objects in non-strict mode', done => {
      const app = koala();
      app.jsonStrict = false;
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(200)
        .expect('lol', done);
    });
  });

  describe('.request.urlencoded()', () => {
    test('should parse a urlencoded body', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/, done);
    });

    test('should not support nested query strings by default', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
      request(app.listen())
        .post('/')
        .type('form')
        .send({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect(/something\[nested\]/, done);
    });

    test('should support nested query strings with options.qs=true', done => {
      const app = koala({
        qs: true
      });
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
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
            nested: 'true'
          }
        }, done);
    });
  });

  describe('.request.text()', () => {
    test('should get the raw text body', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.text();
        expect(typeof this.body).toBe('string');
      });
      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    test('should throw if the body is too large', done => {
      const app = koala();
      app.use(function * () {
        yield * this.request.text('1kb');
        this.body = 204;
      });
      request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048))
        .expect(413, done);
    });
  });

  describe('.request.buffer()', () => {
    test('should get the raw buffer body', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.buffer();
        expect(Buffer.isBuffer(this.body)).toBeTruthy();
      });
      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    test('should throw if the body is too large', done => {
      const app = koala();
      app.use(function * () {
        yield * this.request.buffer('1kb');
        this.body = 204;
      });
      request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048))
        .expect(413, done);
    });
  });

  describe('Expect: 100-continue', () => {
    test('should send 100-continue', done => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      app.listen(function() {
        http.request({
          port: this.address().port,
          path: '/',
          headers: {
            'expect': '100-continue',
            'content-type': 'application/json'
          }
        })
          .once('continue', function() {
            this.end(JSON.stringify({
              message: 'lol'
            }));
          })
          .once('response', res => {
            done();
          })
          .once('error', done);
      });
    });
  });
});
