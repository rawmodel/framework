import { Spec } from '@hayspec/spec';
import { toNumber } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.is(toNumber(), undefined);
  ctx.is(toNumber(undefined), undefined);
  ctx.is(toNumber(null), null);
  ctx.is(toNumber(false), 0);
  ctx.is(toNumber(NaN), 0);
  ctx.is(toNumber(0), 0);
  ctx.is(toNumber(-100), -100);
  ctx.is(toNumber('-100'), -100);
  ctx.is(toNumber('-100.0'), -100);
  ctx.is(toNumber('-100.99'), -100.99);
  ctx.is(toNumber('false'), 0);
  ctx.is(toNumber(Infinity), 1);
  ctx.is(toNumber('true'), 1);
  ctx.is(toNumber('yes'), 1);
});

export default spec;
