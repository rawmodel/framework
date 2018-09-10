import test from 'ava';
import * as objectschema from '../src';

test('exposed content', (t) => {
  t.is(!!objectschema.Model, true);
  t.is(!!objectschema.Prop, true);
});
