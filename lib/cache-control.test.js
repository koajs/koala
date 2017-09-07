const koala = require('.');
const request = require('supertest');

describe('Cache-Control', () => {
  describe('should be available as', () => {
    test('this.cc()', () => {
      const app = koala();
      app.use(function * (next) {
        this.cc(1000);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1');
    });

    test('this.cacheControl()', () => {
      const app = koala();
      app.use(function * (next) {
        this.cacheControl(1000);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1');
    });

    test('this.response.cc()', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cc(1000);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1');
    });
  });

  describe('when the value is a number', () => {
    test('should set "public, max-age="', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(1000000);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=1000');
    });
  });

  describe('when the value is a time string', () => {
    test('should set "public, max-age="', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl('1 hour');
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'public, max-age=3600');
    });
  });

  describe('when the value is "false"', () => {
    test('should set "private, no-cache"', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(false);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'private, no-cache');
    });
  });

  describe('when the value is a string', () => {
    test('should just set it', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl('foo');
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(204)
        .expect('Cache-Control', 'foo');
    });
  });

  describe('when the value is anything else', () => {
    test('should throw', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.cacheControl(true);
        this.status = 204;
      });

      return request(app.listen())
        .get('/')
        .expect(500);
    });
  });
});
