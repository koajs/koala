const koala = require('../..');
const request = require('supertest');

describe('Conditional-Get', () => {
  describe('when a body is set', () => {
    let etag;

    const app = koala();
    app.use(function * (next) {
      this.body = 'hello';
    });

    const server = app.listen().close();

    test('should set an etag', () => {
      return request(server)
        .get('/')
        .expect(200)
        .expect(res => {
          etag = res.headers.etag.slice(1, -1);
        });
    });

    test('should response 304 w/ if-none-match header', () => {
      return request(server)
        .get('/')
        .set('If-None-Match', '"' + etag + '"')
        .expect(304);
    });
  });
});
