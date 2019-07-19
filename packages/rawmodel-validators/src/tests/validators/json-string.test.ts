import { Spec } from '@hayspec/spec';
import { jsonStringValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(jsonStringValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(jsonStringValidator()('{key: "value"}'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(jsonStringValidator()(undefined));
  ctx.true(jsonStringValidator()(null));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(jsonStringValidator()('{"key": "value"}'));
});

export default spec;
