import { Spec } from '@hayspec/spec';
import { arrayExclusionValidator } from '../..';

const spec = new Spec();

spec.test('passes when value not present', (ctx) => {
  ctx.true(arrayExclusionValidator()(undefined));
  ctx.true(arrayExclusionValidator()(null));
});

spec.test('passes when not included in the list', (ctx) => {
  ctx.true(arrayExclusionValidator({ values: [1, 2, 3] })([2, 4]));
});

spec.test('fails when included in the list', (ctx) => {
  ctx.false(arrayExclusionValidator({ values: [1, 2, 3] })([1, 2]));
});

export default spec;
