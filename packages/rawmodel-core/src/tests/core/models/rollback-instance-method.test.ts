import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('manage committed states', (ctx) => {
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
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      {
        title: 'baz',
      },
    ],
  });
  user.commit();
  ctx.is(user.getProp('name').getInitialValue(), 'foo');
  ctx.is(user.getProp('book', 'title').getInitialValue(), 'bar');
  ctx.is(user.getProp('books', 0, 'title').getInitialValue(), 'baz');
  user.populate({
    name: 'foo-new',
    book: {
      title: 'bar-new',
    },
    books: [
      {
        title: 'baz-new',
      },
    ],
  });
  user.rollback();
  ctx.is(user.getProp('name').getValue(), 'foo');
  ctx.is(user.getProp('book', 'title').getValue(), 'bar');
  ctx.is(user.getProp('books', 0, 'title').getValue(), 'baz');
});

export default spec;
