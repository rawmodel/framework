import { Spec } from '@hayspec/spec';
import * as parsers from '..';

const spec = new Spec();

spec.test('exposed content', (t) => {
  t.true(!!parsers.arrayParser);
  t.true(!!parsers.booleanParser);
  t.true(!!parsers.dateParser);
  t.true(!!parsers.floatParser);
  t.true(!!parsers.integerParser);
  t.true(!!parsers.stringParser);
 });

export default spec;
