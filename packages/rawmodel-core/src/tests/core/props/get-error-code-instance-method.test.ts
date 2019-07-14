import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('gets property error codes', (ctx) => {
  const prop = new Prop();
  ctx.deepEqual(prop.getErrorCodes(), []);
  prop.setErrorCodes(100, 200);
  ctx.deepEqual(prop.getErrorCodes(), [100, 200]);
});

export default spec;
