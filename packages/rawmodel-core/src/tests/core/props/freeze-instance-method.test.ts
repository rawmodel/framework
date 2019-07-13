import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('makes property not settable', async (ctx) => {
  const prop = new Prop();
  prop.freeze();
  ctx.throws(() => prop.setValue('foo'));
});

export default spec;
