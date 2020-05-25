import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('manage committed states', (ctx) => {
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
});

export default spec;
