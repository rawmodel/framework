import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to their default values', (ctx) => {
  class Book extends Model {
    @prop({
      defaultValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      defaultValue: 'bar',
    })
    name: string;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
      defaultValue: {},
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
      defaultValue: [null, {}],
    })
    books: Book[];
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
