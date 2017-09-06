const koala = require('../../lib');
const request = require('supertest');

describe('Cache-Control', () => {
  describe('should be available as', () => {
    it('this.cc()', done => {
      let app = koala();
      app.use(function * (next) {
        this.cc(1000);
        this.status = 204;
      });

      expect(app, 'public, max-age=1', done);
    });

    it('this.cacheControl()', done => {
      let app = koala();
      app.use(function * (next) {
        this.cacheControl(1000);
        this.status = 204;
      });

      expect(app, 'public, max-age=1', done);
    });

    it('this.response.cc()', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cc(1000);
        this.status = 204;
      });

      expect(app, 'public, max-age=1', done);
    });

    it('this.cacheControl()', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cacheControl(1000);
        this.status = 204;
      });

      expect(app, 'public, max-age=1', done);
    });
  });

  describe('when the value is a number', () => {
    it('should set "public, max-age="', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cacheControl(1000000);
        this.status = 204;
      });

      expect(app, 'public, max-age=1000', done);
    });
  });

  describe('when the value is a time string', () => {
    it('should set "public, max-age="', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cacheControl('1 hour');
        this.status = 204;
      });

      expect(app, 'public, max-age=3600', done);
    });
  });

  describe('when the value is "false"', () => {
    it('should set "private, no-cache"', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cacheControl(false);
        this.status = 204;
      });

      expect(app, 'private, no-cache', done);
    });
  });

  describe('when the value is a string', () => {
    it('should juset set it', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.cacheControl('lol');
        this.status = 204;
      });

      expect(app, 'lol', done);
    });
  });

  describe('when the value is anything else', () => {
    it('should throw', done => {
      let app = koala();
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

function expect(app, cc, done) {
  request(app.listen())
    .get('/')
    .expect(204)
    .expect('Cache-Control', cc, done);
}
