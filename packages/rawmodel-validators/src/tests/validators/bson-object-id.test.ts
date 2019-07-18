import { Spec } from '@hayspec/spec';
import { bsonObjectIdValidator } from '../..';
import { ObjectId } from 'mongodb';

const spec = new Spec();

spec.test('passes when valid', (ctx) => {
  ctx.true(bsonObjectIdValidator()('5d30817cfad30c9eebe7d877'));
  ctx.true(bsonObjectIdValidator()(new ObjectId()));
});

spec.test('fails when not a string', (ctx) => {
  ctx.false(bsonObjectIdValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(bsonObjectIdValidator()('507f1f77bcf86cd7994390'));
});

export default spec;
