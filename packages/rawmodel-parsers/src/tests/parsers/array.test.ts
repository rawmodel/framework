import { Spec } from '@hayspec/spec';
import { arrayParser } from '../..';

const spec = new Spec();

spec.test('converts any value to an array', (ctx) => {
  ctx.deepEqual(arrayParser()([]), []);
  ctx.deepEqual(arrayParser()([1, 2]), [1, 2]);
  ctx.deepEqual(arrayParser()('foo'), ['foo']);
  ctx.deepEqual(arrayParser()(100), [100]);
  ctx.deepEqual(arrayParser()(true), [true]);
  ctx.deepEqual(arrayParser()(false), [false]);
  ctx.deepEqual(arrayParser()({}), [{}]);
  ctx.deepEqual(arrayParser()({ a: 1 }), [{ a: 1 }]);
  ctx.is(arrayParser()(null), null);
  ctx.is(arrayParser()(undefined), undefined);
});

export default spec;
