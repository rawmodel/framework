import { Spec } from '@hayspec/spec';
import { dateParser } from '../..';

const spec = new Spec();

spec.test('converts any value to a date object', (ctx) => {
  const d = new Date();
  ctx.is(dateParser()(d), d);
  ctx.deepEqual(dateParser()(100000), new Date(100000));
  ctx.deepEqual(dateParser()('2016-01-02'), new Date('2016-01-02'));
  ctx.is(dateParser()(undefined), undefined);
  ctx.is(dateParser()(null), null);
  ctx.is(dateParser()('8sadufsdjfk1231'), null);
});

export default spec;
