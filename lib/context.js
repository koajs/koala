
let delegate = require('delegates');

let context = exports;

delegate(context, 'response')
  .method('writeContinue')
  .method('cc')
  .method('cacheControl');
