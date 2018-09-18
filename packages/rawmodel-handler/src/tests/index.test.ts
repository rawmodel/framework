import { Spec } from '@hayspec/spec';
import * as handler from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!handler.Handler);
 });

export default spec;
