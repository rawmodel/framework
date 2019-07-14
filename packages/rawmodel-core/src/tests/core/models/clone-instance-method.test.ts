import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('returns an exact copy of the original', (ctx) => {
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
  const parent = new Book();
  const user = new User({
    parent, // fake parent
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      null,
      {
        title: 'baz'
      },
    ],
  });
  const clone0 = user.clone();
  const clone1 = user.clone({book: { title: 'foo' }});
  ctx.true(clone0 !== user);
  ctx.true(clone0.isEqual(user));
  ctx.is(clone0.book.getParent(), clone0);
  ctx.is(clone0.getParent(), null);
  ctx.is(clone0.getRoot(), clone0);
  ctx.is(clone1.book.title, 'foo');
});

export default spec;
