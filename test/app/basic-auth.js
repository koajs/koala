const koala = require('../../lib');
const request = require('supertest');

describe('Basic Auth', () => {
  it('should return the value', done => {
    let app = koala();
    app.use(function * (next) {
      this.body = this.request.basicAuth;
    });

    request(app.listen())
      .get('/')
      .auth('username', 'password')
      .expect(200)
      .expect({
        name: 'username',
        pass: 'password'
      }, done);
  });
});
