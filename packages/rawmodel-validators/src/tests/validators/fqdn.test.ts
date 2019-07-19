import { Spec } from '@hayspec/spec';
import { fqdnValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(fqdnValidator()(true));
});

spec.test('fails without top-level domain name', (ctx) => {
  ctx.false(fqdnValidator()('domain'));
});

spec.test('fails when including underscore', (ctx) => {
  ctx.false(fqdnValidator()('do_main.com'));
});

spec.test('fails when including trailing dot', (ctx) => {
  ctx.false(fqdnValidator()('domain.com.'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(fqdnValidator()(undefined));
  ctx.true(fqdnValidator()(null));
});

spec.test('passes with top-level domain name', (ctx) => {
  ctx.true(fqdnValidator()('domain.com'));
});

spec.test('passes when including underscore where allowUnderscores is true', (ctx) => {
  ctx.true(fqdnValidator({ allowUnderscores: true })('do_main.com'));
});

spec.test('passes when including trailing dot where allowTrailingDot is true', (ctx) => {
  ctx.true(fqdnValidator({ allowTrailingDot: true })('domain.com.'));
});

export default spec;
