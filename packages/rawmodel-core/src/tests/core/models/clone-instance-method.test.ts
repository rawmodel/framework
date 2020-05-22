import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an exact copy of the original', (ctx) => {
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
  const parent = new Book();
  const user = new User({
    parent, // fake parent
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
  });
  const clone0 = user.clone();
  const clone1 = user.clone({book: { title: 'foo' }});
  ctx.true(clone0 !== user);
  ctx.true(clone0.isEqual(user));
  ctx.deepEqual(clone0.getAncestors(), []);
  ctx.deepEqual(clone0.book.getAncestors(), [clone0]);
  ctx.is(clone1.book.title, 'foo');
});

export default spec;
