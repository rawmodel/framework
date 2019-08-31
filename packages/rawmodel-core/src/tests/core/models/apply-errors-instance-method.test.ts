import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties errors', (ctx) => {
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
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], code: 100 },
    { path: ['book', 'title'], code: 200 },
    { path: ['books', 1, 'title'], code: 400 },
  ]);
  ctx.deepEqual(user.getProp('name').getErrorCode(), 100);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCode(), 200);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCode(), 400);
});

export default spec;
