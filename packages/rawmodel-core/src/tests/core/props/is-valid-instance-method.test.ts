import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property has no errors', (ctx) => {
  class User extends Model {
    @prop()
    public name: string;
  }
  const user = new User();
  const prop0 = new Prop();
  ctx.true(prop0.isValid());
  prop0.setErrorCode(100);
  ctx.false(prop0.isValid());
  prop0.setErrorCode(null);
  prop0.setValue(user);
  ctx.true(prop0.isValid());
  prop0.__config.parser = { resolver: User }; // nested model type
  user.getProp('name').setErrorCode(200); // nested model error
  ctx.false(prop0.isValid());
});

export default spec;
