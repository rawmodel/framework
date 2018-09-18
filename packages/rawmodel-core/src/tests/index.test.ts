import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!rawmodel.Model);
  t.true(!!rawmodel.Prop);
});

export default spec;
