import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('copies property data to initial value', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('baz');
  ctx.is(prop.getInitialValue(), 'foo');
});

export default spec;
