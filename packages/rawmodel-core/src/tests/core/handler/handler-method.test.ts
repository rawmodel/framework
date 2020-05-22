import { Spec } from '@hayspec/spec';
import { handle } from '../../..';

const spec = new Spec();

spec.test('handles an error and returns error codes', async (ctx) => {
  const recipes = [
    { code: 200, resolver(e) {
      return e.message === 'foo';
    } },
    { code: 201, resolver(e) {
      return e.message === 'bar';
    } },
  ];
  const error = new Error('foo');
  const code = await handle(error, recipes);
  ctx.deepEqual(code, 200);
});

spec.test('passes context to each resolver', async (ctx) => {
  const config = {
    context: { foo: 'foo' },
  };
  const recipes = [
    { code: 100, resolver(v) {
      return v === this.foo;
    } },
  ];
  const code = await handle('foo', recipes, config);
  ctx.deepEqual(code, 100);
});

export default spec;
