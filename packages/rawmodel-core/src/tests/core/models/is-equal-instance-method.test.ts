import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns `true` when the passing object looks the same', (ctx) => {
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
  ctx.true(new User(data).isEqual(new User(data)));
});

export default spec;
