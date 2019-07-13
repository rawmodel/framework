import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('returns true if the property value can be read using strategy', (ctx) => {
  const prop = new Prop({
    serializable: ['foo'],
  });
  ctx.true(prop.isSerializable());
  ctx.true(prop.isSerializable('foo'));
  ctx.false(prop.isSerializable('bar'));
});

export default spec;
