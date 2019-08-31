import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('sets property error codes', (ctx) => {
  const prop = new Prop();
  ctx.deepEqual(prop.getErrorCode(), null);
  prop.setErrorCode(200);
  ctx.deepEqual(prop.getErrorCode(), 200);
});

export default spec;
