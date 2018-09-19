import { Spec } from '@hayspec/spec';
import { presenceValidator } from '../..';

const spec = new Spec();

spec.test('fails when null', (ctx) => {
  ctx.false(presenceValidator()(null));
});

spec.test('fails when undefined', (ctx) => {
  ctx.false(presenceValidator()());
});

spec.test('fails when blank', (ctx) => {
  ctx.false(presenceValidator()(''));
});

spec.test('passes when present', (ctx) => {
  ctx.true(presenceValidator()('john'));
});

export default spec;
