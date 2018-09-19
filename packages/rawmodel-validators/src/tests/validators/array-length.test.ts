import { Spec } from '@hayspec/spec';
import { arrayLengthValidator } from '../..';

const spec = new Spec();

spec.test('fails when not an array', (ctx) => {
  ctx.false(arrayLengthValidator()(true));
});

spec.test('fails when too small', (ctx) => {
  ctx.false(arrayLengthValidator({ min: 3 })([1, 2]));
});

spec.test('fails when too large', (ctx) => {
  ctx.false(arrayLengthValidator({ max: 2 })([1, 2, 3]));
});

spec.test('passes without options', (ctx) => {
  ctx.true(arrayLengthValidator()([1, 2, 3]));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(arrayLengthValidator({ min: 2, max: 4 })([1, 2, 3]));
  ctx.true(arrayLengthValidator({ minOrEqual: 2 })([1, 2]));
  ctx.true(arrayLengthValidator({ maxOrEqual: 2 })([1, 2]));
});

export default spec;
