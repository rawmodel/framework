import { Spec } from '@hayspec/spec';
import { handle } from '../../..';

const spec = new Spec();

spec.test('handles an error and returns error codes', async (ctx) => {
  const recipes = [
    { code: 200, resolver(e) { return e.message === 'foo'; } },
    { code: 201, resolver(e) { return e.message === 'bar'; } },
  ];
  const error = new Error('foo');
  const codes = await handle(error, recipes);
  ctx.deepEqual(codes, [200]);
});

spec.test('passes context to each resolver', async (ctx) => {
  const config = {
    context: { foo: 'foo' },
  };
  const recipes = [
    { code: 100, resolver(v) { return v === this.foo; } },
  ];
  const codes = await handle('foo', recipes, config);
  ctx.deepEqual(codes, [100]);
});

spec.test('passes recipe to each resolver', async (ctx) => {
  let note = null;
  const recipes = [
    { code: 100, resolver: (v, r) => note = r },
  ];
  await ctx.notThrows(() => handle(100, recipes));
  ctx.deepEqual(note, recipes[0]);
});

export default spec;
