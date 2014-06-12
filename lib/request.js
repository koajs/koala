
var get = require('raw-body');
var qs = require('querystring');
var busboy = require('co-busboy');
var basicAuth = require('basic-auth');

var request = exports;

request.checkContinue = function () {
  if (!this._checkedContinue && this.req.checkContinue) {
    this.res.writeContinue();
    this._checkedContinue = true;
  }
  return this;
}

request.json = function* (limit) {
  if (!this.is('json')) return;
  if (!this.length) return;
  var text = yield* this.text(limit);
  return this._parse_json(text);
}

request._parse_json = function (text) {
  text = text.trim();
  if (text[0] !== '{') this.ctx.throw(400, 'only json objects allowed');
  try {
    return JSON.parse(text);
  } catch (err) {
    this.ctx.throw(400, 'invalid json');
  }
}

request.urlencoded = function* (limit) {
  if (!this.is('urlencoded')) return;
  if (!this.length) return;
  var text = yield* this.text(limit);
  return this._parse_urlencoded(text);
}

request._parse_urlencoded = function (text) {
  var parse = (this.app.querystring || qs).parse;
  try {
    return parse(text);
  } catch (err) {
    this.ctx.throw(400, 'invalid urlencoded');
  }
}

request.text = function* (limit) {
  this.checkContinue();
  return yield get(this.req, {
    limit: limit || '100kb',
    length: this.length,
    encoding: 'utf8',
  })
}

request.buffer = function* (limit) {
  this.checkContinue();
  return yield get(this.req, {
    limit: limit || '1mb',
    length: this.length,
  })
}

request.parts = function (options) {
  this.checkContinue();
  return busboy(this, options)
}

Object.defineProperty(request, 'basicAuth', {
  get: function () {
    return basicAuth(this.req);
  }
})
