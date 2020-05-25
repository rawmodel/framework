import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to their default values', (ctx) => {
  class Book extends Model {
    @prop({
      defaultValue: 'foo',
    })
    public title: string;
  }
  class User extends Model {
    @prop({
      defaultValue: 'bar',
    })
    public name: string;
    @prop({
      parser: { resolver: Book },
      defaultValue: {},
    })
    public book: Book;
    @prop({
      parser: { array: true, resolver: Book },
      defaultValue: [null, {}],
    })
    public books: Book[];
  }
  const user = new User({
    name: 'fake',
    book: {
      title: 'fake',
    },
    books: [
      {
        title: 'fake',
      },
    ],
  });
  user.reset();
  ctx.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo',
    },
    books: [
      null,
      {
        title: 'foo',
      },
    ],
  });
});

export default spec;
