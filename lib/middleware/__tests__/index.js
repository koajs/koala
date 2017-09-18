const koala = require('../..');
const request = require('supertest');
const PassThrough = require('stream').PassThrough;

describe('Middlewares', () => {
  describe('Response Time', () => {
    test('should get X-Response-Time correctly by default', () => {
      const app = koala();

      return request(app.callback())
        .get('/')
        .expect(404)
        .expect('X-Response-Time', /s$/);
    });
    test(
      'should not get X-Response-Time by options.responseTime = false',
      () => {
        const app = koala({
          responseTime: false
        });

        return request(app.callback())
          .get('/')
          .expect(404)
          .expect(res => {
            expect(res.headers['X-Response-Time']).toBe(undefined);
          });
      }
    );
  });

  describe('Object Streams', () => {
    test('should be supported', () => {
      const app = koala();
      app.use(function * (next) {
        const body = this.body = new PassThrough({
          objectMode: true
        });

        body.write({
          message: 'a'
        });

        body.write({
          message: 'b'
        });

        body.end();
      });

      return request(app.callback())
        .get('/')
        .expect(200)
        .expect([{
          message: 'a'
        }, {
          message: 'b'
        }]);
    });
  });

  describe('Session', () => {
    test('should has this.session by default', () => {
      const app = koala();

      app.use(function * () {
        this.body = this.session;
      });

      return request(app.callback())
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

      return request(app.callback())
        .get('/')
        .expect('true');
    });
  });
});
