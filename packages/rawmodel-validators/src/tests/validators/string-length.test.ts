import { Spec } from '@hayspec/spec';
import { stringLengthValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(stringLengthValidator()(true));
});

spec.test('fails when too short', (ctx) => {
  ctx.false(stringLengthValidator({ min: 10 })('hello'));
});

spec.test('fails when too long', (ctx) => {
  ctx.false(stringLengthValidator({ max: 2 })('hello'));
});

spec.test('passes without options', (ctx) => {
  ctx.true(stringLengthValidator()('hello'));
});

spec.test('supports bytes length', (ctx) => {
  ctx.false(stringLengthValidator({ bytes: true, max: 3 })('ašč'));
  ctx.true(stringLengthValidator({ bytes: true, max: 6 })('ašč'));
  ctx.true(stringLengthValidator({ minOrEqual: 3 })('ašč'));
  ctx.true(stringLengthValidator({ maxOrEqual: 3 })('ašč'));
});

export default spec;
