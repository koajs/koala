
var delegate = require('delegates');

var context = exports;

delegate(context, 'response')
  .method('writeContinue')
  .method('cc')
  .method('cacheControl')
