import { Spec } from '@hayspec/spec';
import { parse } from '../../..';

const spec = new Spec();

spec.test('passes through', (ctx) => {
  ctx.is(parse(100, null), 100);
  ctx.is(parse('100', undefined), '100');
  ctx.deepEqual(parse([1]), [1]);
  ctx.deepEqual(parse({ a: 2 }), { a: 2 });
});

spec.test('converts to arrays', (ctx) => {
  ctx.deepEqual(parse(100, { array: true }), [100]);
});

spec.test('converts to custom type', (ctx) => {
  ctx.deepEqual(parse(100, { resolver(v) {
    return 'foo';
  } }), 'foo');
  ctx.deepEqual(parse(100, { array: true, resolver(v) {
    return 'foo';
  } }), ['foo']);
});

export default spec;
