import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!rawmodel.Model);
  ctx.true(!!rawmodel.Prop);
  ctx.true(!!rawmodel.parse);
  ctx.true(!!rawmodel.validate);
  ctx.true(!!rawmodel.handle);
});

export default spec;
