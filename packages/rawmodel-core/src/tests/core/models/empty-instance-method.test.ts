import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to `null`', (ctx) => {
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
      emptyValue: 'null',
    })
    public description: string;
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
    description: 'fake',
    book: {
      title: 'fake',
    },
    books: [
      {
        title: 'fake',
      },
    ],
  });
  user.empty();
  ctx.deepEqual(user.serialize(), {
    name: null,
    description: 'null',
    book: null,
    books: null,
  });
});

export default spec;
