const Koala = require('../lib');
const request = require('supertest');

describe('Middlewares', () => {
  describe('Session', () => {
    it('should has this.session by default', done => {
      const app = new Koala();

      app.use(async ctx => {
        ctx.body = ctx.session;
      });

      request(app.listen())
        .get('/')
        .expect('{}')
        .end(done);
    });

    it('should has no this.session by options.session = false', done => {
      const app = new Koala({
        session: false
      });

      app.use(async ctx => {
        ctx.body = ctx.session === undefined;
      });

      request(app.listen())
        .get('/')
        .expect('true')
        .end(done);
    });
  });
});
