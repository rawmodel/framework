import test from 'ava';
import * as objectschema from '../dist';

test('exposed content', (t) => {
  t.is(!!objectschema.Document, true);
  t.is(!!objectschema.Field, true);
});
