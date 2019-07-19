import { Spec } from '@hayspec/spec';
import { matchValidator } from '../..';

const spec = new Spec();

spec.test('fails with an invalid pattern', (ctx) => {
  ctx.false(matchValidator({ regexp: /me/i })('foo'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(matchValidator()(undefined));
  ctx.true(matchValidator()(null));
});

spec.test('passes with a valid pattern', (ctx) => {
  ctx.true(matchValidator({ regexp: /me/i })('me'));
});

export default spec;
