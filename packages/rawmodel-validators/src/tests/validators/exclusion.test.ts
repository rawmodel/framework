import { Spec } from '@hayspec/spec';
import { exclusionValidator } from '../..';

const spec = new Spec();

spec.test('passes when value not present', (ctx) => {
  ctx.true(exclusionValidator()(undefined));
  ctx.true(exclusionValidator()(null));
});

spec.test('passes when not included in the list', (ctx) => {
  ctx.false(exclusionValidator({ values: [false, true] })(true));
});

spec.test('fails when included in the list', (ctx) => {
  ctx.true(exclusionValidator({ values: [false] })(true));
});

export default spec;
