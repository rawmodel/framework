import { Spec } from '@hayspec/spec';
import { floatParser } from '../..';

const spec = new Spec();

spec.test('converts any value to a decimal number', (ctx) => {
  ctx.is(floatParser()(''), 0);
  ctx.is(floatParser()('foo'), 0);
  ctx.is(floatParser()('100'), 100);
  ctx.is(floatParser()('100.3'), 100.3);
  ctx.is(floatParser()(200), 200);
  ctx.is(floatParser()(200.13), 200.13);
  ctx.is(floatParser()(true), 1);
  ctx.is(floatParser()(false), 0);
  ctx.is(floatParser()(null), null);
  ctx.is(floatParser()(undefined), undefined);
});

export default spec;
