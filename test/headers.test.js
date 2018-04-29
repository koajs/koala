const Koala = require('../lib');
const request = require('supertest');

describe('Set headers', () => {
  describe('X-Response-Time', () => {
    it('should get X-Response-Time correctly by default', (done) => {
      const app = new Koala()

      request(app.listen())
      .get('/')
      .expect(404)
      .expect('X-Response-Time', /s$/)
      .end(done)
    })

    it('should not get X-Response-Time by options.responseTime = false', (done) => {
      const app = new Koala({
        responseTime: false
      })

      request(app.listen())
      .get('/')
      .expect(404)
      .end((err, res) => {
        expect(res.headers['X-Response-Time']).toBe(undefined);
        done(err)
      })
    })
  })

  describe('X-Frame-Options', function() {
    it('should get X-Frame-Options DENY by default', (done) =>{
      const app = new Koala()

      request(app.listen())
      .get('/')
      .expect(404)
      .expect('X-Frame-Options', 'DENY')
      .end(done)
    })
    it('should not get X-Frame-Options by xframe = false', (done) =>{
      const app = new Koala({
        security: {
          xframe: false
        }
      })

      request(app.listen())
      .get('/')
      .expect(404)
      .end((err, res) => {
        expect(res.headers['X-Response-Time']).toBe(undefined);
        done(err)
      })
    })
    it('should get X-Frame-Options DENY by xframe = true', (done) =>{
      const app = new Koala({
        security: {
          xframe: true
        }
      })

      request(app.listen())
      .get('/')
      .expect(404)
      .expect('X-Frame-Options', 'DENY')
      .end(done)
    })
    it('should get X-Frame-Options SAMEORIGIN by xframe = same', (done) =>{
      const app = new Koala({
        security: {
          xframe: 'same'
        }
      })

      request(app.listen())
      .get('/')
      .expect(404)
      .expect('X-Frame-Options', 'SAMEORIGIN')
      .end(done)
    })
  })
})
