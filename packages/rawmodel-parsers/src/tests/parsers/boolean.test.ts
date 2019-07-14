import { Spec } from '@hayspec/spec';
import { booleanParser } from '../..';

const spec = new Spec();

spec.test('converts any value to a boolean value', (ctx) => {
  ctx.is(booleanParser()(undefined), undefined);
  ctx.is(booleanParser()(null), null);
  ctx.is(booleanParser()(false), false);
  ctx.is(booleanParser()(NaN), false);
  ctx.is(booleanParser()(0), false);
  ctx.is(booleanParser()(-100), false);
  ctx.is(booleanParser()('-'), false);
  ctx.is(booleanParser()('0'), false);
  ctx.is(booleanParser()('-10'), false);
  ctx.is(booleanParser()('false'), false);
  ctx.is(booleanParser()(true), true);
  ctx.is(booleanParser()(1), true);
  ctx.is(booleanParser()(100), true);
  ctx.is(booleanParser()(Infinity), true);
  ctx.is(booleanParser()('+'), true);
  ctx.is(booleanParser()('1'), true);
  ctx.is(booleanParser()('100'), true);
  ctx.is(booleanParser()('true'), true);
  ctx.is(booleanParser()('yes'), true);
});

export default spec;
