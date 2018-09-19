import { Spec } from '@hayspec/spec';
import { dateValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(dateValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(dateValidator()('x'));
});

spec.test('fails when invalid iso8601', (ctx) => {
  ctx.false(dateValidator({ iso: true })('12.12.2016'));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(dateValidator()('2009'));
});

spec.test('passes when valid iso8601', (ctx) => {
  ctx.true(dateValidator({ iso: true })('2009-12T12:34'));
});

export default spec;
