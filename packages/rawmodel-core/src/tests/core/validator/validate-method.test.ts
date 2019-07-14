import { Spec } from '@hayspec/spec';
import { validate } from '../../..';

const spec = new Spec();

spec.test('validates a value and returns error codes', async (ctx) => {
  const recipes = [
    { code: 200, handler: (v) => v === 'foo' },
    { code: 201, handler: (v) => v === 'foo' },
    { code: 400, handler: (v) => v === 'bar' },
    { code: 401, handler: (v) => v === 'bar' },
  ];
  const codes = await validate('foo', recipes);
  ctx.deepEqual(codes, [400, 401]);
});

spec.test('can fail fast', async (ctx) => {
  const config = {
    failFast: true,
  };
  const recipes = [
    { code: 200, handler: (v) => false },
    { code: 201, handler: (v) => false },
    { code: 400, handler: (v) => false },
  ];
  const codes = await validate('foo', recipes, config);
  ctx.deepEqual(codes, [200]);
});

spec.test('supports conditional handlers', async (ctx) => {
  const recipes = [
    { code: 100, handler: (v) => false, condition: (v) => true },
    { code: 200, handler: (v) => false, condition: (v) => false },
    { code: 300, handler: (v) => false },
  ];
  const codes = await validate(true, recipes);
  ctx.deepEqual(codes, [100, 300]);
});

spec.test('passes context to each handler', async (ctx) => {
  const config = {
    context: { foo: 'foo' },
  };
  const recipes = [
    { code: 100, handler(v) { return v === this.foo; } },
  ];
  const codes = await validate('foo', recipes, config);
  ctx.deepEqual(codes, []);
});

spec.test('passes context to each condition', async (ctx) => {
  const config = {
    context: { foo: 'foo' },
  };
  const recipes = [
    { code: 100, handler: (v) => false, condition(v) { return v === this.foo; } },
  ];
  const codes = await validate('foo', recipes, config);
  ctx.deepEqual(codes, [100]);
});

spec.test('passes recipe to each handler', async (ctx) => {
  const recipes = [
    { code: 100, handler: (v, r) => v === r.code },
  ];
  const codes = await validate(100, recipes);
  ctx.deepEqual(codes, []);
});

spec.test('passes recipe to each condition', async (ctx) => {
  const recipes = [
    { code: 100, handler: (v) => false, condition: (v, r) => r.code === 100 },
  ];
  const codes = await validate(true, recipes);
  ctx.deepEqual(codes, [100]);
});

export default spec;
