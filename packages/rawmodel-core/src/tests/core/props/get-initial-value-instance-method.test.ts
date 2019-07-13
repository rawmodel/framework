import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns property value on last commit', (ctx) => {
  const prop = new Prop();
  prop.setValue('foo');
  prop.commit();
  prop.setValue('bar');
  ctx.is(prop.getInitialValue(), 'foo');
  prop.setValue(false);
  prop.commit();
  prop.setValue(true);
  ctx.is(prop.getInitialValue(), false);
});

export default spec;
