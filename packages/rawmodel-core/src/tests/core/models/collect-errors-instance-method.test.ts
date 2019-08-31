import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an array of errors', (ctx) => {
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
    books: [{}]
  });
  user.getProp('name').setErrorCode(100);
  user.getProp('book', 'title').setErrorCode(200);
  user.getProp('books', 0, 'title').setErrorCode(400);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], code: 100 },
    { path: ['book', 'title'], code: 200 },
    { path: ['books', 0, 'title'], code: 400 },
  ]);
});

export default spec;
