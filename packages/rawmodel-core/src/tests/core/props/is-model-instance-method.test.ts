import { Spec } from '@hayspec/spec';
import { Model, Prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property type represents a Model', (ctx) => {
  class User extends Model {}
  const prop = new Prop({
    cast: { handler: Model },
  });
  ctx.true(prop.isModel());
  prop.$config.cast.handler = User;
  ctx.true(prop.isModel());
  prop.$config.cast.handler = () => Model;
  ctx.false(prop.isModel());
});

export default spec;
