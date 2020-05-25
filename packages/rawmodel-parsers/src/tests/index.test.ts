import { Spec } from '@hayspec/spec';
import * as parsers from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!parsers.arrayParser);
  ctx.true(!!parsers.booleanParser);
  ctx.true(!!parsers.bsonObjectIdStringParser);
  ctx.true(!!parsers.dateParser);
  ctx.true(!!parsers.floatParser);
  ctx.true(!!parsers.integerParser);
  ctx.true(!!parsers.stringParser);
});

export default spec;
