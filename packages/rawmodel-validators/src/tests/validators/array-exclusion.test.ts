import { Spec } from '@hayspec/spec';
import { arrayExclusionValidator } from '../..';

const spec = new Spec();

spec.test('fails when included in the list', (ctx) => {
  ctx.true(arrayExclusionValidator({ values: [false] })(true));
});

spec.test('passes when not included in the list', (ctx) => {
  ctx.false(arrayExclusionValidator({ values: [false, true] })(true));
});

export default spec;
