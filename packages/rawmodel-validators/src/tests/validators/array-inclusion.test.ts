import { Spec } from '@hayspec/spec';
import { arrayInclusionValidator } from '../..';

const spec = new Spec();

spec.test('passes when value not present', (ctx) => {
  ctx.true(arrayInclusionValidator()(undefined));
  ctx.true(arrayInclusionValidator()(null));
});

spec.test('passes when included in the list', (ctx) => {
  ctx.true(arrayInclusionValidator({ values: [1, 2, 3] })([1, 2]));
});

spec.test('fails when not included in the list', (ctx) => {
  ctx.false(arrayInclusionValidator({ values: [1, 2, 3] })([1, 4]));
});

export default spec;
