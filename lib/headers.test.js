const koala = require('.');
const request = require('supertest');

describe('Set headers', () => {
  describe('X-Response-Time', () => {
    test('should get X-Response-Time correctly by default', () => {
      const app = koala();

      return request(app.listen())
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

        return request(app.listen())
          .get('/')
          .expect(404)
          .expect(res => {
            expect(res.headers['X-Response-Time']).toBe(undefined);
          });
      }
    );
  });

  describe('Strict-Transport-Security', () => {
    test('should not set Strict-Transport-Security by default', () => {
      const app = koala();

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect(res => {
          expect(res.headers['Strict-Transport-Security']).toBe(undefined);
        });
    });
    test('should set Strict-Transport-Security if `hsts` is a number', () => {
      const app = koala({
        security: {
          hsts: 1000
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1');
    });
    test('should set Strict-Transport-Security if `hsts.maxAge` is present', () => {
      const app = koala({
        security: {
          hsts: {
            maxAge: 1000
          }
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1');
    });
    test('should set Strict-Transport-Security with `includeSubDomains`', () => {
      const app = koala({
        security: {
          hsts: 1000,
          includeSubDomains: true
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('Strict-Transport-Security', 'max-age=1; includeSubDomains');
    });
  });

  describe('X-Frame-Options', () => {
    test('should get X-Frame-Options DENY by default', () => {
      const app = koala();

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'DENY');
    });
    test('should not get X-Frame-Options by xframe = false', () => {
      const app = koala({
        security: {
          xframe: false
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect(res => {
          expect(res.headers['X-Frame-Options']).toBe(undefined);
        });
    });
    test('should get X-Frame-Options DENY by xframe = true', () => {
      const app = koala({
        security: {
          xframe: true
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'DENY');
    });
    test('should get X-Frame-Options SAMEORIGIN by xframe = same', () => {
      const app = koala({
        security: {
          xframe: 'same'
        }
      });

      return request(app.listen())
        .get('/')
        .expect(404)
        .expect('X-Frame-Options', 'SAMEORIGIN');
    });
  });
});
