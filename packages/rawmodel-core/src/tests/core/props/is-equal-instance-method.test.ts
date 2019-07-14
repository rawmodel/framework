import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property value equals to the provided one', (ctx) => {
  const prop = new Prop();
  const fn = () => true;
  ctx.true(prop.isEqual(null));
  prop.setValue('foo');
  ctx.true(prop.isEqual('foo'));
  prop.setValue(fn);
  ctx.true(prop.isEqual(fn));
});

export default spec;
