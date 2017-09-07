const koala = require('../lib');
const request = require('supertest');

describe('Cache-Control', () => {
  describe('should be available as', () => {
    test('this.cc()', done => {
      const app = koala();
      app.use(function * (next) {
        this.cc(1000);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1')
        .end(done);
    });

    test('this.cacheControl()', done => {
      const app = koala();
      app.use(function * (next) {
        this.cacheControl(1000);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1')
        .end(done);
    });

    test('this.response.cc()', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cc(1000);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1')
        .end(done);
    });
  });

  describe('when the value is a number', () => {
    test('should set "public, max-age="', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(1000000);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1000')
        .end(done);
    });
  });

  describe('when the value is a time string', () => {
    test('should set "public, max-age="', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl('1 hour');
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=3600')
        .end(done);
    });
  });

  describe('when the value is "false"', () => {
    test('should set "private, no-cache"', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(false);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'private, no-cache')
        .end(done);
    });
  });

  describe('when the value is a string', () => {
    test('should just set it', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl('foo');
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'foo')
        .end(done);
    });
  });

  describe('when the value is anything else', () => {
    test('should throw', done => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(true);
        this.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(500, done);
    });
  });
});
