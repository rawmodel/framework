import { Spec } from '@hayspec/spec';
import { validate } from '../../..';

const spec = new Spec();

spec.test('validates a value and returns error codes', async (ctx) => {
  const recipes = [
    { code: 200, resolver: (v) => v === 'foo' },
    { code: 201, resolver: (v) => v === 'foo' },
    { code: 400, resolver: (v) => v === 'bar' },
    { code: 401, resolver: (v) => v === 'bar' },
  ];
  const codes = await validate('foo', recipes);
  ctx.deepEqual(codes, [400]);
});

spec.test('passes context to each resolver', async (ctx) => {
  const config = {
    context: { foo: 'foo' },
  };
  const recipes = [
    { code: 100, resolver(v) { return v === this.foo; } },
  ];
  const codes = await validate('foo', recipes, config);
  ctx.deepEqual(codes, []);
});

spec.test('passes recipe to each resolver', async (ctx) => {
  let note = null;
  const recipes = [
    { code: 100, resolver: (v, r) => note = r },
  ];
  await validate(100, recipes);
  ctx.is(note, recipes[0]);
});

export default spec;
