const koala = require('..');
const request = require('supertest');

describe('Nested Query Strings', () => {
  describe('when options.qs = false', () => {
    test('should not support nested query strings', () => {
      const app = koala();
      app.use(function * (next) {
        this.response.body = this.request.query;
      });

      return request(app.listen())
        .get('/')
        .query({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect({
          'something[nested]': 'true'
        });
    });
  });

  describe('when options.qs = true', () => {
    test('should support nested query strings', () => {
      const app = koala({
        qs: true
      });
      app.use(function * (next) {
        this.response.body = this.request.query;
      });

      return request(app.listen())
        .get('/')
        .query({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect({
          something: {
            nested: 'true'
          }
        });
    });
  });
});
