const koala = require('..');
const request = require('supertest');

describe('app', () => {
  test('listen()', () => {
    const app = koala();
    app.use(function * () {
      this.body = 'Hello World';
    });
    return request(app.listen().close())
      .get('/')
      .expect(200)
      .expect('Hello World');
  });
});
