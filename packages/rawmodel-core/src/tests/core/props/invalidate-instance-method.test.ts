import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('clears property errors', (ctx) => {
  const prop = new Prop();
  prop.setErrorCodes(100, 200, 300);
  prop.invalidate();
  ctx.deepEqual(prop.getErrorCodes(), []);
});

export default spec;
