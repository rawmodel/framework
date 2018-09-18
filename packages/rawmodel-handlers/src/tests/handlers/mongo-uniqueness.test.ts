import { Spec } from '@hayspec/spec';
import { mongoUniquenessHandler } from '../..';

const spec = new Spec();

spec.test('fails when not matching error', (ctx) => {
  const error = new Error();
  ctx.false(mongoUniquenessHandler()('text'));
  ctx.false(mongoUniquenessHandler()(error));
});

spec.test('succeeds when matching error', (ctx) => {
  const error0 = { message: 'E11000 duplicate key error index: test.users.$uniqueEmail dup key: { : \"me@domain.com\" }' };
  const error1 = { message: 'E11000 duplicate key error collection: db.users index: name_1 dup key: { : "Kate" }' };
  const error2 = { message: 'E11000 duplicate key error index: myDb.myCollection.$id dup key: { : ObjectId(\'57226808ec55240c00000272\') }' };
  const error3 = { message: 'E11000 duplicate key error index: test.collection.$a.b_1 dup key: { : null }' };
  const error4 = { message: 'E11000 duplicate key error collection: upsert_bug.col index: _id_ dup key: { : 3.0 }' };
  ctx.true(mongoUniquenessHandler({ indexName: 'uniqueEmail' })(error0));
  ctx.true(mongoUniquenessHandler({ indexName: 'name' })(error1));
  ctx.true(mongoUniquenessHandler({ indexName: 'id' })(error2));
  ctx.true(mongoUniquenessHandler({ indexName: 'b' })(error3));
  ctx.true(mongoUniquenessHandler({ indexName: '_id' })(error4));
});

export default spec;
