import { Spec } from '@hayspec/spec';
import { parse } from '../../..';
import { ParserKind } from '../../../core/types';

const spec = new Spec();

spec.test('passes through', (ctx) => {
  ctx.is(parse(100, null), 100);
  ctx.is(parse('100', undefined), '100');
  ctx.is(parse(100, { kind: 'foo' } as any), 100);
  ctx.is(parse(100, { kind: ParserKind.ANY }), 100);
  ctx.deepEqual(parse([1, '2'], { kind: ParserKind.ANY }), [1, '2']);
  ctx.deepEqual(parse({ a: 1 }, { kind: ParserKind.ANY }), { a: 1 });
});

spec.test('converts to string', (ctx) => {
  ctx.is(parse(100, { kind: ParserKind.STRING }), '100');
});

spec.test('converts to boolean', (ctx) => {
  ctx.true(parse(1, { kind: ParserKind.BOOLEAN }));
  ctx.false(parse(0, { kind: ParserKind.BOOLEAN }));
});

spec.test('converts to integer', (ctx) => {
  ctx.is(parse(1.132, { kind: ParserKind.INTEGER }), 1);
  ctx.is(parse('1.132', { kind: ParserKind.INTEGER }), 1);
});

spec.test('converts to float', (ctx) => {
  ctx.is(parse(1.234, { kind: ParserKind.FLOAT }), 1.234);
  ctx.is(parse('1.234', { kind: ParserKind.FLOAT }), 1.234);
});

spec.test('converts to date', (ctx) => {
  ctx.deepEqual(parse(100000, { kind: ParserKind.DATE }), new Date(100000));
  ctx.deepEqual(parse('100000', { kind: ParserKind.DATE }), new Date(100000));
});

spec.test('converts to arrays', (ctx) => {
  ctx.deepEqual(parse(100, { kind: ParserKind.ARRAY }), [100]);
  ctx.deepEqual(parse(100, { kind: ParserKind.ARRAY, parse: { kind: ParserKind.STRING } }), ['100']);
  ctx.deepEqual(parse([100, '200'], { kind: ParserKind.ARRAY, parse: { kind: ParserKind.STRING } }), ['100', '200']);
});

spec.test('converts to custom type', (ctx) => {
  ctx.deepEqual(parse(100, { kind: ParserKind.CUSTOM, handler(v) { return 'foo'; } }), 'foo');
});

export default spec;
