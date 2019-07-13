import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('deeply serializes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      cast: { handler: 'Number' },
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
      serializable: ['output'],
    })
    title: string;
    @prop({
      cast: { handler: 'String' },
      serializable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      cast: { handler: 'Number' },
      serializable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    name: string;
    @prop({
      cast: { handler: 'String' },
      serializable: ['input'],
    })
    email: string;
    @prop({
      cast: { handler: Book },
      serializable: ['output'],
    })
    book0: Book;
    @prop({
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      cast: { handler: Book, array: true },
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
