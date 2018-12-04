import { Spec } from '@hayspec/spec';
import { toArray } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.deepEqual(toArray(), undefined);
  ctx.deepEqual(toArray(undefined), undefined);
  ctx.deepEqual(toArray(null), null);
  ctx.is(toArray(NaN)[0], NaN);
  ctx.deepEqual(toArray(Infinity), [Infinity]);
  ctx.deepEqual(toArray([]), []);
  ctx.deepEqual(toArray({}), [{}]);
  ctx.deepEqual(toArray(''), ['']);
  ctx.deepEqual(toArray(0), [0]);
  ctx.deepEqual(toArray('john'), ['john']);
});

export default spec;
