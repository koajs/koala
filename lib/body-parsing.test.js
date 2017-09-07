const koala = require('.');
const request = require('supertest');

describe('Body Parsing', () => {
  describe('.request.json()', () => {
    test('should parse a json body', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      return request(app.listen())
        .post('/')
        .send({
          message: 'lol'
        })
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/);
    });

    test('should throw on non-objects in strict mode', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      return request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(400);
    });

    test('should not throw on non-objects in non-strict mode', () => {
      const app = koala();
      app.jsonStrict = false;
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      return request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(200)
        .expect('lol');
    });
  });

  describe('.request.urlencoded()', () => {
    test('should parse a urlencoded body', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
      return request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/);
    });

    test('should not support nested query strings by default', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
      return request(app.listen())
        .post('/')
        .type('form')
        .send({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect(/something\[nested\]/);
    });

    test('should support nested query strings with options.qs=true', () => {
      const app = koala({
        qs: true
      });
      app.use(function * () {
        this.body = yield * this.request.urlencoded();
      });
      return request(app.listen())
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
        });
    });
  });

  describe('.request.text()', () => {
    test('should get the raw text body', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.text();
        expect(typeof this.body).toBe('string');
      });
      return request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol');
    });

    test('should throw if the body is too large', () => {
      const app = koala();
      app.use(function * () {
        yield * this.request.text('1kb');
        this.body = 204;
      });
      return request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048))
        .expect(413);
    });
  });

  describe('.request.buffer()', () => {
    test('should get the raw buffer body', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.buffer();
        expect(Buffer.isBuffer(this.body)).toBeTruthy();
      });
      return request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol');
    });

    test('should throw if the body is too large', () => {
      const app = koala();
      app.use(function * () {
        yield * this.request.buffer('1kb');
        this.body = 204;
      });
      return request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048))
        .expect(413);
    });
  });

  describe('Expect: 100-continue', () => {
    test('should send 100-continue', () => {
      const app = koala();
      app.use(function * () {
        this.body = yield * this.request.json();
      });
      return request(app.listen())
        .get('/')
        .set('expect', '100-continue')
        .set('content-type', 'application/json')
        .send('message=lol');
    });
  });
});
