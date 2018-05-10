const Koala = require('../lib');
const request = require('supertest');
const http = require('http');

describe('Body Parsing', () => {
  describe('.request.body', () => {
    it('should parse a json body', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .send({
          message: 'lol'
        })
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/, done);
    });

    it('should throw on non-objects in strict mode', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(400, done);
    });

    it('should not throw on non-objects in non-strict mode', done => {
      const opts = {
        __disableCsrf: true,
        jsonStrict: false
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .type('json')
        .send('"lol"')
        .expect(200)
        .expect('lol', done);
    });
  });

  describe('.request.urlencoded()', () => {
    it('should parse a urlencoded body', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect(/"message"/)
        .expect(/"lol"/, done);
    });

    it('should not support nested query strings by default', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .type('form')
        .send({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect(/"something":\s{\n\s*"nested"/, done);
    });

    it('should support nested query strings with options.qs=true', done => {
      const opts = {
        __disableCsrf: true,
        qs: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = ctx.request.body;
      });

      request(app.listen())
        .post('/')
        .type('form')
        .send({
          something: {
            nested: true
          }
        })
        .expect(200)
        .expect({
          something: {
            nested: 'true'
          }
        }, done);
    });
  });

  describe('.request.text()', () => {
    it('should get the raw text body', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.rawBody;
        expect(typeof ctx.body).toBe('string');
      });

      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    it.skip('should throw if the body is too large', done => {
      const opts = {
        __disableCsrf: true,
        textLimit: '1kb',
        jsonLimit: '1kb',
        formLimit: '1kb'
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        await ctx.request.body;
        ctx.body = 204;
      });

      request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048, 'abc', 'utf-8'))
        .expect(413, done);
    });
  });

  describe('.request.buffer()', () => {
    it('should get the raw buffer body', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = await ctx.request.rawBody;
        expect(typeof ctx.body === 'string').toBeTruthy();
      });

      request(app.listen())
        .post('/')
        .send('message=lol')
        .expect(200)
        .expect('message=lol', done);
    });

    it.skip('should throw if the body is too large', done => {
      const opts = {
        __disableCsrf: true,
        textLimit: '1kb',
        jsonLimit: '1kb',
        formLimit: '1kb'
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        await ctx.request.rawBody;
        ctx.body = 204;
      });

      request(app.listen())
        .post('/')
        .send(Buffer.alloc(2048))
        .expect(413, done);
    });
  });

  describe('.request.parts()', () => {

  });

  describe('Expect: 100-continue', () => {
    it('should send 100-continue', done => {
      const opts = {
        __disableCsrf: true
      };
      const app = new Koala(opts);
      app.use(async ctx => {
        ctx.body = ctx.request.body;
      });
      app.listen(function listen() {
        http.request({
          port: this.address().port,
          path: '/',
          headers: {
            'expect': '100-continue',
            'content-type': 'application/json'
          }
        })
          .once('continue', () => {
            this.end(JSON.stringify({
              message: 'lol'
            }));
          })
          .once('response', res => {
            done();
          })
          .once('error', done);
      });
    });
  });
});
