const koala = require('../../lib');
const request = require('supertest');
let PassThrough = require('stream').PassThrough;

describe('Object Streams', () => {
  it('should be supported', done => {
    let app = koala();
    app.use(function * (next) {
      let body = this.body = new PassThrough({
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
