import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property value is empty', (ctx) => {
  const prop = new Prop();
  ctx.true(prop.isEmpty());
  prop.setValue(null);
  ctx.true(prop.isEmpty());
  prop.setValue('');
  ctx.true(prop.isEmpty());
  prop.setValue('foo');
  ctx.false(prop.isEmpty());
  prop.setValue([]);
  ctx.true(prop.isEmpty());
  prop.setValue([null]);
  ctx.false(prop.isEmpty());
});

export default spec;
