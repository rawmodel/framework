import { Spec } from '@hayspec/spec';
import { floatParser, stringParser } from '@rawmodel/parsers';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('creation of ~5k models', (ctx) => {
  class Author extends Model {
    @prop({
      parser: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
      serializable: ['output'],
    })
    name: string;
    @prop({
      parser: { resolver: stringParser() },
      populatable: ['input'],
    })
    email: string;
  }
  class Book extends Model {
    @prop({
      parser: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
    })
    title: string;
    @prop({
      parser: { resolver: stringParser() },
      populatable: ['input'],
    })
    description: string;
    @prop({
      parser: { array: true, resolver: Author },
      populatable: ['input'],
    })
    author: Author[];
  }
  class User extends Model {
    @prop({
      parser: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
      serializable: ['output'],
    })
    name: string;
    @prop({
      parser: { resolver: stringParser() },
      populatable: ['input'],
    })
    email: string;
    @prop({
      parser: { resolver: Book },
    })
    book0: Book;
    @prop({
      parser: { resolver: Book },
    })
    book1: Book;
    @prop({
      parser: { array: true, resolver: Book },
      populatable: ['input'],
    })
    books: Book[];
  }
  const sampleBooks = Array(500).fill(null).map(() => ({
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
  const sampleUsers = Array(100).fill(null).map(() => ({
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: sampleBooks[0],
    book1: sampleBooks[1],
    books: [...sampleBooks],
  }));
  const users = sampleUsers.map((data) => new User(data));
  ctx.is(users.length, 100);
});

export default spec;
