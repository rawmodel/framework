const test = require('ava');
const objectschema = require('../dist');

test('exposed content', (t) => {
  t.is(!!objectschema.Schema, true);
  t.is(!!objectschema.Document, true);
});
