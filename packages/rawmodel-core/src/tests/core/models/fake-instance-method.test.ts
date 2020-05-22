import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to their fake values', (ctx) => {
  class Book extends Model {
    @prop({
      fakeValue: 'foo',
    })
    public title: string;
  }
  class User extends Model {
    @prop({
      fakeValue: 'bar',
    })
    public name: string;
    @prop({
      parser: { resolver: Book },
      fakeValue: 'bar',
    })
    public book: Book;
    @prop({
      parser: { array: true, resolver: Book },
      fakeValue: [null, {}],
    })
    public books: Book[];
  }
  const user = new User();
  user.fake();
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
