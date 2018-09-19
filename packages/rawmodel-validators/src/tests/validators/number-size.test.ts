import { Spec } from '@hayspec/spec';
import { numberSizeValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a number', (ctx) => {
  ctx.false(numberSizeValidator()(true));
});

spec.test('fails when too small', (ctx) => {
  ctx.false(numberSizeValidator({ min: 200 })(100));
});

spec.test('fails when too large', (ctx) => {
  ctx.false(numberSizeValidator({ max: 20 })(100));
});

spec.test('passes without options', (ctx) => {
  ctx.true(numberSizeValidator()(100));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(numberSizeValidator({ min: 10, max: 1000 })(100));
  ctx.true(numberSizeValidator({ minOrEqual: 100 })(100));
  ctx.true(numberSizeValidator({ maxOrEqual: 100 })(100));
});

export default spec;
