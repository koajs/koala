const koala = require('../../lib');
const request = require('supertest');
const assert = require('assert');
const http = require('http');

describe('Body Parsing', () => {
  describe('.request.json()', () => {
    it('should parse a json body', done => {
      let app = koala();
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

    it('should throw on non-objects in strict mode', done => {
      let app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(400, done);
    });

    it('should not throw on non-objects in non-strict mode', done => {
      let app = koala();
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
    it('should parse a urlencoded body', done => {
      let app = koala();
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

    it('should not support nested query strings by default', done => {
      let app = koala();
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

    it('should support nested query strings with options.qs=true', done => {
      let app = koala({
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
    it('should get the raw text body', done => {
      let app = koala();
      app.use(function * () {
        this.body = yield * this.request.text();
        assert.equal('string', typeof this.body);
      });
      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    it('should throw if the body is too large', done => {
      let app = koala();
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
    it('should get the raw buffer body', done => {
      let app = koala();
      app.use(function * () {
        this.body = yield * this.request.buffer();
        assert(Buffer.isBuffer(this.body));
      });
      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    it('should throw if the body is too large', done => {
      let app = koala();
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

  describe('.request.parts()', () => {

  });

  describe('Expect: 100-continue', () => {
    it('should send 100-continue', done => {
      let app = koala();
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
