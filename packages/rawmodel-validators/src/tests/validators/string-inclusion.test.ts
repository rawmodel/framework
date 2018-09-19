import { Spec } from '@hayspec/spec';
import { stringInclusionValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(stringInclusionValidator({ seed: 'true' })(true));
});

spec.test('fails when not containing the provided seed', (ctx) => {
  ctx.false(stringInclusionValidator({ seed: 'black' })('my fake2 description'));
});

spec.test('passes when containing the provided seed', (ctx) => {
  ctx.true(stringInclusionValidator({ seed: 'fake' })('my fake description'));
});

export default spec;
