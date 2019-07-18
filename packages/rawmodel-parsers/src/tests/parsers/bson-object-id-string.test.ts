import { Spec } from '@hayspec/spec';
import { ObjectId } from 'mongodb';
import { bsonObjectIdStringParser } from '../..';

const spec = new Spec();

spec.test('converts any value to a BSON Object ID string', (ctx) => {
  const id = new ObjectId();
  ctx.is(bsonObjectIdStringParser()(id), id.toString());
  ctx.is(bsonObjectIdStringParser()('5d30817cfad30c9eebe7d877'), '5d30817cfad30c9eebe7d877');
  ctx.is(bsonObjectIdStringParser()(null), null);
  ctx.is(bsonObjectIdStringParser()(undefined), undefined);
});

export default spec;
