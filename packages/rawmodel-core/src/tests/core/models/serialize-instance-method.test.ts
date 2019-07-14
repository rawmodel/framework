import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('deeply serializes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      parse: {
        kind: ParserKind.FLOAT,
      },
    })
    id: number;
    @prop({
      parse: {
        kind: ParserKind.STRING,
      },
      serializable: ['output'],
    })
    title: string;
    @prop({
      parse: {
        kind: ParserKind.STRING,
      },
      serializable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      parse: {
        kind: ParserKind.FLOAT,
      },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parse: {
        kind: ParserKind.STRING,
      },
    })
    name: string;
    @prop({
      parse: {
        kind: ParserKind.STRING,
      },
      serializable: ['input'],
    })
    email: string;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
      serializable: ['output'],
    })
    book0: Book;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
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
      serializable: ['input'],
    })
    books: Book[];
  }
  const data = {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: null,
    books: [
      null,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  };
  const user = new User(data);
  const json0 = user.serialize('output');
  const json1 = user.serialize('input');
  ctx.deepEqual(json0, {
    id: 100,
    book0: {
      title: 'Foo',
    },
  });
  ctx.deepEqual(json1, {
    email: 'foo@bar.com',
    books: [
      null,
      {
        description: 'Zed',
      }
    ],
  });
});

export default spec;
