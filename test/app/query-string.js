const koala = require('../../lib');
const request = require('supertest');

describe('Nested Query Strings', () => {
  describe('when options.qs = false', () => {
    it('should not support nested query strings', done => {
      let app = koala();
      app.use(function * (next) {
        this.response.body = this.request.query;
      });

      request(app.listen())
        .get('/')
        .query({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect({
          'something[nested]': 'true'
        }, done);
    });
  });

  describe('when options.qs = true', () => {
    it('should support nested query strings', done => {
      let app = koala({
        qs: true
      });
      app.use(function * (next) {
        this.response.body = this.request.query;
      });

      request(app.listen())
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
        }, done);
    });
  });
});
