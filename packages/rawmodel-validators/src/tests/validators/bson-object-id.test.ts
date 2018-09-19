import { Spec } from '@hayspec/spec';
import { bsonObjectIdValidator } from '../..';

const spec = new Spec();

spec.test('fails when not a string', (ctx) => {
  ctx.false(bsonObjectIdValidator()(true));
});

spec.test('fails when invalid', (ctx) => {
  ctx.false(bsonObjectIdValidator()('507f1f77bcf86cd7994390'));
});

spec.test('passes when valid', (ctx) => {
  ctx.true(bsonObjectIdValidator()('507f1f77bcf86cd799439011'));
});

export default spec;
