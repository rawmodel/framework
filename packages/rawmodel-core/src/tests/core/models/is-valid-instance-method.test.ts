import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('tell if model has no errors', async (ctx) => {
  class Book extends Model {
    @prop()
    public title: string;
  }
  class User extends Model {
    @prop()
    public name: string;
    @prop({
      parser: { resolver: Book },
    })
    public book: Book;
    @prop({
      parser: { array: true, resolver: Book },
    })
    public books: Book[];
  }
  const user0 = new User({
    book: {},
    books: [null, {}],
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
