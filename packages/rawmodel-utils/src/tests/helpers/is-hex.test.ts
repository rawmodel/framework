import { Spec } from '@hayspec/spec';
import { isHex } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.true(isHex('ff0044'));
  ctx.false(isHex(true));
  ctx.false(isHex('abcdefg'));
  ctx.false(isHex([]));
  ctx.false(isHex(null));
  ctx.false(isHex(undefined));
});

export default spec;
