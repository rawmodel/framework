import { Spec } from '@hayspec/spec';
import { cast } from '../src';

const spec = new Spec();

spec.test('cast (Any type)', (ctx) => {
  ctx.is(cast(100, null, false), 100);
  ctx.is(cast('100', null, false), '100');
  ctx.deepEqual(cast(100, null, true), [100]);
  ctx.deepEqual(cast('100', null, true), ['100']);
  ctx.deepEqual(cast(['100', 200], null, true), ['100', 200]);
});

spec.test('cast (general type)', (ctx) => {
  ctx.is(cast(100, 'String', false), '100');
  ctx.is(cast('true', 'Boolean', false), true);
  ctx.is(cast('10.13', 'Integer', false), 10);
  ctx.is(cast('10.13', 'Float', false), 10.13);
  ctx.is(cast('10.13', 'Number', false), 10.13);
  ctx.deepEqual(cast(100000, 'Date', false), new Date(100000));
  ctx.deepEqual(cast('john', null, true), ['john']);
  ctx.deepEqual(cast(100, 'String', true), ['100']);
  ctx.deepEqual(cast([100], 'String', true), ['100']);
  ctx.deepEqual(cast('true', 'Boolean', true), [true]);
  ctx.deepEqual(cast(['true'], 'Boolean', true), [true]);
  ctx.deepEqual(cast('10.13', 'Integer', true), [10]);
  ctx.deepEqual(cast(['10.13'], 'Integer', true), [10]);
  ctx.deepEqual(cast('10.13', 'Float', true), [10.13]);
  ctx.deepEqual(cast(['10.13'], 'Float', true), [10.13]);
  ctx.deepEqual(cast('10.13', 'Number', true), [10.13]);
  ctx.deepEqual(cast(['10.13'], 'Number', true), [10.13]);
  ctx.deepEqual(cast(100000, 'Date', true), [new Date(100000)]);
  ctx.deepEqual(cast([100000], 'Date', true), [new Date(100000)]);
});

spec.test('cast (null type)', (ctx) => {
  ctx.deepEqual(cast(100, null, false), 100);
  ctx.deepEqual(cast(100, undefined, false), 100);
});

spec.test('cast (custom type)', (ctx) => {
  ctx.deepEqual(cast('foo', (v) => `${v}-bar`, false), 'foo-bar');
  ctx.deepEqual(cast('foo', (v) => `${v}-bar`, true), ['foo-bar']);
  ctx.deepEqual(cast(['foo0', 'foo1'], (v) => `${v}-bar`, true), ['foo0-bar', 'foo1-bar']);
});

export default spec;
