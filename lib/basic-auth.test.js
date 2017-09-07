const koala = require('.');
const request = require('supertest');

describe('Basic Auth', () => {
  test('should return the value', () => {
    const app = koala();
    app.use(function * (next) {
      this.body = this.request.basicAuth;
    });

    return request(app.listen())
      .get('/')
      .auth('username', 'password')
      .expect(200)
      .expect({
        name: 'username',
        pass: 'password'
      });
  });
});
