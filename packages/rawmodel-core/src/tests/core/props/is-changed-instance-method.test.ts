import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property value has been changed', (ctx) => {
  class User extends Model {
    @prop()
    public name: string;
  }
  const user = new User();
  const prop0 = new Prop();
  ctx.false(prop0.isChanged());
  prop0.setValue(null);
  ctx.false(prop0.isChanged());
  prop0.setValue('foo');
  prop0.commit();
  ctx.false(prop0.isChanged());
  prop0.setValue(user);
  user.name = 'foo';
  ctx.true(prop0.isChanged());
});

export default spec;
