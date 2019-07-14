import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('resets property to default value', (ctx) => {
  const prop = new Prop({
    defaultValue: 'foo',
  });
  prop.setValue('bar');
  prop.commit();
  prop.setValue('baz');
  prop.reset();
  ctx.is(prop.getValue(), 'foo');
});

export default spec;
