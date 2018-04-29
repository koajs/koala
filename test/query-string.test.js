const Koala = require('../lib');
const request = require('supertest');

describe('Nested Query Strings', () => {
  describe('when options.qs = false', () => {
    it('should not support nested query strings', (done) => {
      const app = new Koala()
      app.use(async (ctx, next) => {
        ctx.response.body = ctx.request.query
      })

      request(app.listen())
      .get('/')
      .query({
        something: {
          nested: true
        }
      })
      .expect(200)
      .expect({
        "something[nested]": "true"
      }, done)
    })
  })

  describe('when options.qs = true', () => {
    it('should support nested query strings', (done) => {
      const app = new Koala({
        qs: true
      })
      app.use(async (ctx, next) => {
        ctx.response.body = ctx.request.query
      })

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
          nested: "true"
        }
      }, done)
    })
  })
})
