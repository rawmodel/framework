import { Spec } from '@hayspec/spec';
import { integerParser } from '../..';

const spec = new Spec();

spec.test('converts any value to an integer number', (ctx) => {
  ctx.is(integerParser()(''), 0);
  ctx.is(integerParser()('foo'), 0);
  ctx.is(integerParser()('100'), 100);
  ctx.is(integerParser()('100.3'), 100);
  ctx.is(integerParser()(200), 200);
  ctx.is(integerParser()(200.13), 200);
  ctx.is(integerParser()(true), 1);
  ctx.is(integerParser()(false), 0);
  ctx.is(integerParser()(null), null);
  ctx.is(integerParser()(undefined), undefined);
});

export default spec;
