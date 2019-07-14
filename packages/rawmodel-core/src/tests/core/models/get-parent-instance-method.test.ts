import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an instance of the parent model', (ctx) => {
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
    book: {
      title: 200,
    },
    books: [
      undefined,
      {
        title: 300,
      },
    ],
  });
  ctx.is(user.getParent(), null);
  ctx.is(user.book.getParent(), user);
  ctx.is(user.books[1].getParent(), user);
});

export default spec;
