const koala = require('..');
const request = require('supertest');

describe('jsonp', () => {
  test('should return jsonp response', () => {
    const app = koala({
      jsonp: {
        callback: '_callback'
      }
    });
    app.use(function * (next) {
      this.jsonp = {foo: 'bar'};
    });

    return request(app.callback())
      .get('/user.json?_callback=fn')
      .expect(200)
      .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});');
  });

  test('should return json response', () => {
    const app = koala({
      jsonp: {
        callback: '_callback'
      }
    });
    app.use(function * (next) {
      this.jsonp = {foo: 'bar'};
    });

    return request(app.callback())
      .get('/user.json')
      .expect(200)
      .expect({'foo': 'bar'});
  });
});
