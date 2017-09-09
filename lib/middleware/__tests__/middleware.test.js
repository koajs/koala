const koala = require('../..');
const request = require('supertest');

describe('Middlewares', () => {
  describe('Session', () => {
    test('should has this.session by default', () => {
      const app = koala();

      app.use(function * () {
        this.body = this.session;
      });

      return request(app.listen())
        .get('/')
        .expect('{}');
    });
    test('should has no this.session by options.session = false', () => {
      const app = koala({
        session: false
      });

      app.use(function * () {
        this.body = this.session === undefined;
      });

      return request(app.listen())
        .get('/')
        .expect('true');
    });
  });
});
