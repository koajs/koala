const koala = require('../../lib');
const request = require('supertest');

describe.skip('Polyfills', () => {
  describe('GET /polyfill.js', () => {
    it('should return the polyfill', done => {
      const app = koala();
      request(app.listen())
        .get('/polyfill.js')
        .expect(200)
        .expect('Content-Type', /application\/javascript/)
        .end(done);
    });
  });
});
