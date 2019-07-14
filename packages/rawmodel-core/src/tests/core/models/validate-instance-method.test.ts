import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('validates properties or throws on error', async (ctx) => {
  const validate = [
    { handler: (v) => !!v, code: 100 },
    { handler: (v) => !!v, code: 200 },
  ];
  class Book extends Model {
    @prop({
      validate,
    })
    title: string;
  }
  class User extends Model {
    @prop({
      validate,
    })
    name: string;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
      validate,
    })
    book0: Book;
    @prop({
      parse: {
        kind: ParserKind.ARRAY,
        parse: {
          kind: ParserKind.MODEL,
          model: Book,
        },
      },
      validate,
    })
    books0: Book[];
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
      validate,
    })
    book1: Book;
    @prop({
      parse: {
        kind: ParserKind.ARRAY,
        parse: {
          kind: ParserKind.MODEL,
          model: Book,
        },
      },
      validate,
    })
    books1: Book[];
  }
  const user = new User({
    book1: {},
    books1: [{}]
  });
  const errors = [100, 200];
  await user.validate({ quiet: true });
  ctx.is(await user.validate().catch(() => false), false);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

spec.test('validates polymorphic arrays', async (ctx) => {
  const validate = [
    { handler: (v) => !!v, code: 100 },
  ];
  class Book extends Model {
    @prop({
      validate,
    })
    title: string;
  }
  class User extends Model {
    @prop({
      parse: {
        kind: ParserKind.ARRAY,
        parse: {
          kind: ParserKind.CUSTOM,
          handler(v) {
            if (v && v.kind === 'Book') {
              return new Book(v);
            } else {
              return v;
            }
          },
        },
      },
      validate,
    })
    books: Book[];
  }
  const user = new User({
    books: ['foo', { kind: 'Book' }],
  });
  ctx.is(await user.validate().catch(() => false), false);
  ctx.deepEqual(user.collectErrors(), [
    { path: ['books', 1, 'title'], errors: [100] },
  ]);
});

export default spec;
