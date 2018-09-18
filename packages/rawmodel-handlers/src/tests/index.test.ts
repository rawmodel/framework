import { Spec } from '@hayspec/spec';
import * as handlers from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!handlers.mongoUniquenessHandler);
 });

export default spec;
