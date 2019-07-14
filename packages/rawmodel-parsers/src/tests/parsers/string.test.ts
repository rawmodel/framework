import { Spec } from '@hayspec/spec';
import { stringParser } from '../..';

const spec = new Spec();

spec.test('converts any value to a string', (ctx) => {
  ctx.is(stringParser()('foo'), 'foo');
  ctx.is(stringParser()(100), '100');
  ctx.is(stringParser()(false), 'false');
  ctx.is(stringParser()({ a: 1 }), '{"a":1}');
  ctx.is(stringParser()([{ a: 1 }]), '[{"a":1}]');
  ctx.is(stringParser()(NaN), null);
  ctx.is(stringParser()(Infinity), null);
  ctx.is(stringParser()(null), null);
  ctx.is(stringParser()(undefined), undefined);
});

export default spec;
