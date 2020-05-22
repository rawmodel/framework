import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns `true` if the prop exists', (ctx) => {
  class User extends Model {
    @prop()
    public name: string;
  }
  const user = new User();
  ctx.is(user.hasProp(['name']), true);
  ctx.is(user.hasProp(['book', 'title']), false);
});

export default spec;
