import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('clears property errors', async (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      parser: { resolver: Book },
    })
    book: Book;
    @prop({
      parser: { array: true, resolver: Book },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], code: 100 },
    { path: ['book', 'title'], code: 200 },
    { path: ['books', 1, 'title'], code: 300 },
  ]);
  user.invalidate();
  ctx.deepEqual(user.getProp('name').getErrorCode(), null);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCode(), null);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCode(), null);
});

export default spec;
