const koala = require('../lib');
const request = require('supertest');
const PassThrough = require('stream').PassThrough;

describe('Object Streams', () => {
  test('should be supported', done => {
    const app = koala();
    app.use(function * (next) {
      const body = this.body = new PassThrough({
        objectMode: true
      });

      body.write({
        message: 'a'
      });

      body.write({
        message: 'b'
      });

      body.end();
    });

    request(app.listen())
      .get('/')
      .expect(200)
      .expect([{
        message: 'a'
      }, {
        message: 'b'
      }], done);
  });
});
