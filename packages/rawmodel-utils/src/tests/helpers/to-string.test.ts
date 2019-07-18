import { Spec } from '@hayspec/spec';
import { toString } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(toString(), undefined);
  ctx.is(toString(undefined), undefined);
  ctx.is(toString(null), null);
  ctx.is(toString(''), '');
  ctx.is(toString('foo'), 'foo');
  ctx.is(toString(NaN), null);
  ctx.is(toString(Infinity), null);
  ctx.is(toString(true), 'true');
  ctx.is(toString(100.1), '100.1');
  ctx.is(toString({ a: 1 }), '{"a":1}');
  ctx.is(toString([1, 2]), '[1,2]');
});

export default spec;
