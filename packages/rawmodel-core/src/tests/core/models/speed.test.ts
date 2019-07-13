import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('creation of ~50k models', (ctx) => {
  class Author extends Model {
    @prop({
      cast: { handler: 'Number' },
      serializable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
      serializable: ['output'],
    })
    name: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    email: string;
  }
  class Book extends Model {
    @prop({
      cast: { handler: 'Number' },
      serializable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
    })
    title: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    description: string;
    @prop({
      cast: { handler: Author, array: true },
      populatable: ['input'],
    })
    author: Author[];
  }
  class User extends Model {
    @prop({
      cast: { handler: 'Number' },
      serializable: ['output'],
    })
    id: number;
    @prop({
      cast: { handler: 'String' },
      serializable: ['output'],
    })
    name: string;
    @prop({
      cast: { handler: 'String' },
      populatable: ['input'],
    })
    email: string;
    @prop({
      cast: { handler: Book },
    })
    book0: Book;
    @prop({
      cast: { handler: Book },
    })
    book1: Book;
    @prop({
      cast: { handler: Book, array: true },
      populatable: ['input'],
    })
    books: Book[];
  }
  const sampleBooks = Array(1000).fill(null).map(() => ({
    id: 300,
    title: 'Baz',
    description: 'Zed',
    author: [
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
    ],
  }));
  const sampleUsers = Array(10).fill(null).map(() => ({
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: sampleBooks[0],
    book1: sampleBooks[1],
    books: [...sampleBooks],
  }));
  const users = sampleUsers.map((data) => new User(data));
  ctx.is(users.length, 10);
});

export default spec;
