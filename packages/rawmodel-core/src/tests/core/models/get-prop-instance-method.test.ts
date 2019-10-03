import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an instance of a prop at path', (ctx) => {
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
    name: 'foo',
    book: {
      title: 'bar'
    },
    books: [
      undefined,
      {
        title: 'baz'
      }
    ]
  });
  ctx.is(user.getProp(['name']).getValue(), 'foo');
  ctx.is(user.getProp('name').getValue(), 'foo');
  ctx.is(user.getProp(['book', 'title']).getValue(), 'bar');
  ctx.is(user.getProp('book', 'title').getValue(), 'bar');
  ctx.is(user.getProp(['books', 1]), user.getProp(['books'])); // array items refer to parent prop
  ctx.is(user.getProp(['books', 1, 'title']).getValue(), 'baz');
  ctx.is(user.getProp('books', 1, 'title').getValue(), 'baz');
  ctx.is(user.getProp(['fake']), undefined);
  ctx.is(user.getProp(['fake', 10, 'title']), undefined);
  ctx.is(user.getProp(), undefined);
});

export default spec;
