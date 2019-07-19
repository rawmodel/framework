import { Spec } from '@hayspec/spec';
import { downcaseStringValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(downcaseStringValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(downcaseStringValidator()('Hello'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(downcaseStringValidator()(undefined));
  ctx.true(downcaseStringValidator()(null));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(downcaseStringValidator()('hello'));
});

export default spec;
