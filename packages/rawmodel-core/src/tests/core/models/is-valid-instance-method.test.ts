import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('tell if model has no errors', async (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      parse: { resolver: Book },
    })
    book: Book;
    @prop({
      parse: { array: true, resolver: Book },
    })
    books: Book[];
  }
  const user0 = new User({
    book: {},
    books: [null, {}]
  });
  const user1 = new User();
  ctx.true(user0.isValid());
  ctx.true(user1.isValid());
  user0.applyErrors([
    { path: ['books', 1, 'title'], code: 100},
  ]);
  ctx.false(user0.isValid());
});

export default spec;
