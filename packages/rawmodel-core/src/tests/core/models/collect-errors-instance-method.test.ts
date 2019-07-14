import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

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
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
    })
    book: Book;
    @prop({
      parse: {
        kind: ParserKind.ARRAY,
        parse: {
          kind: ParserKind.MODEL,
          model: Book,
        },
      },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [{}]
  });
  user.getProp('name').setErrorCodes(100);
  user.getProp('book', 'title').setErrorCodes(200, 300);
  user.getProp('books', 0, 'title').setErrorCodes(400);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200, 300] },
    { path: ['books', 0, 'title'], errors: [400] },
  ]);
});

export default spec;
