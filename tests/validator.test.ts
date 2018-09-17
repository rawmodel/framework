import { Spec } from '@hayspec/spec';
import { Validator } from '../src';

const spec = new Spec();

spec.test('methods `validate` validates a value and returns error codes', async (ctx) => {
  const validator = new Validator();
  const recipes = [
    { code: 200, handler: (v) => v === 'foo' },
    { code: 201, handler: (v) => v === 'foo' },
    { code: 400, handler: (v) => v === 'bar' },
    { code: 401, handler: (v) => v === 'bar' },
  ];
  const codes = await validator.validate('foo', recipes);
  ctx.deepEqual(codes, [400, 401]);
});

spec.test('methods `validate` can fail fast', async (ctx) => {
  const validator = new Validator({
    failFast: true,
  });
  const recipes = [
    { code: 200, handler: (v) => false },
    { code: 201, handler: (v) => false },
    { code: 400, handler: (v) => false },
  ];
  const codes = await validator.validate('foo', recipes);
  ctx.deepEqual(codes, [200]);
});

spec.test('methods `validate` supports conditional handlers', async (ctx) => {
  const validator = new Validator();
  const recipes = [
    { code: 100, handler: (v) => false, condition: (v) => true },
    { code: 200, handler: (v) => false, condition: (v) => false },
    { code: 300, handler: (v) => false },
  ];
  const codes = await validator.validate(true, recipes);
  ctx.deepEqual(codes, [100, 300]);
});

spec.test('methods `validate` passes context to each handler', async (ctx) => {
  const validator = new Validator({
    ctx: { foo: 'foo' },
  });
  const recipes = [
    { code: 100, handler(v) { return v === this.foo} },
  ];
  const codes = await validator.validate('foo', recipes);
  ctx.deepEqual(codes, []);
});

spec.test('methods `validate` passes context to each condition', async (ctx) => {
  const validator = new Validator({
    ctx: { foo: 'foo' },
  });
  const recipes = [
    { code: 100, handler: (v) => false, condition(v) { return v === this.foo } },
  ];
  const codes = await validator.validate('foo', recipes);
  ctx.deepEqual(codes, [100]);
});

spec.test('methods `validate` passes recipe to each handler', async (ctx) => {
  const validator = new Validator();
  const recipes = [
    { code: 100, handler: (v, r) => v === r.code },
  ];
  const codes = await validator.validate(100, recipes);
  ctx.deepEqual(codes, []);
});

spec.test('methods `validate` passes recipe to each condition', async (ctx) => {
  const validator = new Validator();
  const recipes = [
    { code: 100, handler: (v) => false, condition: (v, r) => r.code === 100 },
  ];
  const codes = await validator.validate(true, recipes);
  ctx.deepEqual(codes, [100]);
});

export default spec;
