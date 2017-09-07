const koala = require('../../lib');
const request = require('supertest');

describe('Middlewares', () => {
  describe('Session', () => {
    it('should has this.session by default', done => {
      const app = koala();

      app.use(function * () {
        this.body = this.session;
      });

      request(app.listen())
        .get('/')
        .expect('{}')
        .end(done);
    });
    it('should has no this.session by options.session = false', done => {
      const app = koala({
        session: false
      });

      app.use(function * () {
        this.body = this.session === undefined;
      });

      request(app.listen())
        .get('/')
        .expect('true')
        .end(done);
    });
  });
});
