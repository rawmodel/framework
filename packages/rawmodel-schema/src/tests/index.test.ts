import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!rawmodel.createModelClass);
});

export default spec;
