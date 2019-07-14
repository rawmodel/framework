import { Spec } from '@hayspec/spec';
import { Model, Prop, prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property has no errors', (ctx) => {
  class User extends Model {
    @prop()
    name: string;
  }
  const user = new User();
  const prop0 = new Prop();
  ctx.true(prop0.isValid());
  prop0.setErrorCodes(100);
  ctx.false(prop0.isValid());
  prop0.setErrorCodes();
  prop0.setValue(user);
  ctx.true(prop0.isValid());
  prop0.$config.parse = { handler: User }; // nested model type
  user.getProp('name').setErrorCodes(200); // nested model error
  ctx.false(prop0.isValid());
});

export default spec;
