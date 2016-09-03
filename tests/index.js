const test = require('ava');
const opendocument = require('../dist');

test('exposed content', (t) => {
  t.is(!!opendocument.Schema, true);
  t.is(!!opendocument.Document, true);
});
