import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('returns `true` if at least one prop has been changed', (ctx) => {
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
  const data = {
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
      null,
      {
        title: 'baz',
      },
    ],
  };
  const user0 = new User(data);
  const user1 = new User(data);
  const user2 = new User(data);
  const user3 = new User(data);
  const user4 = new User();
  ctx.true(user0.isChanged());
  user0.name = 'foo-new';
  ctx.true(user0.isChanged());
  user1.book.title = 'bar-new';
  ctx.true(user1.isChanged());
  user2.books[0] = { title: 'baz-new' } as Book; // model instances in array
  ctx.true(user2.isChanged());
  user3.books[1].title = 'baz-new';
  ctx.true(user3.isChanged());
  ctx.false(user4.isChanged()); // no data, no change
});

export default spec;
