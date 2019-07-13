import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('gets property value', (ctx) => {
  const prop = new Prop();
  ctx.is(prop.getValue(), null);
  prop.setValue('foo');
  ctx.is(prop.getValue(), 'foo');
  prop.setValue('bar');
  ctx.is(prop.getValue(), 'bar');
  prop.setValue(() => 'zak');
  ctx.is(prop.getValue(), 'zak');
});

export default spec;
