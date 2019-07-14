import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('returns an array of props', (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      parse: { handler: Book },
    })
    book: Book;
    @prop({
      parse: { array: true, handler: Book },
    })
    books: Book[];
  }
  const user = new User({
    name: 'foo',
    book: {
      title: 'bar',
    },
    books: [
    undefined,
      {
        title: 'baz',
      },
    ],
  });
  const items = user.flatten();
  ctx.deepEqual(items.map((f) => f.path), [
    ['name'],
    ['book'],
    ['book', 'title'],
    ['books'],
    ['books', 0],
    ['books', 1],
    ['books', 1, 'title'],
  ]);
  ctx.is(items[2].prop, user.getProp(['book', 'title'])); // ref to prop
  ctx.is(items[5].prop, user.getProp(['books'])); // array values ref to parent prop
  ctx.is(items[0].value, 'foo');
  ctx.is(items[4].value, undefined);
  ctx.is(items[6].value, 'baz');
});

spec.test('supports serialization strategies', (ctx) => {
  class User extends Model {
    @prop()
    name: string;
    @prop({
      serializable: ['input'],
    })
    email: string;
  }
  const user = new User({
    name: 'foo',
    email: 'baz',
  });
  const items = user.flatten('input');
  ctx.is(items.length, 1);
});

export default spec;
