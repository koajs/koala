const koala = require('../lib');
const request = require('supertest');

describe('Set headers', () => {
  describe('X-Response-Time', () => {
    test('should get X-Response-Time correctly by default', done => {
      const app = koala();

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Response-Time', /s$/)
        .end(done);
    });
    test(
      'should not get X-Response-Time by options.responseTime = false',
      done => {
        const app = koala({
          responseTime: false
        });

        request(app.listen())
          .get('/')
          .expect(404)
          .end((err, res) => {
            expect(res.headers['X-Response-Time']).toBe(undefined);
            done(err);
          });
      }
    );
  });

  describe('Strict-Transport-Security', () => {
    test('should not set Strict-Transport-Security by default', done => {
      const app = koala();

      request(app.listen())
        .get('/')
        .expect(404)
        .end((err, res) => {
          expect(res.headers['Strict-Transport-Security']).toBe(undefined);
          done(err);
        });
    });
    test('should set Strict-Transport-Security if `hsts` is a number', done => {
      const app = koala({
        security: {
          hsts: 1000
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1')
        .end(done);
    });
    test('should set Strict-Transport-Security if `hsts.maxAge` is present', done => {
      const app = koala({
        security: {
          hsts: {
            maxAge: 1000
          }
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1')
        .end(done);
    });
    test('should set Strict-Transport-Security with `includeSubDomains`', done => {
      const app = koala({
        security: {
          hsts: 1000,
          includeSubDomains: true
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1; includeSubDomains')
        .end(done);
    });
  });

  describe('X-Frame-Options', () => {
    test('should get X-Frame-Options DENY by default', done => {
      const app = koala();

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'DENY')
        .end(done);
    });
    test('should not get X-Frame-Options by xframe = false', done => {
      const app = koala({
        security: {
          xframe: false
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .end((err, res) => {
          expect(res.headers['X-Frame-Options']).toBe(undefined);
          done(err);
        });
    });
    test('should get X-Frame-Options DENY by xframe = true', done => {
      const app = koala({
        security: {
          xframe: true
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'DENY')
        .end(done);
    });
    test('should get X-Frame-Options SAMEORIGIN by xframe = same', done => {
      const app = koala({
        security: {
          xframe: 'same'
        }
      });

      request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'SAMEORIGIN')
        .end(done);
    });
  });
});
