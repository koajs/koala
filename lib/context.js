const delegate = require('delegates');

const context = exports;

delegate(context, 'response')
  .method('writeContinue')
  .method('cc')
  .method('cacheControl');
