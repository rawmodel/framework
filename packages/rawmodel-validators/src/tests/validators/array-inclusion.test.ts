import { Spec } from '@hayspec/spec';
import { arrayInclusionValidator } from '../..';

const spec = new Spec();

spec.test('fails when not included in the list', (ctx) => {
  ctx.false(arrayInclusionValidator({ values: [false] })(true));
});

spec.test('passes when value not present', (ctx) => {
  ctx.true(arrayInclusionValidator()(undefined));
  ctx.true(arrayInclusionValidator()(null));
});

spec.test('passes when included in the list', (ctx) => {
  ctx.true(arrayInclusionValidator({ values: [false, true] })(true));
});

export default spec;
