import { Spec } from '@hayspec/spec';
import * as parser from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!parser.cast);
});

export default spec;
