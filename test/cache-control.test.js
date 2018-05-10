const Koala = require('../lib');
const request = require('supertest');

describe('Cache-Control', () => {
  describe('should be available as', () => {
    it('this.cc()', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.cc(1000);
        ctx.status = 204;
      });

      expectRequest(app, 'public, max-age=1', done);
    });

    it('this.cacheControl()', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.cacheControl(1000);
        ctx.status = 204;
      });

      expectRequest(app, 'public, max-age=1', done);
    });

    it('this.response.cc()', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cc(1000);
        ctx.status = 204;
      });

      expectRequest(app, 'public, max-age=1', done);
    });
  });

  describe('when the value is a number', () => {
    it('should set "public, max-age="', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cacheControl(1000000);
        ctx.status = 204;
      });

      expectRequest(app, 'public, max-age=1000', done);
    });
  });

  describe('when the value is a time string', () => {
    it('should set "public, max-age="', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cacheControl('1 hour');
        ctx.status = 204;
      });

      expectRequest(app, 'public, max-age=3600', done);
    });
  });

  describe('when the value is "false"', () => {
    it('should set "private, no-cache"', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cacheControl(false);
        ctx.status = 204;
      });

      expectRequest(app, 'private, no-cache', done);
    });
  });

  describe('when the value is a string', () => {
    it('should juset set it', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cacheControl('lol');
        ctx.status = 204;
      });

      expectRequest(app, 'lol', done);
    });
  });

  describe('when the value is anything else', () => {
    it('should throw', done => {
      const app = new Koala();
      app.use(async(ctx, next) => {
        ctx.response.cacheControl(true);
        ctx.status = 204;
      });

      request(app.listen())
        .get('/')
        .expect(500, done);
    });
  });
});

function expectRequest(app, cc, done) {
  request(app.listen())
    .get('/')
    .expect(204)
    .expect('Cache-Control', cc, done);
}
