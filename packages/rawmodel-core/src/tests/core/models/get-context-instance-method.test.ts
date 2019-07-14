import { Spec } from '@hayspec/spec';
import { Model } from '../../..';

const spec = new Spec();

spec.test('returns configuration context', (ctx) => {
  interface Context {
    foo: string;
    bar: number;
  }
  class User extends Model<Context> {}
  const context = { foo: 'foo', bar: 1 };
  const user = new User(null, { context });
  ctx.is(user.getContext().foo, 'foo');
  ctx.is(user.getContext().bar, 1);
});

export default spec;
