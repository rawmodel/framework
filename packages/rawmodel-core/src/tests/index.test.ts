import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!rawmodel.Model);
  t.true(!!rawmodel.Prop);
  t.true(!!rawmodel.parse);
  t.true(!!rawmodel.validate);
  t.true(!!rawmodel.handle);
});

export default spec;
