const Koala = require('../lib');
const request = require('supertest');

describe('Basic Auth', () => {
  it('should return the value', done => {
    const app = new Koala();
    app.use(async(ctx, next) => {
      ctx.body = ctx.request.basicAuth;
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
