import { Spec } from '@hayspec/spec';
import * as rawmodel from '../src';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!rawmodel.Model);
  t.true(!!rawmodel.Prop);
  t.true(!!rawmodel.Handler);
  t.true(!!rawmodel.Validator);
  t.true(!!rawmodel.cast);
});

export default spec;
