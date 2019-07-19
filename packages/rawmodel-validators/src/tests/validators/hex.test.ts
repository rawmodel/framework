import { Spec } from '@hayspec/spec';
import { hexValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(hexValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(hexValidator()('abcdefg'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(hexValidator()(undefined));
  ctx.true(hexValidator()(null));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(hexValidator()('ff0044'));
});

export default spec;
