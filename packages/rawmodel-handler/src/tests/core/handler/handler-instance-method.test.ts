import { Spec } from '@hayspec/spec';
import { Handler } from '../../..';

const spec = new Spec();

spec.test('handles an error and returns error codes', async (ctx) => {
  const handler = new Handler();
  const recipes = [
    { code: 200, handler: (e) => e.message === 'foo' },
    { code: 201, handler: (e) => e.message === 'bar' },
    { code: 400, handler: (e) => e.message === 'foo' },
    { code: 401, handler: (e) => e.message === 'bar' },
  ];
  const error = new Error('foo');
  const codes = await handler.handle(error, recipes);
  ctx.deepEqual(codes, [200, 400]);
});

spec.test('can fail fast', async (ctx) => {
  const handler = new Handler({
    failFast: true,
  });
  const recipes = [
    { code: 400, handler: (v) => true },
    { code: 401, handler: (v) => true },
    { code: 402, handler: (v) => true },
  ];
  const codes = await handler.handle('foo', recipes);
  ctx.deepEqual(codes, [400]);
});

spec.test('supports conditional handlers', async (ctx) => {
  const handler = new Handler();
  const recipes = [
    { code: 100, handler: (v) => true, condition: (v) => true },
    { code: 200, handler: (v) => true, condition: (v) => false },
    { code: 300, handler: (v) => true },
  ];
  const codes = await handler.handle(true, recipes);
  ctx.deepEqual(codes, [100, 300]);
});

spec.test('passes context to each handler', async (ctx) => {
  const handler = new Handler({
    context: { foo: 'foo' },
  });
  const recipes = [
    { code: 100, handler(v) { return v === this.foo; } },
  ];
  const codes = await handler.handle('foo', recipes);
  ctx.deepEqual(codes, [100]);
});

spec.test('passes context to each condition', async (ctx) => {
  const handler = new Handler({
    context: { foo: 'foo' },
  });
  const recipes = [
    { code: 100, handler: (v) => true, condition(v) { return v === this.foo; } },
  ];
  const codes = await handler.handle('foo', recipes);
  ctx.deepEqual(codes, [100]);
});

spec.test('passes recipe to each handler', async (ctx) => {
  const handler = new Handler();
  const recipes = [
    { code: 100, handler: (v, r) => v === r.code },
  ];
  const codes = await handler.handle(100, recipes);
  ctx.deepEqual(codes, [100]);
});

spec.test('passes recipe to each condition', async (ctx) => {
  const handler = new Handler();
  const recipes = [
    { code: 100, handler: (v) => true, condition: (v, r) => r.code === 100 },
  ];
  const codes = await handler.handle(true, recipes);
  ctx.deepEqual(codes, [100]);
});

export default spec;
