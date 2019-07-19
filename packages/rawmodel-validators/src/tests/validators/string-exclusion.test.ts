import { Spec } from '@hayspec/spec';
import { stringExclusionValidator } from '../..';

const spec = new Spec();

spec.test('fails when a string', (ctx) => {
  ctx.true(stringExclusionValidator({ seed: 'true' })(true));
});

spec.test('fails when containing the provided seed', (ctx) => {
  ctx.true(stringExclusionValidator({ seed: 'black' })('my fake2 description'));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(stringExclusionValidator()(undefined));
  ctx.true(stringExclusionValidator()(null));
});

spec.test('passes when not containing the provided seed', (ctx) => {
  ctx.false(stringExclusionValidator({ seed: 'fake' })('my fake description'));
});

export default spec;
