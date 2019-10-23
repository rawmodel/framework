import { Spec } from '@hayspec/spec';
import { inclusionValidator } from '../..';

const spec = new Spec();

spec.test('passes when value not present', (ctx) => {
  ctx.true(inclusionValidator()(undefined));
  ctx.true(inclusionValidator()(null));
});

spec.test('passes when included in the list', (ctx) => {
  ctx.true(inclusionValidator({ values: [false, true] })(true));
});

spec.test('fails when not included in the list', (ctx) => {
  ctx.false(inclusionValidator({ values: [false] })(true));
});

export default spec;
