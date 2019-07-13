import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns raw property value', (ctx) => {
  const prop = new Prop();
  const value = () => true;
  prop.setValue(value);
  ctx.is(value, value);
});

export default spec;
