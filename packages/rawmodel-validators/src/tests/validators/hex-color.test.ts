import { Spec } from '@hayspec/spec';
import { hexColorValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(hexColorValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(hexColorValidator()('#ff'));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(hexColorValidator()('#ff0034'));
});

export default spec;
