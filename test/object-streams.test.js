const Koala = require('../lib');
const request = require('supertest');
const PassThrough = require('stream').PassThrough;

describe('Object Streams', () => {
  it('should be supported', (done) => {
    const app = new Koala()
    app.use(async (ctx, next) => {
      const body = ctx.body = new PassThrough({
        objectMode: true
      })

      body.write({
        message: 'a'
      })

      body.write({
        message: 'b'
      })

      body.end()
    })

    request(app.listen())
    .get('/')
    .expect(200)
    .expect([{
      message: 'a'
    }, {
      message: 'b'
    }], done)
  })
})
