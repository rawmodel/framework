import { Spec } from '@hayspec/spec';
import * as handlers from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!handlers.mongoUniquenessHandler);
 });

export default spec;
