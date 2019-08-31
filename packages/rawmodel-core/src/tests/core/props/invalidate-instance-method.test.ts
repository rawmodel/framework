import { Spec } from '@hayspec/spec';
import { Prop } from '../../..';

const spec = new Spec();

spec.test('clears property errors', (ctx) => {
  const prop = new Prop();
  prop.setErrorCode(100);
  prop.invalidate();
  ctx.deepEqual(prop.getErrorCode(), null);
});

export default spec;
