import { Spec } from '@hayspec/spec';
import { absenceValidator } from '../..';

const spec = new Spec();

spec.test('passes when null', (ctx) => {
  ctx.true(absenceValidator()(null));
});

spec.test('passes when undefined', (ctx) => {
  ctx.true(absenceValidator()());
});

spec.test('passes when blank', (ctx) => {
  ctx.true(absenceValidator()(''));
  ctx.true(absenceValidator()([]));
});

spec.test('fails when not blank', (ctx) => {
  ctx.false(absenceValidator()('text'));
  ctx.false(absenceValidator()(['']));
  ctx.false(absenceValidator()(['text']));
});

export default spec;
